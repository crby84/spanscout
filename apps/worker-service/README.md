# Worker Service

## Overview

Simulates a downstream service in a distributed system.

---

## Responsibilities

- Simulate database calls
- Generate spans

---

## Endpoints

### GET /work

Simulates processing and returns a response.

---

## Role in Architecture

- Part of distributed trace
- Called by demo service

---

## Notes

- Uses OpenTelemetry directly
```
