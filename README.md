<p align="center"> <img src="./assets/logo.png" alt="SpanScout Logo" width="800"/> </p>

# SpanScout

**SpanScout** ist ein Developer-first **Observability Platform Prototype**.

Das Projekt demonstriert eine **self-hosted Telemetry Ingestion Architektur** mit:

* instrumentierten Services
* einem Telemetry Ingestion Gateway
* einer Control Plane für Projekte und API Keys
* einem OpenTelemetry Observability Stack

Weitere Informationen:

* Architektur → `docs/architecture.md`
* Projektvision → `docs/vision.md`

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
├── packages/
│   └── spanscout-node/
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
│   ├── architecture.md
│   └── vision.md
│
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

Damit **vollständige Traces sichtbar sind**, müssen alle Services laufen.

---

## 1 Observability Stack starten

```
cd infra/docker
docker compose up -d
```

Startet:

* Grafana
* Prometheus
* Tempo
* Loki
* OpenTelemetry Collector
* PostgreSQL

---

## 2 Control Plane starten

```
cd apps/control-plane
npm run start:dev
```

Port:

```
localhost:3001
```

---

## 3 Ingestion Gateway starten

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

## 4 Worker Service starten

```
cd apps/worker-service
npm run dev
```

---

## 5 Demo Service starten

```
cd apps/demo-service
npm run dev
```

Port:

```
localhost:8080
```

---

# Services testen

Hello Endpoint

```
curl http://localhost:8080/hello
```

Distributed Trace erzeugen

```
curl http://localhost:8080/slow
```

Mehrere Traces erzeugen

```
for i in {1..5}; do curl http://localhost:8080/slow; done
```

---

# SpanScout SDK (Service Integration)

SpanScout bietet ein einfaches Node.js SDK zur Integration eigener Services.

---

## 1 Package installieren

```
npm install @spanscout/node dotenv
```

---

## 2 Environment konfigurieren

Erstelle eine `.env` Datei:

```
OTEL_SERVICE_NAME=your-service-name
SPANSCOUT_API_KEY=your_api_key
SPANSCOUT_TRACES_ENDPOINT=http://localhost:3002/v1/traces
```

---

## 3 Instrumentierung aktivieren

Füge am Anfang deiner Anwendung hinzu:

```ts
import "dotenv/config";
import "@spanscout/node/register";
```

---

## 4 Service starten

```
npm run dev
```

---

## 5 Trace ansehen

Grafana:

```
http://localhost:3000
```

Dort siehst du:

* demo-service
* worker-service
* ingestion-gateway
* control-plane

---

# Projekt stoppen

Node Services stoppen

```
CTRL + C
```

Docker Stack stoppen

```
cd infra/docker
docker compose down
```

Docker Volumes bleiben erhalten, sodass Datenbanken und Dashboards nicht verloren gehen.
