"use client";

const PREFETCH_MAX_AGE_MS = 5 * 60 * 1000;

type SessionCacheRecord = {
  clientSecret: string;
  createdAt: number;
};

let prefetchedSecret: SessionCacheRecord | null = null;

export function readPrefetchedClientSecret(): string | null {
  if (!prefetchedSecret) {
    return null;
  }

  if (Date.now() - prefetchedSecret.createdAt > PREFETCH_MAX_AGE_MS) {
    prefetchedSecret = null;
    return null;
  }

  return prefetchedSecret.clientSecret;
}

export function writePrefetchedClientSecret(clientSecret: string) {
  prefetchedSecret = {
    clientSecret,
    createdAt: Date.now(),
  };
}

export function clearPrefetchedClientSecret() {
  prefetchedSecret = null;
}
