import { NextResponse } from "next/server";
import { BILLING_ENABLED } from "@/lib/billing/config";
import {
  normalizeBillingSubscription,
  subscriptionIsPaidOrTrial,
  type BillingSubscriptionRow,
} from "@/lib/billing/subscription";
import {
  FREE_TIER_AI_PHOTO_PER_DAY,
  FREE_TIER_COACH_PER_WEEK,
  utcDayKey,
  utcIsoWeekKey,
} from "@/lib/free-tier";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type MeteredFeature = "ai-photo" | "coach";

type RpcResult<T> = PromiseLike<{ data: T | null; error: unknown }>;

// The slice of the Supabase admin client this module uses, so tests can
// pass a fake.
export interface UsageLimitsClient {
  from(table: "billing_subscriptions"): {
    select(columns: string): {
      eq(
        column: "user_id",
        value: string,
      ): { maybeSingle(): RpcResult<BillingSubscriptionRow> };
    };
  };
  rpc(fn: string, args: Record<string, unknown>): RpcResult<unknown>;
}

const limits: Record<
  MeteredFeature,
  { limit: number; periodKey: (now: Date) => string; code: "daily-cap" | "weekly-cap"; message: string }
> = {
  "ai-photo": {
    limit: FREE_TIER_AI_PHOTO_PER_DAY,
    periodKey: utcDayKey,
    code: "daily-cap",
    message: `You've used today's ${FREE_TIER_AI_PHOTO_PER_DAY} free photo estimates. Upgrade to Premium for unlimited estimates.`,
  },
  coach: {
    limit: FREE_TIER_COACH_PER_WEEK,
    periodKey: utcIsoWeekKey,
    code: "weekly-cap",
    message: `You've used this week's ${FREE_TIER_COACH_PER_WEEK} free coach messages. Upgrade to Premium to keep chatting.`,
  },
};

export type UsageDecision =
  | { allowed: true; release: () => Promise<void> }
  | { allowed: false; response: NextResponse };

const noopRelease = async () => {};

export async function claimUsage({
  admin,
  userId,
  feature,
  billingEnabled = BILLING_ENABLED,
  now = new Date(),
}: {
  admin: UsageLimitsClient | null;
  userId: string | null;
  feature: MeteredFeature;
  billingEnabled?: boolean;
  now?: Date;
}): Promise<UsageDecision> {
  // Before billing launches there is no way to pay, and trials live only on
  // the device, so the server has nothing to enforce against.
  if (!billingEnabled) return { allowed: true, release: noopRelease };

  if (!userId) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Sign in to use this feature." }, { status: 401 }),
    };
  }

  if (!admin) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Usage limits are unavailable." }, { status: 503 }),
    };
  }

  const { data: subscriptionRow, error: subscriptionError } = await admin
    .from("billing_subscriptions")
    .select("status,trial_ends_at,current_period_ends_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (subscriptionError) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Could not check your plan." }, { status: 503 }),
    };
  }

  if (subscriptionIsPaidOrTrial(normalizeBillingSubscription(subscriptionRow))) {
    return { allowed: true, release: noopRelease };
  }

  const rule = limits[feature];
  const periodKey = rule.periodKey(now);
  const { data: newCount, error: consumeError } = await admin.rpc("consume_ai_usage", {
    p_user_id: userId,
    p_feature: feature,
    p_period_key: periodKey,
    p_limit: rule.limit,
  });

  if (consumeError) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Could not check your usage." }, { status: 503 }),
    };
  }

  if (newCount == null) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: rule.message, code: rule.code, limit: rule.limit },
        { status: 402 },
      ),
    };
  }

  return {
    allowed: true,
    release: async () => {
      await admin.rpc("release_ai_usage", {
        p_user_id: userId,
        p_feature: feature,
        p_period_key: periodKey,
      });
    },
  };
}

export async function claimUsageForUser(userId: string | null, feature: MeteredFeature) {
  return claimUsage({
    admin: createSupabaseAdminClient() as unknown as UsageLimitsClient | null,
    userId,
    feature,
  });
}
