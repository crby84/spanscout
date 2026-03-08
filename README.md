# SpanScout

**SpanScout** ist ein Developer-first **Observability- und Telemetry-Plattform-Prototyp**.

Das Projekt demonstriert eine **self-hosted Observability Architektur** mit:

* instrumentierten Services
* einem Telemetry **Ingestion Gateway**
* einer **Control Plane** für Projekte und API Keys
* einem vollständigen **OpenTelemetry Observability Stack**

SpanScout dient als **Platform Engineering / Infrastructure Demo**, um zu zeigen, wie eine kleine Observability-Plattform ähnlich zu Datadog oder Grafana Cloud aufgebaut werden kann.

---

# Architekturüberblick

High-Level Architektur:

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

# Repository Struktur

```
spanscout/
│
├── apps/
│   ├── demo-service/
│   ├── worker-service/
│   ├── control-plane/
│   └── ingestion-gateway/
│
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml
│   │
│   ├── otel/
│   │   └── otel-collector-config.yaml
│   │
│   ├── prometheus/
│   │   └── prometheus.yml
│   │
│   ├── tempo/
│   │   └── tempo.yaml
│   │
│   └── grafana/
│       ├── dashboards/
│       └── provisioning/
│
├── docs/
├── README.md
└── .gitignore
```

---

# Voraussetzungen

Empfohlene Entwicklungsumgebung:

```
VS Code
WSL
Docker Desktop
Node.js
npm
Git
```

---

# Installation

Repository klonen:

```
git clone <repo-url>
cd spanscout
```

Dependencies installieren:

```
cd apps/demo-service
npm install

cd ../worker-service
npm install

cd ../ingestion-gateway
npm install

cd ../control-plane
npm install
```

---

# Projekt starten

Damit **vollständige Traces sichtbar sind**, müssen alle Komponenten laufen.

---

## 1. Observability Stack starten

```
cd infra/docker
docker compose up -d
```

Dies startet:

* Grafana
* Prometheus
* Tempo
* Loki
* OpenTelemetry Collector
* PostgreSQL

---

## 2. Control Plane starten

```
cd apps/control-plane
npm run start:dev
```

Die Control Plane wird vom Gateway verwendet, um **API Keys zu validieren**.

Standard Port:

```
localhost:3001
```

---

## 3. Ingestion Gateway starten

```
cd apps/ingestion-gateway
npm run dev
```

Port:

```
localhost:3002
```

Der Gateway nimmt Telemetrie von Services entgegen und leitet sie an den Observability Stack weiter.

---

## 4. Worker Service starten

```
cd apps/worker-service
npm run dev
```

---

## 5. Demo Service starten

```
cd apps/demo-service
npm run dev
```

Standard Port:

```
localhost:8080
```

---

# Services testen

Sobald alle Services laufen, können Testrequests ausgeführt werden.

## Hello Endpoint

```
curl http://localhost:8080/hello
```

---

## Slow Endpoint (Distributed Trace)

```
curl http://localhost:8080/slow
```

Dieser Request erzeugt einen **Distributed Trace** über mehrere Services.

---

## Error Endpoint

```
curl http://localhost:8080/error
```

---

## Mehrere Traces erzeugen

```
for i in {1..5}; do curl http://localhost:8080/slow; done
```

Die Traces können anschließend in **Grafana / Tempo** analysiert werden.

---

# Projekt stoppen

Node Services stoppen:

```
CTRL + C
```

Docker Stack stoppen:

```
cd infra/docker
docker compose down
```

Die Daten bleiben erhalten, da Docker Volumes verwendet werden.

---

# Kurzbeschreibung

SpanScout ist ein **self-hosted Observability Platform Prototype**, der eine vollständige Telemetrie-Pipeline mit Ingestion Gateway, Control Plane, OpenTelemetry und einem Grafana-basierten Observability Stack implementiert.
