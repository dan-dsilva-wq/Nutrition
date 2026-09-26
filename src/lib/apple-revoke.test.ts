import { createPublicKey, generateKeyPairSync, verify } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  appleClientSecret,
  appleRevokeConfigFromEnv,
  revokeAppleAuthorization,
  type AppleRevokeConfig,
} from "./apple-revoke";

function testConfig(): { config: AppleRevokeConfig; publicKeyPem: string } {
  const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  return {
    config: {
      teamId: "TEAM123456",
      keyId: "KEY1234567",
      clientId: "com.danieldsilva.pace",
      privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    },
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
  };
}

describe("appleRevokeConfigFromEnv", () => {
  it("is null until the key is configured", () => {
    expect(appleRevokeConfigFromEnv({ APPLE_TEAM_ID: "T" })).toBeNull();
  });

  it("unescapes newlines and defaults the client id to the bundle id", () => {
    const config = appleRevokeConfigFromEnv({
      APPLE_TEAM_ID: "T",
      APPLE_SIGN_IN_KEY_ID: "K",
      APPLE_SIGN_IN_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----",
    });
    expect(config?.privateKey).toContain("\nabc\n");
    expect(config?.clientId).toBe("com.danieldsilva.pace");
  });
});

describe("appleClientSecret", () => {
  it("builds an ES256 JWT Apple can verify", () => {
    const { config, publicKeyPem } = testConfig();
    const jwt = appleClientSecret(config, 1_700_000_000);
    const [header, payload, signature] = jwt.split(".");

    expect(JSON.parse(Buffer.from(header, "base64url").toString())).toEqual({
      alg: "ES256",
      kid: "KEY1234567",
    });
    expect(JSON.parse(Buffer.from(payload, "base64url").toString())).toEqual({
      iss: "TEAM123456",
      iat: 1_700_000_000,
      exp: 1_700_000_300,
      aud: "https://appleid.apple.com",
      sub: "com.danieldsilva.pace",
    });
    const ok = verify(
      "sha256",
      Buffer.from(`${header}.${payload}`),
      { key: createPublicKey(publicKeyPem), dsaEncoding: "ieee-p1363" },
      Buffer.from(signature, "base64url"),
    );
    expect(ok).toBe(true);
  });
});

describe("revokeAppleAuthorization", () => {
  it("exchanges the code and revokes the refresh token", async () => {
    const { config } = testConfig();
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ refresh_token: "r-token" })))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await expect(revokeAppleAuthorization("code-1", config, fetchImpl)).resolves.toBe(true);

    expect(fetchImpl.mock.calls[0][0]).toBe("https://appleid.apple.com/auth/token");
    expect(String(fetchImpl.mock.calls[0][1].body)).toContain("code=code-1");
    expect(fetchImpl.mock.calls[1][0]).toBe("https://appleid.apple.com/auth/revoke");
    expect(String(fetchImpl.mock.calls[1][1].body)).toContain("token=r-token");
  });

  it("skips quietly without config and reports Apple errors as false", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("bad", { status: 400 }));
    await expect(revokeAppleAuthorization("code", null, fetchImpl)).resolves.toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();

    await expect(revokeAppleAuthorization("code", testConfig().config, fetchImpl)).resolves.toBe(false);
  });
});
