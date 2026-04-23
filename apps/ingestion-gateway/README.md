# Ingestion Gateway

## Overview

The ingestion gateway is the entry point for all telemetry data.

It validates API keys, enforces revocation, and forwards traces to the OpenTelemetry collector.

---

## Responsibilities

- Validate API keys via Control Plane
- Enforce API key revocation
- Cache validation results
- Forward traces to OTEL collector

---

## Endpoints

### POST /v1/traces

Receives OpenTelemetry trace data.

Requires header:



x-spanscout-api-key


---

## Environment Variables

| Variable | Description |
|---------|------------|
| CONTROL_PLANE_URL | URL of control plane |
| OTEL_COLLECTOR_TRACES_URL | OTEL collector endpoint |

---

## Role in Architecture

- Entry point for telemetry
- Security enforcement layer
- Connects services with observability stack

---

## Notes

- API key validation is cached (TTL: 60s)
- Revoked keys are rejected with 403