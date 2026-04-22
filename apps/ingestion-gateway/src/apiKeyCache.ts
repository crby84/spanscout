type CachedKey = {
  projectId: string;
  projectSlug: string;
  keyPrefix: string;
  revokedAt: string | null;
  expiresAt: number;
};

const cache = new Map<string, CachedKey>();

const TTL = 60 * 1000; // 60 seconds

export function getCachedKey(apiKey: string): CachedKey | null {
  const entry = cache.get(apiKey);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(apiKey);
    return null;
  }

  return entry;
}

export function storeKey(
  apiKey: string,
  projectId: string,
  projectSlug: string,
  keyPrefix: string,
  revokedAt: string | null,
): void {
  cache.set(apiKey, {
    projectId,
    projectSlug,
    keyPrefix,
    revokedAt,
    expiresAt: Date.now() + TTL,
  });
}

export function deleteKey(apiKey: string): void {
  cache.delete(apiKey);
}

export function clearCache(): void {
  cache.clear();
}