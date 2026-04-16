## SpanScout in einem TypeScript-Service verwenden

1. Package installieren 

```bash
npm install @spanscout/node dotenv

2. .env anlegen 

OTEL_SERIVCE_NAME=spanscout-demo-service
SPANSCOUT_API_KEY=your_api_key_here
SPANSCOUT_TRACES_ENDPOINT=http://localhost:3002/v1/traces

3. Instrumentalisierung aktivieren

import "dotenv/config";
import "@spanscout/node/register";

4. Service starten 

npm run dev
