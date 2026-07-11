/**
 * Shared rate limiting for trusted-boundary APIs (chat, etc.).
 *
 * Backends:
 * 1. Upstash Redis REST when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *    are set (multi-instance / serverless safe).
 * 2. In-process fixed window Map otherwise (single-instance only).
 *
 * Phase 5A F-5A-04 — not a substitute for edge/WAF limits.
 */

export type RateLimitBackend = "memory" | "upstash";

export type RateLimitResult = {
  limited: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms when the current window ends */
  resetAt: number;
  backend: RateLimitBackend;
};

export type RateLimitOptions = {
  /** Redis / memory key namespace */
  prefix?: string;
  /** Max requests per window */
  limit?: number;
  /** Window length in seconds */
  windowSec?: number;
};

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_SEC = 60;
const MAX_MEMORY_ENTRIES = 10_000;

type MemoryRecord = { count: number; resetAt: number };

/** Process-local store (tests may call resetMemoryRateLimitStore). */
const memoryStore = new Map<string, MemoryRecord>();

export const resetMemoryRateLimitStore = () => {
  memoryStore.clear();
};

export const getChatRateLimitConfig = () => {
  const limit = parsePositiveInt(
    process.env.CHAT_RATE_LIMIT_MAX,
    DEFAULT_LIMIT,
  );
  const windowSec = parsePositiveInt(
    process.env.CHAT_RATE_LIMIT_WINDOW_SEC,
    DEFAULT_WINDOW_SEC,
  );
  return { limit, windowSec };
};

const parsePositiveInt = (raw: string | undefined, fallback: number) => {
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, 10_000);
};

/**
 * Prefer platform client IP headers. Cloudflare's cf-connecting-ip is trusted
 * when present (CDN edge). X-Forwarded-For first hop is used only as fallback.
 */
export const resolveClientIp = (request: Request): string => {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 128);

  const trueClient = request.headers.get("true-client-ip")?.trim();
  if (trueClient) return trueClient.slice(0, 128);

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }

  return "anonymous";
};

const hasUpstashConfig = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return Boolean(url && token);
};

const sanitizeKeyPart = (value: string) =>
  value.replace(/[^a-zA-Z0-9:._@-]/g, "_").slice(0, 200);

/**
 * Fixed-window rate limit. Returns limited=true when the caller has already
 * exhausted the budget for this window (count would exceed limit).
 */
export async function checkRateLimit(
  identity: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowSec = options.windowSec ?? DEFAULT_WINDOW_SEC;
  const prefix = options.prefix ?? "rl";
  const key = `${prefix}:${sanitizeKeyPart(identity || "anonymous")}`;

  if (hasUpstashConfig()) {
    try {
      return await checkUpstashRateLimit(key, limit, windowSec);
    } catch {
      // Fail open to memory so a Redis outage does not take chat offline.
      return checkMemoryRateLimit(key, limit, windowSec);
    }
  }

  return checkMemoryRateLimit(key, limit, windowSec);
}

export async function checkChatRateLimit(
  identity: string,
): Promise<RateLimitResult> {
  const { limit, windowSec } = getChatRateLimitConfig();
  return checkRateLimit(identity, {
    prefix: "rl:chat",
    limit,
    windowSec,
  });
}

export const checkMemoryRateLimit = (
  key: string,
  limit: number,
  windowSec: number,
  now = Date.now(),
): RateLimitResult => {
  // Evict expired entries on demand
  for (const [entryKey, value] of memoryStore.entries()) {
    if (now > value.resetAt) {
      memoryStore.delete(entryKey);
    }
  }

  if (memoryStore.size >= MAX_MEMORY_ENTRIES) {
    const evictCount = MAX_MEMORY_ENTRIES >> 2;
    let evicted = 0;
    for (const entryKey of memoryStore.keys()) {
      if (evicted >= evictCount) break;
      memoryStore.delete(entryKey);
      evicted += 1;
    }
  }

  const existing = memoryStore.get(key);
  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowSec * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      limited: false,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAt,
      backend: "memory",
    };
  }

  existing.count += 1;
  const limited = existing.count > limit;
  return {
    limited,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    backend: "memory",
  };
};

type UpstashPipelineResult = Array<{ result: unknown }>;

async function checkUpstashRateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(
    /\/+$/,
    "",
  );
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!baseUrl || !token) {
    return checkMemoryRateLimit(key, limit, windowSec);
  }

  // INCR then EXPIRE only when this is the first hit in the window (count === 1).
  // TTL used to compute Retry-After without resetting the window.
  const pipelineBody = [
    ["INCR", key],
    ["TTL", key],
  ];

  const response = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipelineBody),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash pipeline HTTP ${response.status}`);
  }

  const payload = (await response.json()) as UpstashPipelineResult;
  const countRaw = payload[0]?.result;
  const ttlRaw = payload[1]?.result;
  const count =
    typeof countRaw === "number"
      ? countRaw
      : Number.parseInt(String(countRaw ?? "0"), 10);
  let ttlSec =
    typeof ttlRaw === "number"
      ? ttlRaw
      : Number.parseInt(String(ttlRaw ?? "-1"), 10);

  if (!Number.isFinite(count) || count < 1) {
    throw new Error("Upstash INCR returned invalid count");
  }

  // First request in window (or key without TTL): set expiry
  if (count === 1 || ttlSec < 0) {
    const expireRes = await fetch(`${baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["EXPIRE", key, windowSec]]),
      cache: "no-store",
    });
    if (!expireRes.ok) {
      throw new Error(`Upstash EXPIRE HTTP ${expireRes.status}`);
    }
    ttlSec = windowSec;
  }

  const resetAt =
    Date.now() +
    (Number.isFinite(ttlSec) && ttlSec > 0 ? ttlSec : windowSec) * 1000;
  const limited = count > limit;

  return {
    limited,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt,
    backend: "upstash",
  };
}

export const rateLimitResponseHeaders = (
  result: RateLimitResult,
): Record<string, string> => {
  const retryAfterSec = Math.max(
    1,
    Math.ceil((result.resetAt - Date.now()) / 1000),
  );
  return {
    "Cache-Control": "no-store",
    "Retry-After": String(retryAfterSec),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
};
