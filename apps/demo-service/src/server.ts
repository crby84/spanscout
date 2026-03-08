import "./instrumentation";
import express from "express";
import pino from "pino";
import { trace, SpanStatusCode } from "@opentelemetry/api";

const app = express();
const logger = pino();
const port = 8080;
const tracer = trace.getTracer("spanscout-demo-service");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/hello", async (_req, res) => {
  logger.info({ route: "/hello" }, "hello route called");

  await tracer.startActiveSpan("prepare-response", async (span) => {
    await sleep(50);
    span.end();
  });

  res.json({ message: "Hello from SpanScout demo service" });
});

app.get("/slow", async (_req, res) => {
  logger.info({ route: "/slow" }, "slow route called");

  await tracer.startActiveSpan("validate-input", async (span) => {
    await sleep(150);
    span.end();
  });

  await tracer.startActiveSpan("simulate-db-call", async (span) => {
    span.setAttribute("db.system", "postgresql");
    span.setAttribute("db.operation", "SELECT");
    await sleep(400);
    span.end();
  });

  await tracer.startActiveSpan("simulate-external-api", async (span) => {
    span.setAttribute("http.method", "GET");
    span.setAttribute("external.service", "pricing-service");
    await sleep(650);
    span.end();
  });

  res.json({ message: "Slow response complete" });
});

app.get("/error", async (_req, res) => {
  logger.error({ route: "/error" }, "error route called");

  await tracer.startActiveSpan("business-logic", async (span) => {
    try {
      await sleep(100);
      throw new Error("Intentional demo failure");
    } catch (error) {
      const err = error as Error;
      span.recordException(err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      span.end();

      return res.status(500).json({ error: err.message });
    }
  });
});

app.listen(port, () => {
  logger.info({ port }, "demo service started");
});