import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST as pauseAccountSync } from "@/app/api/state/sync/route";

describe("live account safety", () => {
  it("refuses legacy snapshot writes until conflict-safe sync is deployed", async () => {
    const response = await pauseAccountSync();

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({
      code: "account_sync_paused",
    });
  });

  it("does not expose an account email lookup endpoint", () => {
    const routePath = join(
      process.cwd(),
      "src",
      "app",
      "api",
      "auth",
      "email-exists",
      "route.ts",
    );
    const authScreen = readFileSync(
      join(process.cwd(), "src", "components", "pace", "auth-screen.tsx"),
      "utf8",
    );

    expect(existsSync(routePath)).toBe(false);
    expect(authScreen).not.toContain("/api/auth/email-exists");
  });
});
