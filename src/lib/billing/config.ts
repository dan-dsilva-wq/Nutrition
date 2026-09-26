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

const APPLE_STANDARD_EULA_URL =
  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

const CUSTOM_TERMS_OF_USE_URL =
  process.env.NEXT_PUBLIC_TERMS_OF_USE_URL?.trim() ?? "";

export const PRIVACY_POLICY_URL =
  process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL?.trim() ||
  "https://pace-nutrition.vercel.app/privacypolicy.html";

export function revenueCatApiKeyForPlatform(platform: string) {
  if (platform === "ios") return REVENUECAT_IOS_API_KEY;
  if (platform === "android") return REVENUECAT_ANDROID_API_KEY;
  return "";
}

/** Pace's own terms if published, otherwise Apple's standard EULA on iOS. */
export function termsOfUseUrlForPlatform(platform: string) {
  if (CUSTOM_TERMS_OF_USE_URL) return CUSTOM_TERMS_OF_USE_URL;
  return platform === "ios" ? APPLE_STANDARD_EULA_URL : "";
}

export function billingConfiguredForClient(platform: string) {
  return BILLING_ENABLED && Boolean(revenueCatApiKeyForPlatform(platform));
}
