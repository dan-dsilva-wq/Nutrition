/**
 * Single source for the facts the Privacy Policy and Terms rely on. Update the
 * operator details here (and bump the dates) before changing either page.
 */
export const LEGAL = {
  appName: "Pace",
  /** The person or company legally responsible for Pace (the data controller). */
  operator: "Daniel D'Silva",
  contactEmail: "vxvo.admin@gmail.com",
  siteUrl: "https://pace-nutrition.vercel.app",
  governingLaw: "England and Wales",
  privacyUpdated: "26 September 2026",
  termsUpdated: "26 September 2026",
  minimumAge: 18,
} as const;

export const LEGAL_LINKS = {
  privacy: "/privacy",
  terms: "/terms",
  deleteAccount: "/account/delete",
} as const;

/** Third parties that receive personal data, as disclosed in the Privacy Policy. */
export const DATA_PROCESSORS = [
  {
    name: "Supabase",
    purpose: "Sign-in, database and file storage for your account, logs and photos.",
  },
  {
    name: "Vercel",
    purpose: "Hosts the app and its server functions; keeps short-lived request logs.",
  },
  {
    name: "OpenAI",
    purpose:
      "Only if you allow AI features: reads meal photos to estimate nutrition and writes coach replies.",
  },
  {
    name: "RevenueCat and Apple / Google",
    purpose: "Process subscriptions and tell Pace whether Premium is active.",
  },
  {
    name: "Google",
    purpose: "Only if you choose Continue with Google: confirms who you are.",
  },
  {
    name: "Open Food Facts and USDA FoodData Central",
    purpose: "Receive the barcode or food name you search for. No account details are sent.",
  },
] as const;
