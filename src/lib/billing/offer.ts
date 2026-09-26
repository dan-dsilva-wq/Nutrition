/**
 * What the paywall must tell someone before they subscribe: the price, how
 * often it renews, and the length of any free trial. Built from the store
 * product so the copy always matches what the store will charge.
 */
export interface SubscriptionOffer {
  priceString: string;
  /** "month", "year", "3 months" ... */
  periodLabel: string;
  /** "7-day", "1-month" ... or null when the product has no free trial. */
  freeTrialLabel: string | null;
}

const UNIT_NAMES: Record<string, string> = {
  D: "day",
  W: "week",
  M: "month",
  Y: "year",
};

function parseIsoPeriod(iso?: string | null) {
  const match = iso?.match(/^P(\d+)([DWMY])$/);
  if (!match) return null;
  return { value: Number(match[1]), unit: match[2] };
}

/** "P1M" -> "month", "P3M" -> "3 months". */
export function renewalPeriodLabel(iso?: string | null) {
  const period = parseIsoPeriod(iso);
  if (!period) return null;
  const name = UNIT_NAMES[period.unit];
  return period.value === 1 ? name : `${period.value} ${name}s`;
}

/** "P1W" -> "7-day", "P3D" -> "3-day", "P1M" -> "1-month". */
export function freeTrialLabel(iso?: string | null) {
  const period = parseIsoPeriod(iso);
  if (!period) return null;
  if (period.unit === "W") return `${period.value * 7}-day`;
  return `${period.value}-${UNIT_NAMES[period.unit]}`;
}

interface StoreProductLike {
  priceString: string;
  subscriptionPeriod: string | null;
  introPrice: { price: number; period: string } | null;
  defaultOption?: {
    freePhase?: { billingPeriod?: { iso8601?: string } | null } | null;
  } | null;
}

export function subscriptionOfferFromProduct(
  product: StoreProductLike,
): SubscriptionOffer | null {
  const periodLabel = renewalPeriodLabel(product.subscriptionPeriod);
  if (!periodLabel) return null;

  // App Store free trials are an introductory price of 0. Google Play exposes
  // them as the free phase of the default subscription option.
  const trialPeriod =
    product.introPrice && product.introPrice.price === 0
      ? product.introPrice.period
      : product.defaultOption?.freePhase?.billingPeriod?.iso8601 ?? null;

  return {
    priceString: product.priceString,
    periodLabel,
    freeTrialLabel: freeTrialLabel(trialPeriod),
  };
}
