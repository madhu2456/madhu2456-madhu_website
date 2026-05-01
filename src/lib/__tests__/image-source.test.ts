import { describe, expect, it } from "vitest";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "../image-source";

describe("normalizeImageSource", () => {
  it("should return null for empty values", () => {
    expect(normalizeImageSource(null)).toBe(null);
    expect(normalizeImageSource("")).toBe(null);
    expect(normalizeImageSource("  ")).toBe(null);
  });

  it("should preserve absolute URLs", () => {
    const url = "https://example.com/image.jpg";
    expect(normalizeImageSource(url)).toBe(url);
  });

  it("should preserve data URLs", () => {
    const url = "data:image/png;base64,123";
    expect(normalizeImageSource(url)).toBe(url);
  });

  it("should add leading slash to relative paths", () => {
    expect(normalizeImageSource("uploads/image.png")).toBe(
      "/uploads/image.png",
    );
    expect(normalizeImageSource("/uploads/image.png")).toBe(
      "/uploads/image.png",
    );
  });
});

describe("shouldUseUnoptimizedImage", () => {
  it("should return true for SVG", () => {
    expect(shouldUseUnoptimizedImage("/image.svg")).toBe(true);
    expect(shouldUseUnoptimizedImage("/image.svg?v=1")).toBe(true);
  });

  it("should return true for absolute URLs", () => {
    expect(shouldUseUnoptimizedImage("https://example.com/img.jpg")).toBe(true);
  });

  it("should return true for data URLs", () => {
    expect(shouldUseUnoptimizedImage("data:image/png;base64,123")).toBe(true);
  });

  it("should return false for local non-SVG images", () => {
    expect(shouldUseUnoptimizedImage("/image.png")).toBe(false);
    expect(shouldUseUnoptimizedImage("/image.jpg")).toBe(false);
  });
});
