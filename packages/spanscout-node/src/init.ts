import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

let sdk: NodeSDK | null = null;
let started = false;

export type InitSpanScoutOptions = {
  serviceName?: string;
  tracesEndpoint?: string;
  apiKey?: string;
};

export function initSpanScout(options: InitSpanScoutOptions = {}): void {
  if (started) return;
  started = true;

  const serviceName =
    options.serviceName ||
    process.env.OTEL_SERVICE_NAME ||
    "unknown-service";

  const tracesEndpoint =
    options.tracesEndpoint ||
    process.env.SPANSCOUT_TRACES_ENDPOINT ||
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;

  const apiKey =
    options.apiKey ||
    process.env.SPANSCOUT_API_KEY;

  if (!tracesEndpoint) {
    throw new Error(
      "[SpanScout] Missing traces endpoint. Set SPANSCOUT_TRACES_ENDPOINT."
    );
  }

  if (!apiKey) {
    throw new Error(
      "[SpanScout] Missing API key. Set SPANSCOUT_API_KEY."
    );
  }

  const traceExporter = new OTLPTraceExporter({
    url: tracesEndpoint,
    headers: {
      "x-spanscout-api-key": apiKey,
    },
  });

  sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  const shutdown = async () => {
    if (!sdk) return;
    await sdk.shutdown();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
