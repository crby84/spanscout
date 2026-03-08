# SpanScout

Developer-first observability platform for self-hosted services.

## Current capabilities

- OpenTelemetry instrumentation
- Distributed tracing
- Tempo trace storage
- Prometheus metrics
- Loki log pipeline
- Grafana visualization
- Docker-based local observability stack

## Demo

Run the stack:

docker compose -f infra/docker/docker-compose.yml up -d

Run demo service:

npm run dev

Generate traffic:

curl http://localhost:8080/hello