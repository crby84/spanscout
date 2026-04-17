# SpanScout Integration (Node.js / TypeScript)

Diese Anleitung zeigt, wie ein Service mit SpanScout instrumentiert wird, um Distributed Tracing und Telemetrie zu erfassen.

---

## 1. Abhängigkeiten installieren

```bash
npm install @spanscout/node dotenv
```

---

## 2. Environment konfigurieren

Erstelle eine `.env` Datei im Projekt:

```env
OTEL_SERVICE_NAME=your-service-name
SPANSCOUT_API_KEY=your_api_key_here
SPANSCOUT_TRACES_ENDPOINT=http://localhost:3002/v1/traces
```

### Erklärung

* `OTEL_SERVICE_NAME`
  Name des Services (erscheint in Grafana/Tempo)

* `SPANSCOUT_API_KEY`
  API Key aus der Control Plane

* `SPANSCOUT_TRACES_ENDPOINT`
  Endpoint des SpanScout Ingestion Gateways

---

## 3. Instrumentierung aktivieren

Füge am Anfang deiner Anwendung hinzu:

```ts
import "dotenv/config";
import "@spanscout/node/register";
```

Wichtig:

* `dotenv/config` muss **vor** SpanScout geladen werden
* SpanScout initialisiert automatisch OpenTelemetry

---

## 4. Service starten

```bash
npm run dev
```

---

## 5. Telemetrie erzeugen

Beispiel:

```bash
curl http://localhost:8080/slow
```

---

## 6. Trace in Grafana ansehen

Öffne Grafana:

```
http://localhost:3000
```

Navigiere zu:

```
Explore → Tempo
```

Dort kannst du den vollständigen Trace sehen:

* dein Service
* andere Services (Distributed Tracing)
* ingestion-gateway
* control-plane

---

## Ergebnis

Nach erfolgreicher Integration:

* wird jeder Request automatisch getraced
* entstehen Distributed Traces über mehrere Services hinweg
* werden zusätzliche Metadaten durch SpanScout angereichert (z. B. Projekt, API Key Prefix)

---

## Hinweis

Der Service sendet Telemetrie **nicht direkt an den OpenTelemetry Collector**, sondern über:

```
SpanScout Ingestion Gateway
```

Dadurch ermöglicht SpanScout:

* API-Key-basierte Authentifizierung
* Projekt-Zuordnung
* Telemetrie-Anreicherung

```
```
