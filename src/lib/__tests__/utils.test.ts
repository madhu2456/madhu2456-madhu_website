import { describe, expect, it } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("merges conditional class names", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("resolves conflicting Tailwind utilities", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
