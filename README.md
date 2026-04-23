# SpanScout

**SpanScout** is a developer-first **observability platform prototype**.

It demonstrates a **self-hosted telemetry ingestion architecture** with:

* instrumented services
* a telemetry ingestion gateway
* a control plane for projects and API keys
* an OpenTelemetry-based observability stack

---

## 📚 Documentation

* Architecture → `docs/architecture.md`
* Project Vision → `docs/vision.md`

---

## 🧱 Repository Structure

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
│   ├── otel/
│   ├── prometheus/
│   ├── tempo/
│   └── grafana/
│
├── docs/
├── assets/
├── README.md
```

---

## ⚙️ Prerequisites

Recommended environment:

* VS Code
* WSL
* Docker Desktop
* Node.js
* npm
* Git

---

## 📦 Installation

```bash
git clone <repo-url>
cd spanscout
```

Install dependencies:

```bash
cd apps/demo-service && npm install
cd ../worker-service && npm install
cd ../ingestion-gateway && npm install
cd ../control-plane && npm install
```

---

## 🚀 Run the Project

To see **complete distributed traces**, all services must be running.

---

### 1. Start Observability Stack

```bash
cd infra/docker
docker compose up -d
```

---

### 2. Start Services (Manual)

```bash
cd apps/control-plane && npm run start:dev
cd apps/ingestion-gateway && npm run dev
cd apps/worker-service && npm run dev
cd apps/demo-service && npm run dev
```

---

### 3. Start Services (Recommended)

Using tmux-based dev scripts:

```bash
./start-dev.sh
```

Stop:

```bash
./stop-dev.sh
```

Restart:

```bash
./restart-dev.sh
```

> Requires: `tmux`

---

## 🧪 Test the System

```bash
curl http://localhost:8080/hello
```

```bash
curl http://localhost:8080/slow
```

Multiple requests:

```bash
for i in {1..5}; do curl http://localhost:8080/slow; done
```

---

## 🔐 API Key Authentication & Revocation

SpanScout uses API keys to authenticate ingestion requests.

### Required Header

```bash
x-spanscout-api-key: <your_api_key>
```

---

### API Key States

| State   | Behavior         |
| ------- | ---------------- |
| Active  | Request accepted |
| Revoked | Request rejected |

---

### Error Responses

#### Revoked Key

```json
{
  "error": "revoked_api_key",
  "message": "API key has been revoked"
}
```

#### Invalid Key

```json
{
  "error": "invalid_api_key",
  "message": "API key is invalid"
}
```

---

### Example Request

```bash
curl -X POST http://localhost:3002/v1/traces \
  -H "Content-Type: application/json" \
  -H "x-spanscout-api-key: <your_api_key>" \
  -d '{}'
```

---

### Notes

* Validation is performed via the Control Plane
* Results are cached in the Ingestion Gateway (TTL: 60s)
* Revocation is enforced at the gateway level

---

## 🧩 SpanScout SDK (Service Integration)

### 1. Install

```bash
npm install @spanscout/node dotenv
```

---

### 2. Configure

```env
OTEL_SERVICE_NAME=your-service-name
SPANSCOUT_API_KEY=your_api_key
SPANSCOUT_TRACES_ENDPOINT=http://localhost:3002/v1/traces
```

---

### 3. Enable Instrumentation

```ts
import "dotenv/config";
import "@spanscout/node/register";
```

---

### 4. Run

```bash
npm run dev
```

---

### 5. View Traces

Grafana:

```
http://localhost:3000
```

---

## 🧠 Services Overview

* **demo-service** → generates example traces
* **worker-service** → simulates downstream processing
* **ingestion-gateway** → validates and forwards telemetry
* **control-plane** → manages projects and API keys

---

## 🛑 Stop the Project

Stop tmux/dev services:

```bash
./stop-dev.sh
```

Or manually:

```bash
CTRL + C
```

Stop infrastructure:

```bash
cd infra/docker
docker compose down
```

---

## 📌 Notes

* Docker volumes are preserved (databases and dashboards persist)
* API keys are stored securely (hashed + prefix)
* Revocation is enforced in real-time (subject to cache TTL)

---
