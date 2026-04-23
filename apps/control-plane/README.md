```md
# Control Plane

## Overview

Manages projects and API keys.

Acts as the source of truth for authentication and configuration.

---

## Responsibilities

- Manage projects
- Generate and validate API keys
- Provide onboarding configuration

---

## Endpoints

### GET /projects
List all projects

### POST /projects
Create a project

### GET /projects/:id/onboarding
Returns setup configuration

### POST /ingestion/validate-key
Validates API keys

---

## Role in Architecture

- Central authority for API keys
- Provides configuration to ingestion gateway

---

## Notes

- API keys are stored as hashes
- Supports revocation via revokedAt
```
