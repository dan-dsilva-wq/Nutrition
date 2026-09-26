import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Pace support",
  description: "Help with Pace accounts, data, photos, reminders, and privacy.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          Pace · Support
        </p>
        <h1 className="font-display text-[42px] leading-[1.05] text-ink-2">
          How can we help?
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted">
          Find the quickest route for account access, data, photos, reminders,
          and privacy questions.
        </p>
      </header>

      <section className="rounded-2xl border border-hairline bg-paper p-6">
        <h2 className="text-lg font-semibold text-ink">Contact Pace support</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Email{" "}
          <a
            className="font-medium text-forest underline underline-offset-4"
            href={`mailto:${LEGAL.contactEmail}`}
          >
            {LEGAL.contactEmail}
          </a>
          . If the question is about an account, write from the email address
          used to sign in when possible. Do not email passwords or one-time
          security codes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink-2">Common questions</h2>

        <article className="rounded-2xl border border-hairline bg-paper p-5">
          <h3 className="font-semibold text-ink">I cannot sign in</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use <strong>Forgot password?</strong> on the sign-in screen and
            follow the reset link sent to your email. Check the spam folder if
            it does not arrive.
          </p>
        </article>

        <article className="rounded-2xl border border-hairline bg-paper p-5">
          <h3 className="font-semibold text-ink">I want a copy of my data</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Open <strong>Settings → Export data</strong> to download a JSON copy
            of the Pace data saved on the current device. The export can contain
            sensitive meal, weight, and photo information, so keep it private.
          </p>
        </article>

        <article className="rounded-2xl border border-hairline bg-paper p-5">
          <h3 className="font-semibold text-ink">I want to delete my account</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use <strong>Settings → Delete account</strong> in Pace or open the{" "}
            <a
              className="text-forest underline underline-offset-4"
              href="/account/delete"
            >
              account deletion page
            </a>
            . The page explains what will be removed before you confirm.
          </p>
        </article>

        <article className="rounded-2xl border border-hairline bg-paper p-5">
          <h3 className="font-semibold text-ink">A meal estimate looks wrong</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            AI meal estimates are approximate. Review the food and nutrition
            before saving, or enter the food manually. Pace provides general
            wellness information and does not replace advice from a qualified
            health professional.
          </p>
        </article>

        <article className="rounded-2xl border border-hairline bg-paper p-5">
          <h3 className="font-semibold text-ink">Reminders are not appearing</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Check that the reminder is enabled in Pace and that notifications
            are allowed for Pace in the device settings. The device may also
            delay notifications when Focus or battery-saving modes are active.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-hairline bg-paper p-5 text-sm text-muted">
        <h2 className="font-semibold text-ink">Privacy</h2>
        <p className="mt-2 leading-6">
          Read the{" "}
          <a
            className="text-forest underline underline-offset-4"
            href="/privacy"
          >
            Pace Privacy Policy
          </a>{" "}
          for details about account sync, photos, AI features, service
          providers, and your choices.
        </p>
      </section>
    </main>
  );
}
