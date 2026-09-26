"use client";

import { Heart, RefreshCw } from "lucide-react";
import { useAppleHealthSync } from "@/lib/use-apple-health-sync";
import { Button, Card, IconBadge, SectionHeader } from "./primitives";

function syncedLabel(iso?: string) {
  if (!iso) return null;
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (!Number.isFinite(minutes)) return null;
  if (minutes < 1) return "Synced just now";
  if (minutes < 60) return `Synced ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Synced ${hours} h ago`;
  return "Synced over a day ago";
}

/**
 * Apple Health connect/disconnect controls. Renders nothing outside the iOS
 * app, where HealthKit doesn't exist.
 */
export function AppleHealthCard() {
  const health = useAppleHealthSync();
  if (!health.supported) return null;

  const synced = syncedLabel(health.lastSyncedAtIso);

  return (
    <Card>
      <SectionHeader eyebrow="Apple Health" title={health.enabled ? "Connected" : "Fill in steps and weight for you"} />
      <div className="flex items-start gap-3">
        <IconBadge tone="clay">
          <Heart size={16} aria-hidden />
        </IconBadge>
        <p className="flex-1 text-sm text-ink-2">
          {health.enabled
            ? "Today's steps and any weigh-in from your scale or Apple Watch are added to Pace automatically."
            : "Pace can read your steps and body weight from the Health app, so you don't have to type them in. Pace never writes to Health or shares this data."}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {health.enabled ? (
          <>
            <Button variant="secondary" loading={health.syncing} onClick={() => void health.sync()}>
              <RefreshCw size={16} aria-hidden /> Sync now
            </Button>
            <Button variant="ghost" onClick={health.disconnect}>
              Turn off
            </Button>
          </>
        ) : (
          <Button onClick={() => void health.connect()}>Connect Apple Health</Button>
        )}
      </div>
      {health.enabled ? (
        <p className="mt-3 text-xs text-muted">
          {synced ? `${synced}. ` : ""}Manage access in Settings › Health › Data Access & Devices › Pace.
        </p>
      ) : null}
    </Card>
  );
}
