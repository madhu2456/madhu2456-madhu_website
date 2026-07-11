import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkMemoryRateLimit,
  checkRateLimit,
  rateLimitResponseHeaders,
  resetMemoryRateLimitStore,
  resolveClientIp,
} from "../rate-limit";

describe("resolveClientIp", () => {
  it("prefers cf-connecting-ip over x-forwarded-for", () => {
    const request = new Request("https://madhudadi.in/api/chat/", {
      headers: {
        "cf-connecting-ip": "203.0.113.10",
        "x-forwarded-for": "198.51.100.1, 203.0.113.10",
      },
    });
    expect(resolveClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to first x-forwarded-for hop", () => {
    const request = new Request("https://madhudadi.in/api/chat/", {
      headers: {
        "x-forwarded-for": "198.51.100.2, 203.0.113.20",
      },
    });
    expect(resolveClientIp(request)).toBe("198.51.100.2");
  });

  it("returns anonymous when no IP headers", () => {
    const request = new Request("https://madhudadi.in/api/chat/");
    expect(resolveClientIp(request)).toBe("anonymous");
  });
});

describe("checkMemoryRateLimit", () => {
  beforeEach(() => {
    resetMemoryRateLimitStore();
  });

  it("allows first N requests then limits", () => {
    const key = "rl:chat:test-ip";
    const limit = 3;
    const windowSec = 60;
    const t0 = 1_000_000;

    const r1 = checkMemoryRateLimit(key, limit, windowSec, t0);
    const r2 = checkMemoryRateLimit(key, limit, windowSec, t0 + 10);
    const r3 = checkMemoryRateLimit(key, limit, windowSec, t0 + 20);
    const r4 = checkMemoryRateLimit(key, limit, windowSec, t0 + 30);

    expect(r1.limited).toBe(false);
    expect(r2.limited).toBe(false);
    expect(r3.limited).toBe(false);
    expect(r4.limited).toBe(true);
    expect(r4.backend).toBe("memory");
    expect(r4.remaining).toBe(0);
    expect(r1.resetAt).toBe(t0 + windowSec * 1000);
  });

  it("resets after window elapses", () => {
    const key = "rl:chat:window";
    const t0 = 2_000_000;
    const windowSec = 60;

    expect(checkMemoryRateLimit(key, 1, windowSec, t0).limited).toBe(false);
    expect(checkMemoryRateLimit(key, 1, windowSec, t0 + 1).limited).toBe(true);
    expect(
      checkMemoryRateLimit(key, 1, windowSec, t0 + windowSec * 1000 + 1)
        .limited,
    ).toBe(false);
  });
});

describe("checkRateLimit backend selection", () => {
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  beforeEach(() => {
    resetMemoryRateLimitStore();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.UPSTASH_REDIS_REST_URL;
    } else {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    }
    if (originalToken === undefined) {
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    } else {
      process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
    vi.restoreAllMocks();
  });

  it("uses memory when Upstash env is absent", async () => {
    const result = await checkRateLimit("10.0.0.1", {
      prefix: "rl:chat",
      limit: 10,
      windowSec: 60,
    });
    expect(result.backend).toBe("memory");
    expect(result.limited).toBe(false);
  });

  it("uses Upstash pipeline when configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";

    const fetchMock = vi
      .fn()
      // INCR + TTL pipeline
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ result: 1 }, { result: -1 }],
      })
      // EXPIRE pipeline
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ result: 1 }],
      });
    vi.stubGlobal("fetch", fetchMock);

    const result = await checkRateLimit("203.0.113.5", {
      prefix: "rl:chat",
      limit: 10,
      windowSec: 60,
    });

    expect(result.backend).toBe("upstash");
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(9);
    expect(fetchMock).toHaveBeenCalled();
    const firstCall = fetchMock.mock.calls[0];
    expect(String(firstCall[0])).toContain("/pipeline");
    expect(firstCall[1].headers.Authorization).toBe("Bearer test-token");
  });

  it("falls back to memory when Upstash returns error", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    const result = await checkRateLimit("203.0.113.9", {
      prefix: "rl:chat",
      limit: 2,
      windowSec: 60,
    });
    expect(result.backend).toBe("memory");
    expect(result.limited).toBe(false);
  });

  it("marks limited when Upstash count exceeds limit", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ result: 11 }, { result: 30 }],
      }),
    );

    const result = await checkRateLimit("203.0.113.11", {
      prefix: "rl:chat",
      limit: 10,
      windowSec: 60,
    });
    expect(result.backend).toBe("upstash");
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });
});

describe("rateLimitResponseHeaders", () => {
  it("includes Retry-After and X-RateLimit-*", () => {
    const headers = rateLimitResponseHeaders({
      limited: true,
      limit: 10,
      remaining: 0,
      resetAt: Date.now() + 45_000,
      backend: "memory",
    });
    expect(headers["Retry-After"]).toMatch(/^\d+$/);
    expect(Number(headers["Retry-After"])).toBeGreaterThanOrEqual(1);
    expect(headers["X-RateLimit-Limit"]).toBe("10");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
    expect(headers["Cache-Control"]).toBe("no-store");
  });
});
