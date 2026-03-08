import "./instrumentation";
import express from "express";
import pino from "pino";

const app = express();
const logger = pino();
const port = 8080;

app.get("/hello", (_req, res) => {
  logger.info({ route: "/hello" }, "hello route called");
  res.json({ message: "Hello from SpanScout demo service" });
});

app.get("/slow", async (_req, res) => {
  logger.info({ route: "/slow" }, "slow route called");

  await new Promise((resolve) => setTimeout(resolve, 1200));

  res.json({ message: "Slow response complete" });
});

app.get("/error", (_req, res) => {
  logger.error({ route: "/error" }, "error route called");
  res.status(500).json({ error: "Intentional demo error" });
});

app.listen(port, () => {
  logger.info({ port }, "demo service started");
});