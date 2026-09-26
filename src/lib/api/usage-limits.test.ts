import { describe, expect, it, vi } from "vitest";
import type { BillingSubscriptionRow } from "@/lib/billing/subscription";
import { claimUsage, type UsageLimitsClient } from "./usage-limits";

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient: () => null,
}));

const userId = "11111111-1111-4111-8111-111111111111";
const now = new Date("2026-09-26T12:00:00Z");

function fakeAdmin({
  subscription = null,
  counts = {},
  limitOverride,
}: {
  subscription?: BillingSubscriptionRow | null;
  counts?: Record<string, number>;
  limitOverride?: number;
} = {}) {
  const rpc = vi.fn(async (fn: string, args: Record<string, unknown>) => {
    const key = `${args.p_feature}:${args.p_period_key}`;
    const current = counts[key] ?? 0;
    if (fn === "consume_ai_usage") {
      const limit = limitOverride ?? (args.p_limit as number);
      if (current >= limit) return { data: null, error: null };
      counts[key] = current + 1;
      return { data: counts[key], error: null };
    }
    if (fn === "release_ai_usage") {
      counts[key] = Math.max(current - 1, 0);
      return { data: null, error: null };
    }
    throw new Error(`unexpected rpc ${fn}`);
  });
  const admin: UsageLimitsClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: subscription, error: null }),
        }),
      }),
    }),
    rpc,
  };
  return { admin, rpc, counts };
}

describe("claimUsage", () => {
  it("does not meter anything while billing is disabled", async () => {
    const { admin, rpc } = fakeAdmin();
    const decision = await claimUsage({
      admin,
      userId,
      feature: "ai-photo",
      billingEnabled: false,
      now,
    });
    expect(decision.allowed).toBe(true);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("allows three photo estimates a day, then rejects with 402", async () => {
    const { admin, counts } = fakeAdmin();
    for (let i = 0; i < 3; i += 1) {
      const decision = await claimUsage({ admin, userId, feature: "ai-photo", billingEnabled: true, now });
      expect(decision.allowed).toBe(true);
    }
    expect(counts["ai-photo:2026-09-26"]).toBe(3);

    const blocked = await claimUsage({ admin, userId, feature: "ai-photo", billingEnabled: true, now });
    expect(blocked.allowed).toBe(false);
    if (blocked.allowed) return;
    expect(blocked.response.status).toBe(402);
    await expect(blocked.response.json()).resolves.toMatchObject({ code: "daily-cap", limit: 3 });

    const tomorrow = await claimUsage({
      admin,
      userId,
      feature: "ai-photo",
      billingEnabled: true,
      now: new Date("2026-09-27T00:30:00Z"),
    });
    expect(tomorrow.allowed).toBe(true);
  });

  it("allows five coach messages per ISO week", async () => {
    const { admin, counts } = fakeAdmin({ counts: { "coach:2026-W39": 5 } });
    const blocked = await claimUsage({ admin, userId, feature: "coach", billingEnabled: true, now });
    expect(blocked.allowed).toBe(false);
    if (blocked.allowed) return;
    await expect(blocked.response.json()).resolves.toMatchObject({ code: "weekly-cap", limit: 5 });

    const nextWeek = await claimUsage({
      admin,
      userId,
      feature: "coach",
      billingEnabled: true,
      now: new Date("2026-09-28T08:00:00Z"),
    });
    expect(nextWeek.allowed).toBe(true);
    expect(counts["coach:2026-W40"]).toBe(1);
  });

  it("gives quota back when the AI call fails", async () => {
    const { admin, counts } = fakeAdmin();
    const decision = await claimUsage({ admin, userId, feature: "ai-photo", billingEnabled: true, now });
    expect(decision.allowed).toBe(true);
    if (!decision.allowed) return;
    await decision.release();
    expect(counts["ai-photo:2026-09-26"]).toBe(0);
  });

  it("skips metering for active subscribers and trials", async () => {
    const future = "2026-10-26T00:00:00Z";
    for (const subscription of [
      { status: "active", current_period_ends_at: future },
      { status: "trial", trial_ends_at: future },
    ] as BillingSubscriptionRow[]) {
      const { admin, rpc } = fakeAdmin({ subscription, limitOverride: 0 });
      const decision = await claimUsage({ admin, userId, feature: "coach", billingEnabled: true, now });
      expect(decision.allowed).toBe(true);
      expect(rpc).not.toHaveBeenCalled();
    }
  });

  it("treats a lapsed subscription as free tier", async () => {
    const { admin } = fakeAdmin({
      subscription: { status: "active", current_period_ends_at: "2026-09-01T00:00:00Z" },
      counts: { "ai-photo:2026-09-26": 3 },
    });
    const decision = await claimUsage({ admin, userId, feature: "ai-photo", billingEnabled: true, now });
    expect(decision.allowed).toBe(false);
  });

  it("fails closed when the admin client is missing", async () => {
    const decision = await claimUsage({ admin: null, userId, feature: "coach", billingEnabled: true, now });
    expect(decision.allowed).toBe(false);
    if (decision.allowed) return;
    expect(decision.response.status).toBe(503);
  });

  it("requires a signed-in user when billing is enabled", async () => {
    const { admin } = fakeAdmin();
    const decision = await claimUsage({ admin, userId: null, feature: "coach", billingEnabled: true, now });
    expect(decision.allowed).toBe(false);
    if (decision.allowed) return;
    expect(decision.response.status).toBe(401);
  });
});
