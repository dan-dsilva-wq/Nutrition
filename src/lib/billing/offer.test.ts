import { describe, expect, it } from "vitest";
import {
  freeTrialLabel,
  renewalPeriodLabel,
  subscriptionOfferFromProduct,
} from "./offer";

describe("subscription offer copy", () => {
  it("labels renewal periods", () => {
    expect(renewalPeriodLabel("P1M")).toBe("month");
    expect(renewalPeriodLabel("P1Y")).toBe("year");
    expect(renewalPeriodLabel("P3M")).toBe("3 months");
    expect(renewalPeriodLabel(null)).toBeNull();
    expect(renewalPeriodLabel("garbage")).toBeNull();
  });

  it("labels free trials in days when given in weeks", () => {
    expect(freeTrialLabel("P1W")).toBe("7-day");
    expect(freeTrialLabel("P3D")).toBe("3-day");
    expect(freeTrialLabel("P1M")).toBe("1-month");
  });

  it("reads an App Store free trial from the introductory price", () => {
    expect(
      subscriptionOfferFromProduct({
        priceString: "£4.99",
        subscriptionPeriod: "P1M",
        introPrice: { price: 0, period: "P1W" },
      }),
    ).toEqual({ priceString: "£4.99", periodLabel: "month", freeTrialLabel: "7-day" });
  });

  it("does not call a paid introductory price a free trial", () => {
    expect(
      subscriptionOfferFromProduct({
        priceString: "$9.99",
        subscriptionPeriod: "P1M",
        introPrice: { price: 0.99, period: "P1M" },
      })?.freeTrialLabel,
    ).toBeNull();
  });

  it("reads a Google Play free trial from the free phase", () => {
    expect(
      subscriptionOfferFromProduct({
        priceString: "$9.99",
        subscriptionPeriod: "P1M",
        introPrice: null,
        defaultOption: { freePhase: { billingPeriod: { iso8601: "P7D" } } },
      })?.freeTrialLabel,
    ).toBe("7-day");
  });

  it("returns null for a product without a subscription period", () => {
    expect(
      subscriptionOfferFromProduct({
        priceString: "$9.99",
        subscriptionPeriod: null,
        introPrice: null,
      }),
    ).toBeNull();
  });
});
