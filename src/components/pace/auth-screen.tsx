"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Capacitor } from "@capacitor/core";
import { Mail, ArrowRight, UserPlus } from "lucide-react";
import { Button, Field, Input, Wordmark } from "./primitives";
import { getSupabase } from "@/lib/state/app-state";
import {
  authorizeWithApple,
  isAppleCancel,
  nativeAppleSignInAvailable,
} from "@/lib/apple-sign-in";
import { LEGAL_LINKS } from "@/lib/legal";

const NATIVE_REDIRECT = "com.danieldsilva.pace://auth/callback";

function authRedirect(): string {
  return Capacitor.isNativePlatform()
    ? NATIVE_REDIRECT
    : `${window.location.origin}/auth/callback`;
}

export function AuthScreen() {
  const supabase = useMemo(() => getSupabase(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [message, setMessage] = useState<string | null>(null);
  const [missingEmail, setMissingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!supabase) {
    // Should not normally render  -  when supabase is unconfigured, auth.kind is "demo".
    return null;
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setMissingEmail(false);

    const result =
      mode === "sign-in"
        ? await supabase!.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase!.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: authRedirect() },
          });

    setIsSubmitting(false);

    if (result.error) {
      if (mode === "sign-in") {
        const exists = await checkEmailExists(email);

        if (exists === false) {
          setMissingEmail(true);
          setMessage("Email address doesn't exist.");
          return;
        }
      }

      setMessage(result.error.message);
      return;
    }
    if (mode === "sign-up") {
      setMessage("We sent you a confirmation email. Click the link in your inbox to finish.");
    }
  }

  async function handleGoogle() {
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authRedirect() },
    });
    setIsSubmitting(false);
    if (error) setMessage(error.message);
  }

  async function handleApple() {
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (!nativeAppleSignInAvailable()) {
        // Web and Android: Supabase's hosted Apple OAuth page, back via the same
        // callback Google uses.
        const { error } = await supabase!.auth.signInWithOAuth({
          provider: "apple",
          options: { redirectTo: authRedirect() },
        });
        if (error) setMessage(error.message);
        return;
      }

      const apple = await authorizeWithApple();
      const { error } = await supabase!.auth.signInWithIdToken({
        provider: "apple",
        token: apple.identityToken,
        nonce: apple.rawNonce,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
      // Apple shares the name only on the first sign-in, so keep it now rather
      // than asking for it again later.
      const fullName = [apple.givenName, apple.familyName].filter(Boolean).join(" ");
      if (fullName) {
        await supabase!.auth
          .updateUser({ data: { full_name: fullName, given_name: apple.givenName } })
          .catch(() => undefined);
      }
    } catch (error) {
      if (!isAppleCancel(error)) {
        setMessage("Sign in with Apple didn't finish. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function checkEmailExists(value: string): Promise<boolean | null> {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) return null;

    try {
      const response = await fetch("/api/auth/email-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) return null;

      const payload = (await response.json()) as { exists?: unknown };
      return typeof payload.exists === "boolean" ? payload.exists : null;
    } catch {
      return null;
    }
  }

  function switchMode(nextMode: "sign-in" | "sign-up") {
    setMode(nextMode);
    setMessage(null);
    setMissingEmail(false);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="stagger mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-16">
        <div className="slide-down-anim">
          <Wordmark size="lg" />
        </div>
        <h1 className="blur-in-anim font-display mt-10 text-4xl leading-[1.05] text-ink-2">
          A food diary at your <span className="italic">own pace</span>.
        </h1>
        <p className="slide-up-anim mt-3 text-base text-muted">
          Snap a meal. See the next good move. Calm tracking, no pressure.
        </p>

        <form className="slide-up-anim mt-10 space-y-4" onSubmit={handleEmailAuth}>
          <Field label="Email">
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field
            label="Password"
            hint={mode === "sign-up" ? "At least 8 characters." : undefined}
          >
            <Input
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {message ? (
            <p className="text-sm text-clay">{message}</p>
          ) : null}
          {missingEmail ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => switchMode("sign-up")}
            >
              <UserPlus size={16} /> Create account with these details
            </Button>
          ) : null}
          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            {mode === "sign-in" ? "Sign in" : "Create account"} <ArrowRight size={18} />
          </Button>
        </form>

        <div className="slide-up-anim my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-faint">
          <span className="h-px flex-1 bg-hairline" /> or <span className="h-px flex-1 bg-hairline" />
        </div>

        <div className="slide-up-anim space-y-3">
          <button
            type="button"
            data-tap
            onClick={handleApple}
            disabled={isSubmitting}
            className="tap-bounce inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-base font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <AppleLogo /> Continue with Apple
          </button>
          <Button variant="secondary" size="lg" fullWidth onClick={handleGoogle}>
            <Mail size={16} /> Continue with Google
          </Button>
        </div>

        <button
          type="button"
          onClick={() => switchMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="slide-up-anim link-reveal mt-6 mx-auto text-sm text-muted"
        >
          {mode === "sign-in" ? "Need an account? Sign up." : "Have an account? Sign in."}
        </button>

        <p className="fade-anim mt-auto pt-8 pb-2 text-center text-xs text-faint">
          By continuing you agree to our{" "}
          <a className="underline underline-offset-4" href={LEGAL_LINKS.terms}>
            Terms
          </a>{" "}
          and{" "}
          <a className="underline underline-offset-4" href={LEGAL_LINKS.privacy}>
            Privacy Policy
          </a>
          .
        </p>
        <p className="fade-anim pb-8 text-center text-xs text-faint">
          For adults 18+. Pace is a food-logging tool, not medical advice.
        </p>
      </div>
    </div>
  );
}

function AppleLogo() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden fill="currentColor">
      <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5Z" />
    </svg>
  );
}
