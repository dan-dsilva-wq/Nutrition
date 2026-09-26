"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { useAppState } from "@/lib/state/app-state";
import {
  healthSupported,
  useHealthSupported,
  readTodaySteps,
  readTodayWeight,
  requestHealthAccess,
} from "@/lib/health";

// One read at a time across every screen using the hook, so a weight sample
// can't be imported twice before state catches up. Subscribers re-render when
// a read starts or ends, so every "Sync now" button shows the same spinner.
let inflight: Promise<void> | null = null;
const syncListeners = new Set<() => void>();

function setInflight(next: Promise<void> | null) {
  inflight = next;
  syncListeners.forEach((listener) => listener());
}

function subscribeSyncing(listener: () => void) {
  syncListeners.add(listener);
  return () => {
    syncListeners.delete(listener);
  };
}

/**
 * Keeps today's steps and weight in step with Apple Health while the user has
 * it switched on. Runs on launch and whenever the app returns to the foreground.
 * Health only ever raises the step count, so a manual entry is never lowered.
 * Mount with `{ autoSync: true }` exactly once (the app shell); screens that
 * only need the controls call it without options.
 */
export function useAppleHealthSync({ autoSync = false }: { autoSync?: boolean } = {}) {
  const { isHydrating, steps, profile, onboardingExtras, actions } = useAppState();
  const settings = onboardingExtras.appleHealth;
  const supported = useHealthSupported();
  const enabled = Boolean(settings?.enabled) && supported;
  const syncing = useSyncExternalStore(
    subscribeSyncing,
    () => inflight !== null,
    () => false,
  );

  const latest = useRef({ steps, profile, settings, actions });
  useEffect(() => {
    latest.current = { steps, profile, settings, actions };
  });

  const runSync = useCallback(async () => {
    if (!healthSupported()) return;
    const [healthSteps, weight] = await Promise.all([readTodaySteps(), readTodayWeight()]);
    const current = latest.current;

    if (healthSteps !== null && healthSteps > current.steps) {
      current.actions.setSteps(healthSteps);
    }

    const patch = {
      ...current.settings,
      // A sync that finishes after "Turn off" must not switch Health back on.
      enabled: current.settings?.enabled ?? true,
      lastSyncedAtIso: new Date().toISOString(),
    };
    const isNewSample =
      weight !== null && weight.measuredAtIso !== current.settings?.lastWeightSampleIso;
    if (weight && isNewSample) {
      patch.lastWeightSampleIso = weight.measuredAtIso;
      const rounded = Math.round(weight.weightKg * 10) / 10;
      if (Math.abs(rounded - current.profile.currentWeightKg) >= 0.1) {
        current.actions.addWeight(rounded);
      }
    }
    current.actions.setOnboardingExtras({ appleHealth: patch });
  }, []);

  const sync = useCallback(async () => {
    if (!inflight) {
      setInflight(
        runSync().finally(() => {
          setInflight(null);
        }),
      );
    }
    return inflight ?? undefined;
  }, [runSync]);

  useEffect(() => {
    if (!autoSync || !enabled || isHydrating) return;
    void sync();
    let listener: { remove: () => void } | null = null;
    let cancelled = false;
    void CapacitorApp.addListener("appStateChange", (state) => {
      if (state.isActive) void sync();
    }).then((handle) => {
      if (cancelled) handle.remove();
      else listener = handle;
    });
    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [autoSync, enabled, isHydrating, sync]);

  const connect = useCallback(async () => {
    const shown = await requestHealthAccess();
    if (!shown) return false;
    latest.current.actions.setOnboardingExtras({
      appleHealth: { ...latest.current.settings, enabled: true },
    });
    await sync();
    return true;
  }, [sync]);

  const disconnect = useCallback(() => {
    latest.current.actions.setOnboardingExtras({
      appleHealth: { ...latest.current.settings, enabled: false },
    });
  }, []);

  return {
    supported,
    enabled,
    syncing,
    lastSyncedAtIso: settings?.lastSyncedAtIso,
    connect,
    disconnect,
    sync,
  };
}
