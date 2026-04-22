import { getCachedKey, storeKey } from "./apiKeyCache";
import "./instrumentation";
import express, { Request, Response } from "express";
import axios from "axios";
import { SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("spanscout-ingestion-gateway");

const app = express();
const port = 3002;

app.use(
  express.raw({
    type: "application/json",
    limit: "10mb",
  }),
);

const CONTROL_PLANE_URL = "http://localhost:3001";
const OTEL_COLLECTOR_TRACES_URL = "http://localhost:4320/v1/traces";

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/v1/traces", async (req: Request, res: Response) => {
  return tracer.startActiveSpan("ingestion.traces", async (span) => {
    try {
      const apiKey = req.header("x-spanscout-api-key");

      if (!apiKey) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "missing API key",
        });

        span.setAttribute("spanscout.auth.valid", false);
        span.setAttribute("spanscout.auth.cache_hit", false);

        span.end();

        return res.status(401).json({
          error: "missing_api_key",
          message: "x-spanscout-api-key header is required",
        });
      }

      const cached = getCachedKey(apiKey);

      if (cached) {
        if (cached.revokedAt) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: "revoked API key",
          });

          span.setAttribute("spanscout.auth.valid", false);
          span.setAttribute("spanscout.auth.cache_hit", true);

          span.end();

          return res.status(403).json({
            error: "revoked_api_key",
            message: "API key has been revoked",
          });
        }
        span.setAttribute("spanscout.auth.valid", true);
        span.setAttribute("spanscout.auth.cache_hit", true);
        span.setAttribute("spanscout.project.id", cached.projectId);
        span.setAttribute("spanscout.project.slug", cached.projectSlug);
        span.setAttribute("spanscout.api_key.prefix", cached.keyPrefix);
        span.setAttribute("spanscout.ingestion.kind", "traces");

        await axios.post(OTEL_COLLECTOR_TRACES_URL, req.body, {
          headers: {
            "Content-Type": "application/json",
            "x-spanscout-project-id": cached.projectId,
            "x-spanscout-project-slug": cached.projectSlug,
            "x-spanscout-api-key-prefix": cached.keyPrefix,
          },
          timeout: 5000,
        });

        span.end();

        return res.status(200).json({
          accepted: true,
          project: {
            id: cached.projectId,
            slug: cached.projectSlug,
          },
          cacheHit: true,
        });
      }

      span.setAttribute("spanscout.auth.cache_hit", false);

      const validationResponse = await axios.post(
        `${CONTROL_PLANE_URL}/ingestion/validate-key`,
        { apiKey },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 3000,
        },
      );

      if (!validationResponse.data?.valid) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "invalid API key",
        });

        span.setAttribute("spanscout.auth.valid", false);

        span.end();

        return res.status(403).json({
          error: "invalid_api_key",
          message: "API key is invalid",
        });
      }

      const project = validationResponse.data.project;
      const keyInfo = validationResponse.data.apiKey;

      if (keyInfo.revokedAt) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "revoked API key",
        });

        span.setAttribute("spanscout.auth.valid", false);

        span.end();

        return res.status(403).json({
          error: "revoked_api_key",
          message: "API key has been revoked",
        });
      }

      storeKey(apiKey, project.id, project.slug, keyInfo.prefix, keyInfo.revokedAt);

      span.setAttribute("spanscout.auth.valid", true);
      span.setAttribute("spanscout.project.id", project.id);
      span.setAttribute("spanscout.project.slug", project.slug);
      span.setAttribute("spanscout.api_key.prefix", keyInfo.prefix);
      span.setAttribute("spanscout.ingestion.kind", "traces");

      await axios.post(OTEL_COLLECTOR_TRACES_URL, req.body, {
        headers: {
          "Content-Type": "application/json",
          "x-spanscout-project-id": project.id,
          "x-spanscout-project-slug": project.slug,
          "x-spanscout-api-key-prefix": keyInfo.prefix,
        },
        timeout: 5000,
      });

      span.end();

      return res.status(200).json({
        accepted: true,
        project: {
          id: project.id,
          slug: project.slug,
        },
        cacheHit: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });

        span.end();

        return res.status(error.response?.status ?? 500).json({
          error: "upstream_error",
          details: error.response?.data ?? error.message,
        });
      }

      const err = error as Error;

      span.recordException(err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });

      span.end();

      return res.status(500).json({
        error: "internal_error",
        message: "Unexpected gateway error",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`SpanScout ingestion gateway listening on port ${port}`);
});