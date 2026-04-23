# Demo Service

## Overview

Example service that generates traces and sends them to SpanScout.

---

## Responsibilities

- Simulate application behavior
- Generate distributed traces
- Call worker service

---

## Endpoints

### GET /hello
Simple endpoint

### GET /slow
Triggers a distributed trace

---

## Role in Architecture

- Demonstrates how to integrate SpanScout SDK
- Generates test data

---

## Notes

- Uses SpanScout Node SDK
- Sends traces to ingestion gateway

