import { expect, test } from "@playwright/test";

test.describe("CMS Authentication checks", () => {
  test("should deny unauthorized access to /cms/", async ({ request }) => {
    const response = await request.get("/cms/");
    expect(response.status()).toBe(401);
    expect(response.headers()["www-authenticate"]).toContain("Basic");
  });

  test("should deny unauthorized access to /api/cms/content", async ({
    request,
  }) => {
    const response = await request.get("/api/cms/content");
    expect(response.status()).toBe(401);
    expect(response.headers()["www-authenticate"]).toContain("Basic");
  });
});
