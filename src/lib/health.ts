import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Apple Health (HealthKit) read access for the iOS app, via @capgo/capacitor-health.
 * Pace only reads steps and body weight; it never writes to Health. Everything
 * here is a no-op outside the native iOS shell.
 */

const READ_TYPES = ["steps", "weight"] as const;

export function healthSupported(): boolean {
  return (
    Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("Health")
  );
}

async function plugin() {
  const { Health } = await import("@capgo/capacitor-health");
  return Health;
}

/** True when HealthKit is usable on this device (false on iPad without Health, etc). */
export async function healthAvailable(): Promise<boolean> {
  if (!healthSupported()) return false;
  try {
    const Health = await plugin();
    const res = await Health.isAvailable();
    return res.available;
  } catch {
    return false;
  }
}

/**
 * Shows the HealthKit permission sheet. HealthKit never tells an app whether
 * read access was denied, so a resolved call only means the sheet was shown.
 */
export async function requestHealthAccess(): Promise<boolean> {
  if (!healthSupported()) return false;
  try {
    const Health = await plugin();
    await Health.requestAuthorization({ read: [...READ_TYPES] });
    return true;
  } catch {
    return false;
  }
}

function startOfLocalDay(d = new Date()) {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start;
}

/** Total steps recorded in Health since local midnight, or null if unreadable. */
export async function readTodaySteps(): Promise<number | null> {
  if (!healthSupported()) return null;
  try {
    const Health = await plugin();
    const start = startOfLocalDay();
    const res = await Health.queryAggregated({
      dataType: "steps",
      startDate: start.toISOString(),
      endDate: new Date().toISOString(),
      bucket: "day",
      aggregation: "sum",
    });
    const total = res.samples.reduce((sum, s) => sum + (s.value || 0), 0);
    return Math.round(total);
  } catch {
    return null;
  }
}

export interface HealthWeight {
  weightKg: number;
  measuredAtIso: string;
}

/** Most recent body weight recorded in Health today, or null. */
export async function readTodayWeight(): Promise<HealthWeight | null> {
  if (!healthSupported()) return null;
  try {
    const Health = await plugin();
    const res = await Health.readSamples({
      dataType: "weight",
      startDate: startOfLocalDay().toISOString(),
      endDate: new Date().toISOString(),
      limit: 1,
      ascending: false,
    });
    const latest = res.samples[0];
    if (!latest || !Number.isFinite(latest.value) || latest.value <= 0) return null;
    return { weightKg: latest.value, measuredAtIso: latest.endDate || latest.startDate };
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/**
 * `healthSupported()` for render code: false during server render and
 * hydration, then the real answer, so native-only UI never causes a mismatch.
 */
export function useHealthSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, healthSupported, () => false);
}

/**
 * "native" in the installed iOS/Android app, "web" in a browser, and "unknown"
 * until hydration finishes, so native-only or web-only UI never flashes.
 */
export function useAppSurface(): "native" | "web" | "unknown" {
  return useSyncExternalStore(
    noopSubscribe,
    () => (Capacitor.isNativePlatform() ? "native" : "web"),
    () => "unknown",
  );
}
