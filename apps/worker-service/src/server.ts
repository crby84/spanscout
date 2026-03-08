import "./instrumentation";
import express from "express";
import pino from "pino";
import { trace } from "@opentelemetry/api";

const app = express();
const logger = pino();
const port = 8081;
const tracer = trace.getTracer("spanscout-worker-service");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/work", async (_req, res) => {
  logger.info({ route: "/work" }, "worker route called");

  await tracer.startActiveSpan("simulate-db-call", async (span) => {
    span.setAttribute("db.system", "postgresql");
    span.setAttribute("db.operation", "SELECT");
    await sleep(300);
    span.end();
  });

  await tracer.startActiveSpan("prepare-result", async (span) => {
    await sleep(150);
    span.end();
  });

  res.json({
    status: "ok",
    worker: "spanscout-worker-service",
  });
});

app.listen(port, () => {
  logger.info({ port }, "worker service started");
});