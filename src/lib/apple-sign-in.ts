import { Capacitor, registerPlugin } from "@capacitor/core";

/**
 * Native Sign in with Apple, backed by the `AppleSignIn` plugin that lives in
 * the iOS App target (ios/App/App/AppleSignInPlugin.swift). Only the iOS app
 * has it; the web and Android builds use Supabase's Apple OAuth redirect.
 */

interface AppleSignInResult {
  identityToken: string;
  user: string;
  authorizationCode?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
}

interface AppleSignInPlugin {
  authorize(options: { nonce?: string }): Promise<AppleSignInResult>;
}

const AppleSignIn = registerPlugin<AppleSignInPlugin>("AppleSignIn");

export function nativeAppleSignInAvailable(): boolean {
  return Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("AppleSignIn");
}

function randomNonce(bytes = 32): string {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => v.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, "0")).join("");
}

export function isAppleCancel(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "CANCELED";
}

/**
 * Shows Apple's native sheet. Returns the identity token plus the raw nonce
 * Supabase needs to verify it (Apple only ever sees the hash).
 */
export async function authorizeWithApple(): Promise<
  AppleSignInResult & { rawNonce: string }
> {
  const rawNonce = randomNonce();
  const result = await AppleSignIn.authorize({ nonce: await sha256Hex(rawNonce) });
  return { ...result, rawNonce };
}
