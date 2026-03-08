type CachedKey = {
  projectId: string;
  projectSlug: string;
  keyPrefix: string;
  expiresAt: number;
};

const cache = new Map<string, CachedKey>();

const TTL = 60 * 1000; // 60 Sekunden

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
  keyPrefix: string
) {
  cache.set(apiKey, {
    projectId,
    projectSlug,
    keyPrefix,
    expiresAt: Date.now() + TTL,
  });
}