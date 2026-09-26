import { createPrivateKey, sign } from "node:crypto";

/**
 * Revokes a user's Sign in with Apple grant when they delete their account,
 * which App Review requires (guideline 5.1.1(v)). The iOS app re-authorizes
 * just before deletion and sends the fresh authorization code; we swap it for
 * a refresh token and revoke that. Needs a Sign in with Apple key from the
 * Apple Developer portal; without one this is skipped and deletion still runs.
 */

const APPLE_AUDIENCE = "https://appleid.apple.com";
const DEFAULT_CLIENT_ID = "com.danieldsilva.pace";

export interface AppleRevokeConfig {
  teamId: string;
  keyId: string;
  privateKey: string;
  clientId: string;
}

export function appleRevokeConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): AppleRevokeConfig | null {
  const teamId = env.APPLE_TEAM_ID?.trim();
  const keyId = env.APPLE_SIGN_IN_KEY_ID?.trim();
  // Vercel env vars usually hold the .p8 with literal "\n" sequences.
  const privateKey = env.APPLE_SIGN_IN_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!teamId || !keyId || !privateKey) return null;
  return {
    teamId,
    keyId,
    privateKey,
    clientId: env.APPLE_SIGN_IN_CLIENT_ID?.trim() || DEFAULT_CLIENT_ID,
  };
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

/** ES256 client secret JWT, as described in Apple's "Generate and validate tokens". */
export function appleClientSecret(config: AppleRevokeConfig, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = { alg: "ES256", kid: config.keyId };
  const payload = {
    iss: config.teamId,
    iat: nowSeconds,
    exp: nowSeconds + 300,
    aud: APPLE_AUDIENCE,
    sub: config.clientId,
  };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = sign("sha256", Buffer.from(signingInput), {
    key: createPrivateKey(config.privateKey),
    dsaEncoding: "ieee-p1363",
  });
  return `${signingInput}.${base64url(signature)}`;
}

async function postForm(path: string, body: Record<string, string>, fetchImpl: typeof fetch) {
  return fetchImpl(`${APPLE_AUDIENCE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    signal: AbortSignal.timeout(8000),
  });
}

/** Returns true when Apple confirmed the revoke. Never throws. */
export async function revokeAppleAuthorization(
  authorizationCode: string,
  config: AppleRevokeConfig | null = appleRevokeConfigFromEnv(),
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!config || !authorizationCode) return false;
  try {
    const clientSecret = appleClientSecret(config);
    const tokenRes = await postForm(
      "/auth/token",
      {
        client_id: config.clientId,
        client_secret: clientSecret,
        code: authorizationCode,
        grant_type: "authorization_code",
      },
      fetchImpl,
    );
    if (!tokenRes.ok) return false;
    const tokens = (await tokenRes.json()) as { refresh_token?: string; access_token?: string };
    const token = tokens.refresh_token ?? tokens.access_token;
    if (!token) return false;

    const revokeRes = await postForm(
      "/auth/revoke",
      {
        client_id: config.clientId,
        client_secret: clientSecret,
        token,
        token_type_hint: tokens.refresh_token ? "refresh_token" : "access_token",
      },
      fetchImpl,
    );
    return revokeRes.ok;
  } catch {
    return false;
  }
}
