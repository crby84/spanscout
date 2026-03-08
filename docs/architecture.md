# SpanScout Architecture

SpanScout besteht aus mehreren Komponenten, die gemeinsam eine **Telemetry Ingestion Plattform** bilden.

---

# High Level Architektur

```
Instrumented Service
        ↓
OpenTelemetry SDK
        ↓
SpanScout Ingestion Gateway
        ↓
Control Plane (API Key Validation)
        ↓
OpenTelemetry Collector
        ↓
Tempo / Prometheus / Loki
        ↓
Grafana
```

---

# Komponenten

## Instrumented Services

Beispielservices:

* demo-service
* worker-service

Diese Services sind mit **OpenTelemetry SDK** instrumentiert und exportieren Traces über OTLP.

---

## Ingestion Gateway

Der Ingestion Gateway ist der zentrale Einstiegspunkt für Telemetrie.

Funktionen:

* API Key Authentifizierung
* Projektauflösung
* Telemetry Enrichment
* Weiterleitung an OpenTelemetry Collector
* API Key Caching

Endpoint:

```
POST /v1/traces
```

---

## Control Plane

Die Control Plane verwaltet:

* Projekte
* API Keys
* Ingestion Authentifizierung

Technologie:

* NestJS
* Prisma
* PostgreSQL

---

## OpenTelemetry Collector

Der Collector empfängt Telemetrie vom Gateway und verteilt diese an verschiedene Backends.

Exporter:

* Tempo (Traces)
* Prometheus (Metrics)
* Loki (Logs)

---

## Observability Stack

SpanScout verwendet einen klassischen Observability Stack:

Grafana
Tempo
Prometheus
Loki

Grafana dient als zentrale Oberfläche für:

* Trace Analyse
* Metrics Visualisierung
* Log Analyse
