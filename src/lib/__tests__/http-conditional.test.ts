import { describe, expect, test } from "vitest";
import {
  buildWeakEtag,
  discoveryBodyResponse,
  isNotModified,
  toHttpDate,
} from "../http-conditional";

describe("http-conditional", () => {
  test("buildWeakEtag is stable for the same body", () => {
    expect(buildWeakEtag("hello")).toBe(buildWeakEtag("hello"));
    expect(buildWeakEtag("hello")).not.toBe(buildWeakEtag("world"));
    expect(buildWeakEtag("hello")).toMatch(/^W\/"[a-f0-9]{16}"$/);
  });

  test("toHttpDate formats UTC", () => {
    expect(toHttpDate("2026-07-22T00:00:00.000Z")).toContain("2026");
  });

  test("isNotModified matches If-None-Match", () => {
    const etag = buildWeakEtag("body");
    const req = new Request("https://example.com/llms.txt", {
      headers: { "if-none-match": etag },
    });
    expect(isNotModified(req, etag, new Date("2026-07-22T00:00:00Z"))).toBe(
      true,
    );
  });

  test("discoveryBodyResponse returns 304 when etag matches", () => {
    const body = "# test\n";
    const etag = buildWeakEtag(body);
    const req = new Request("https://example.com/llms.txt", {
      headers: { "if-none-match": etag },
    });
    const res = discoveryBodyResponse(req, body, {
      contentType: "text/plain; charset=utf-8",
      lastModifiedAt: "2026-07-22T00:00:00.000Z",
    });
    expect(res.status).toBe(304);
    expect(res.headers.get("ETag")).toBe(etag);
    expect(res.headers.get("Last-Modified")).toBeTruthy();
  });

  test("discoveryBodyResponse returns 200 with validators", async () => {
    const body = "# test\n";
    const req = new Request("https://example.com/llms.txt");
    const res = discoveryBodyResponse(req, body, {
      contentType: "text/plain; charset=utf-8",
      lastModifiedAt: "2026-07-22T00:00:00.000Z",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("ETag")).toBe(buildWeakEtag(body));
    expect(await res.text()).toBe(body);
  });
});
