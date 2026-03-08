# SpanScout

**SpanScout** ist ein Developer-first Observability- und Telemetry-Platform-Prototype.
Das Projekt demonstriert eine **self-hosted Observability Architektur**, bestehend aus einem Ingestion Gateway, einer Control Plane für Projekte und API-Keys sowie einem vollständigen OpenTelemetry-Observability-Stack.

SpanScout ist **kein Endnutzerprodukt**, sondern ein **Platform Engineering / Infrastructure Projekt**, das zeigt, wie eine kleine Datadog-/Grafana-Cloud-artige Architektur aufgebaut werden kann.

---

# Inhaltsverzeichnis

* [Projektidee](#projektidee)
* [Architekturüberblick](#architekturüberblick)
* [Technologie-Stack](#technologie-stack)
* [Repository Struktur](#repository-struktur)
* [System Komponenten](#system-komponenten)
* [Entwicklungsumgebung](#entwicklungsumgebung)
* [Installation & Setup](#installation--setup)
* [Projekt starten](#projekt-starten)
* [Projekt stoppen (Feierabend)](#projekt-stoppen-feierabend)
* [Observability Stack](#observability-stack)
* [Control Plane](#control-plane)
* [API Keys](#api-keys)
* [Telemetry Flow](#telemetry-flow)
* [Bekannte wichtige Fixes](#bekannte-wichtige-fixes)
* [Aktueller Projektstatus](#aktueller-projektstatus)
* [Nächste Schritte](#nächste-schritte)

---

# Projektidee

SpanScout ist eine **Telemetry Ingestion Platform** für instrumentierte Services.

Ziel des Projekts ist es zu demonstrieren:

* OpenTelemetry Instrumentierung
* Distributed Tracing
* API-Key-basierte Telemetry Ingestion
* Multi-Project Telemetrie
* Observability Stack Integration
* Control Plane Architektur

Das Projekt orientiert sich konzeptionell an Plattformen wie:

* Datadog
* Grafana Cloud
* Honeycomb
* Lightstep

Allerdings vollständig **self-hosted** und **minimal implementiert**.

---

# Architekturüberblick

High-level Architektur:

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

### Demo Request Flow

```
Client
   ↓
demo-service
   ↓
worker-service
   ↓
OTLP Export
   ↓
ingestion-gateway
   ↓
control-plane (validate key)
   ↓
otel-collector
   ↓
tempo
   ↓
grafana
```

---

# Technologie Stack

## Services

* Node.js
* TypeScript
* Express
* NestJS

## Observability

* OpenTelemetry SDK
* OpenTelemetry Collector
* Grafana
* Tempo
* Prometheus
* Loki

## Datenbank

* PostgreSQL
* Prisma ORM

## Infrastruktur

* Docker
* Docker Compose

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
│
├── README.md
└── .gitignore
```

---

# System Komponenten

## demo-service

Ein instrumentierter Express Service der Requests erzeugt und Telemetrie exportiert.

Endpoints:

```
GET /hello
GET /slow
GET /error
```

Dieser Service ruft zusätzlich den **worker-service** auf, um Distributed Tracing zu demonstrieren.

---

## worker-service

Ein zweiter Service zur Demonstration von **Distributed Tracing**.

Endpoint:

```
GET /work
```

---

## ingestion-gateway

Der Gateway befindet sich zwischen Services und Observability Stack.

Aufgaben:

* API-Key Authentifizierung
* Projektzuordnung
* Telemetrie-Anreicherung
* Weiterleitung an OTel Collector
* API Key Caching

Endpoint:

```
POST /v1/traces
```

Header:

```
x-spanscout-api-key
```

---

## control-plane

Verwaltungsbackend für SpanScout.

Technologie:

* NestJS
* Prisma
* PostgreSQL

Funktionen:

* Projects API
* API Key Management
* API Key Validation

---

# Entwicklungsumgebung

Empfohlene Umgebung:

```
VS Code
WSL
Docker Desktop
Node.js
npm
Git
```

---

# Installation & Setup

Repository klonen:

```
git clone <repo-url>
cd spanscout
```

Node Dependencies installieren (für alle Apps):

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

## 1. Observability Stack starten

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

## 2. Services starten

Control Plane

```
cd apps/control-plane
npm run start:dev
```

Gateway

```
cd apps/ingestion-gateway
npm run dev
```

Demo Service

```
cd apps/demo-service
npm run dev
```

Worker Service

```
cd apps/worker-service
npm run dev
```

---

# Projekt stoppen (Feierabend)

Um das Projekt sauber herunterzufahren:

### 1. Node Services stoppen

In jedem Terminal:

```
CTRL + C
```

---

### 2. Docker Stack stoppen

```
cd infra/docker
docker compose down
```

Dies stoppt:

* Grafana
* Prometheus
* Tempo
* Loki
* OTel Collector
* PostgreSQL

Wichtig:

Die Daten bleiben erhalten, da Volumes verwendet werden.

---

### ⚠️ Nicht verwenden

```
docker compose down -v
```

Dies würde die Datenbanken und Dashboards löschen.

---

# Observability Stack

## Grafana

Grafana wird automatisch provisioniert.

Persistenz:

```
grafana-data:/var/lib/grafana
```

Provisionierte Datasources:

* Prometheus
* Tempo
* Loki

---

## Tempo

Speichert Distributed Traces.

Konfiguration:

```
infra/tempo/tempo.yaml
```

---

## Prometheus

Scraped Metrics vom OTel Collector.

Konfiguration:

```
infra/prometheus/prometheus.yml
```

---

## OpenTelemetry Collector

Empfängt Telemetrie vom Gateway.

Wichtig:

Receiver müssen auf `0.0.0.0` binden.

Beispiel:

```
endpoint: 0.0.0.0:4317
```

---

# Control Plane

## Projects API

```
POST /projects
GET /projects
GET /projects/:id
```

---

## API Keys

```
POST /projects/:id/api-keys
GET /projects/:id/api-keys
```

API Keys werden **nicht im Klartext gespeichert**.

Gespeichert werden:

* keyHash
* prefix

---

## API Key Validation

Endpoint:

```
POST /ingestion/validate-key
```

Beispiel:

```
{
  "apiKey": "ssc_live_..."
}
```

Response:

```
{
  "valid": true,
  "project": {...},
  "apiKey": {...}
}
```

---

# Telemetry Flow

```
service
   ↓
OpenTelemetry SDK
   ↓
Ingestion Gateway
   ↓
Control Plane (Key Validation)
   ↓
OpenTelemetry Collector
   ↓
Tempo / Prometheus / Loki
   ↓
Grafana
```

---

# Gateway Trace Attribute

Der Gateway fügt zusätzliche Telemetrie Attribute hinzu.

Beispiele:

```
spanscout.auth.valid
spanscout.auth.cache_hit
spanscout.project.id
spanscout.project.slug
spanscout.api_key.prefix
spanscout.ingestion.kind
```

---

# API Key Cache

Der Gateway verwendet einen In-Memory Cache.

TTL:

```
60 Sekunden
```

Vorteil:

Reduziert Requests zur Control Plane.

---

# Bekannte wichtige Fixes

## Header Schreibfehler

Falsch:

```
x-spanscount-api-key
```

Richtig:

```
x-spanscout-api-key
```

---

## OTel Collector Binding

Muss auf `0.0.0.0` gesetzt werden.

---

## Postgres Volume Bug

Falsch:

```
postgres-data:var/lib/postgresql/data
```

Richtig:

```
postgres-data:/var/lib/postgresql/data
```

---

## Nested Git Repository

Das NestJS CLI hat versehentlich ein eigenes `.git` erstellt.

Dieses wurde entfernt.

---

# Aktueller Projektstatus

Bereits implementiert:

* Distributed Tracing
* API Key Auth
* Ingestion Gateway
* Project Mapping
* Control Plane
* Prisma + Postgres
* Grafana Dashboards
* Gateway Caching
* Telemetry Enrichment

SpanScout ist aktuell ein:

**Observability Platform Prototype**

---

# Nächste Schritte

Geplante Features:

### High Priority

* Onboarding Endpoint

```
GET /projects/:id/onboarding
```

* Projektbezogene Dashboards
* Dokumentation

---

### Medium Priority

* Rate Limiting im Gateway
* Logs über Gateway
* Metrics über Gateway
* API Key Revocation

---

### Future Ideas

* Control Plane UI
* SDK / Client Library
* Service Onboarding Snippets
* Multi-Tenant Filtering

---

# Kurzbeschreibung

SpanScout ist ein **self-hosted Observability Platform Prototype**, der eine vollständige Telemetrie-Pipeline mit Ingestion Gateway, Control Plane, OpenTelemetry und Grafana Stack implementiert.
