"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BILLING_ENABLED,
  PRIVACY_POLICY_URL,
  termsOfUseUrlForPlatform,
} from "@/lib/billing/config";
import type { SubscriptionOffer } from "@/lib/billing/offer";
import {
  billingCanUseNativePurchases,
  loadRevenueCatSubscriptionOffer,
} from "@/lib/billing/revenuecat-client";
import { useAppState } from "@/lib/state/app-state";

function useSubscriptionOffer() {
  const { auth } = useAppState();
  const [offer, setOffer] = useState<SubscriptionOffer | null>(null);
  const userId = auth.kind === "signed-in" ? auth.userId : null;
  const email = auth.kind === "signed-in" ? auth.email : null;

  useEffect(() => {
    if (!userId || !billingCanUseNativePurchases()) return;
    let cancelled = false;
    loadRevenueCatSubscriptionOffer({ userId, email })
      .then((next) => {
        if (!cancelled) setOffer(next);
      })
      .catch(() => {
        /* the terms below still render without a price */
      });
    return () => {
      cancelled = true;
    };
  }, [userId, email]);

  return offer;
}

const noSubscribe = () => () => {};

/** "web" during server render so hydration matches, then the real platform. */
function usePlatform() {
  return useSyncExternalStore(
    noSubscribe,
    () => Capacitor.getPlatform(),
    () => "web",
  );
}

/**
 * Price, renewal and cancellation terms plus legal links, shown next to every
 * subscribe button while live billing is on (App Store Guideline 3.1.2).
 */
export function SubscriptionTerms({ className = "" }: { className?: string }) {
  const offer = useSubscriptionOffer();
  const platform = usePlatform();
  if (!BILLING_ENABLED) return null;

  const storeName = platform === "android" ? "Google Play" : "App Store";
  const termsUrl = termsOfUseUrlForPlatform(platform);

  const priceLine = offer
    ? offer.freeTrialLabel
      ? `${offer.freeTrialLabel} free trial, then ${offer.priceString} per ${offer.periodLabel}.`
      : `${offer.priceString} per ${offer.periodLabel}.`
    : null;
  const cancelBefore = offer?.freeTrialLabel ? "the trial" : "the current period";

  return (
    <div className={`space-y-1 text-center text-[11px] leading-snug text-muted ${className}`}>
      {priceLine ? <p className="text-xs font-medium text-ink-2">{priceLine}</p> : null}
      <p>
        Renews automatically until cancelled. Payment is charged to your{" "}
        {storeName} account. Cancel anytime in your {storeName} settings at least
        24 hours before {cancelBefore} ends.
      </p>
      <p className="space-x-3">
        {termsUrl ? (
          <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Terms of Use
          </a>
        ) : null}
        <a
          href={PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
