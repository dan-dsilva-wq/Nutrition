"use client";

import { ArrowRight, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/state/app-state";
import type { HealthFlags } from "@/lib/state/types";
import { LEGAL_LINKS } from "@/lib/legal";
import { Button } from "../primitives";

const questions: Array<{ id: keyof HealthFlags; label: string }> = [
  { id: "pregnant", label: "I'm pregnant or breastfeeding" },
  { id: "eatingDisorder", label: "I have, or am recovering from, an eating disorder" },
  {
    id: "medical",
    label: "A doctor or dietitian manages my diet for a medical condition (for example diabetes on insulin or kidney disease)",
  },
];

export function HealthStep({ onNext }: { onNext: () => void }) {
  const { onboardingExtras, actions } = useAppState();
  const [flags, setFlags] = useState<HealthFlags>(
    onboardingExtras.healthFlags ?? { pregnant: false, eatingDisorder: false, medical: false },
  );
  const [agreed, setAgreed] = useState(Boolean(onboardingExtras.legalAcceptedAt));
  const anyFlag = flags.pregnant || flags.eatingDisorder || flags.medical;

  function submit() {
    if (!agreed) return;
    actions.setOnboardingExtras({
      healthFlags: flags,
      legalAcceptedAt: onboardingExtras.legalAcceptedAt ?? new Date().toISOString(),
    });
    onNext();
  }

  return (
    <div className="flex h-full flex-col">
      <div>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Quick health check
        </span>
        <h2 className="mt-2 font-display text-3xl leading-tight text-ink-2">
          Does any of this apply to you?
        </h2>
        <p className="mt-2 text-sm text-muted">
          It helps us keep your plan safe. Your answers stay on this device.
        </p>

        <div className="mt-6 space-y-2">
          {questions.map((q) => (
            <label
              key={q.id}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                flags[q.id]
                  ? "border-forest bg-white/85 text-ink-2 shadow-sm"
                  : "border-white/70 bg-white/55 text-ink-2"
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-forest)]"
                checked={flags[q.id]}
                onChange={(e) => setFlags({ ...flags, [q.id]: e.target.checked })}
              />
              <span>{q.label}</span>
            </label>
          ))}
          <p className="px-1 text-xs text-muted">None of these? Just leave them unticked.</p>
        </div>

        {anyFlag ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-clay/30 bg-white/70 px-4 py-3 text-sm text-ink-2">
            <HeartHandshake size={18} className="mt-0.5 shrink-0 text-clay" aria-hidden />
            <div className="space-y-2">
              <p>
                Thanks for telling us. Pace won&apos;t set a weight-loss or weight-gain target for you,
                but you can still log meals and build steady habits.
              </p>
              <p className="text-muted">
                Please check any diet changes with your GP, midwife or dietitian.
                {flags.eatingDisorder
                  ? " If food or weight feels hard right now, Beat (beateatingdisorders.org.uk) offers free, confidential support."
                  : null}
              </p>
            </div>
          </div>
        ) : null}

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-forest)]"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I&apos;m 18 or over, I agree to the{" "}
            <a className="underline underline-offset-4" href={LEGAL_LINKS.terms}>
              Terms of Use
            </a>{" "}
            and{" "}
            <a className="underline underline-offset-4" href={LEGAL_LINKS.privacy}>
              Privacy Policy
            </a>
            , and I consent to Pace using the health details I enter, like my weight and meals, to run
            the app.
          </span>
        </label>
        <p className="mt-3 text-xs text-muted">
          Pace gives general wellness information, not medical advice.
        </p>
      </div>
      <div className="mt-auto pt-8">
        <Button onClick={submit} size="lg" fullWidth disabled={!agreed}>
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
