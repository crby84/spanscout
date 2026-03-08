import { createHash, randomBytes } from "crypto";

export function generatePlainApiKey(): string {
  const randomPart = randomBytes(24).toString("hex");
  return `ssc_live_${randomPart}`;
}

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

export function getApiKeyPrefix(apiKey: string): string {
  return apiKey.slice(0, 12);
}