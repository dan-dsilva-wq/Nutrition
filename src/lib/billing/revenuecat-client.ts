"use client";

import { Capacitor } from "@capacitor/core";
import {
  billingConfiguredForClient,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_OFFERING_ID,
  revenueCatApiKeyForPlatform,
} from "@/lib/billing/config";
import {
  subscriptionOfferFromProduct,
  type SubscriptionOffer,
} from "@/lib/billing/offer";
import type { Subscription } from "@/lib/state/types";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "@revenuecat/purchases-capacitor";

let configuredForUserId: string | null = null;

export function billingCanUseNativePurchases() {
  return (
    Capacitor.isNativePlatform() &&
    billingConfiguredForClient(Capacitor.getPlatform())
  );
}

function subscriptionFromCustomerInfo(customerInfo: CustomerInfo): Subscription {
  const entitlement =
    customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] ??
    Object.values(customerInfo.entitlements.active)[0];

  if (!entitlement?.isActive) {
    return {
      status: "none",
      provider: "revenuecat",
      providerAppUserId: customerInfo.originalAppUserId,
    };
  }

  return {
    status: entitlement.periodType === "TRIAL" ? "trial" : "active",
    provider: "revenuecat",
    providerAppUserId: customerInfo.originalAppUserId,
    entitlementId: entitlement.identifier,
    productId: entitlement.productIdentifier,
    store: entitlement.store,
    environment: entitlement.isSandbox ? "SANDBOX" : "PRODUCTION",
    trialStartedAtIso:
      entitlement.periodType === "TRIAL" ? entitlement.latestPurchaseDate : undefined,
    trialEndsAtIso:
      entitlement.periodType === "TRIAL" ? entitlement.expirationDate ?? undefined : undefined,
    currentPeriodEndsAtIso: entitlement.expirationDate ?? undefined,
  };
}

function pickPackage(offering: PurchasesOffering): PurchasesPackage | null {
  return (
    offering.monthly ??
    offering.annual ??
    offering.weekly ??
    offering.availablePackages[0] ??
    null
  );
}

async function configureRevenueCat(userId: string, email?: string | null) {
  if (!billingCanUseNativePurchases()) {
    throw new Error("Live billing is not enabled for this build.");
  }

  const { Purchases, LOG_LEVEL } = await import("@revenuecat/purchases-capacitor");
  const { isConfigured } = await Purchases.isConfigured().catch(() => ({
    isConfigured: false,
  }));

  if (!isConfigured) {
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({
      apiKey: revenueCatApiKeyForPlatform(Capacitor.getPlatform()),
      appUserID: userId,
    });
    configuredForUserId = userId;
  } else if (configuredForUserId !== userId) {
    await Purchases.logIn({ appUserID: userId });
    configuredForUserId = userId;
  }

  if (email) {
    await Purchases.setEmail({ email }).catch(() => {});
  }

  return Purchases;
}

async function currentPackage(
  Purchases: Awaited<ReturnType<typeof configureRevenueCat>>,
) {
  const offerings = await Purchases.getOfferings();
  const offering = REVENUECAT_OFFERING_ID
    ? offerings.all[REVENUECAT_OFFERING_ID] ?? offerings.current
    : offerings.current;
  return offering ? pickPackage(offering) : null;
}

/** The price, renewal period and trial of the package a purchase will buy. */
export async function loadRevenueCatSubscriptionOffer({
  userId,
  email,
}: {
  userId: string;
  email?: string | null;
}): Promise<SubscriptionOffer | null> {
  const Purchases = await configureRevenueCat(userId, email);
  const aPackage = await currentPackage(Purchases);
  return aPackage ? subscriptionOfferFromProduct(aPackage.product) : null;
}

export async function purchaseRevenueCatSubscription({
  userId,
  email,
}: {
  userId: string;
  email?: string | null;
}): Promise<Subscription> {
  const Purchases = await configureRevenueCat(userId, email);
  const aPackage = await currentPackage(Purchases);

  if (!aPackage) {
    throw new Error("No RevenueCat subscription package is configured.");
  }

  const result = await Purchases.purchasePackage({ aPackage });
  return subscriptionFromCustomerInfo(result.customerInfo);
}

export async function restoreRevenueCatSubscription({
  userId,
  email,
}: {
  userId: string;
  email?: string | null;
}): Promise<Subscription> {
  const Purchases = await configureRevenueCat(userId, email);
  const result = await Purchases.restorePurchases();
  return subscriptionFromCustomerInfo(result.customerInfo);
}
