export const BILLING_ENABLED =
  process.env.NEXT_PUBLIC_BILLING_ENABLED === "true";

/**
 * RevenueCat public SDK keys are per store (`appl_` for the App Store,
 * `goog_` for Google Play). Both native apps load the same deployment, so each
 * platform reads its own key. `NEXT_PUBLIC_REVENUECAT_PUBLIC_API_KEY` is the
 * older single-key setting and is used when a platform key is not set.
 */
const REVENUECAT_LEGACY_PUBLIC_API_KEY =
  process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_API_KEY?.trim() ?? "";

export const REVENUECAT_IOS_API_KEY =
  process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY?.trim() ||
  REVENUECAT_LEGACY_PUBLIC_API_KEY;

export const REVENUECAT_ANDROID_API_KEY =
  process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim() ||
  REVENUECAT_LEGACY_PUBLIC_API_KEY;

export const REVENUECAT_ENTITLEMENT_ID =
  process.env.NEXT_PUBLIC_REVENUECAT_ENTITLEMENT_ID?.trim() || "premium";

export const REVENUECAT_OFFERING_ID =
  process.env.NEXT_PUBLIC_REVENUECAT_OFFERING_ID?.trim() || "";

export function revenueCatApiKeyForPlatform(platform: string) {
  if (platform === "ios") return REVENUECAT_IOS_API_KEY;
  if (platform === "android") return REVENUECAT_ANDROID_API_KEY;
  return "";
}

export function billingConfiguredForClient(platform: string) {
  return BILLING_ENABLED && Boolean(revenueCatApiKeyForPlatform(platform));
}
