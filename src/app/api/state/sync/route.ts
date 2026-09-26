import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The previous endpoint deleted every server meal and check-in before trying
 * to recreate the device snapshot. A partial request, an older local cache, or
 * a non-UUID local id could therefore destroy the user's existing records.
 *
 * Keep the route present while installed clients still call it, but refuse all
 * writes until the versioned, conflict-safe account sync is deployed with its
 * matching database migration.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Account sync is temporarily paused while your records are protected.",
      code: "account_sync_paused",
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
