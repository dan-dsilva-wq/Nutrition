"use client";

import { useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAppState } from "@/lib/state/app-state";
import { LEGAL_LINKS } from "@/lib/legal";
import { Button, Sheet } from "./primitives";

type AiFeature = "meal-photo" | "coach";

const featureCopy: Record<AiFeature, { title: string; sends: string }> = {
  "meal-photo": {
    title: "Estimate meals with AI?",
    sends: "the meal photo you take or choose",
  },
  coach: {
    title: "Chat with the AI coach?",
    sends:
      "your message, your age, height, weight, goal and activity level, and today's calorie and protein totals",
  },
};

/**
 * Apple (guideline 5.1.2) and UK/EU GDPR both require clear, explicit
 * permission before personal data goes to a third-party AI. Wrap every call
 * that sends data to /api/ai/* in `withConsent` and render `sheet`.
 */
export function useAiConsent(feature: AiFeature) {
  const { onboardingExtras, actions } = useAppState();
  const granted = Boolean(onboardingExtras.aiConsentAt);
  const [open, setOpen] = useState(false);
  const pending = useRef<{ run: () => void; onDecline?: () => void } | null>(null);

  function withConsent(run: () => void, onDecline?: () => void) {
    if (granted) {
      run();
      return;
    }
    pending.current = { run, onDecline };
    setOpen(true);
  }

  function accept() {
    actions.setOnboardingExtras({ aiConsentAt: new Date().toISOString() });
    setOpen(false);
    const next = pending.current;
    pending.current = null;
    next?.run();
  }

  function decline() {
    setOpen(false);
    const next = pending.current;
    pending.current = null;
    next?.onDecline?.();
  }

  const sheet = (
    <AiConsentSheet open={open} feature={feature} onAccept={accept} onDecline={decline} />
  );

  return { granted, withConsent, sheet };
}

function AiConsentSheet({
  open,
  feature,
  onAccept,
  onDecline,
}: {
  open: boolean;
  feature: AiFeature;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const copy = featureCopy[feature];
  return (
    <Sheet open={open} onClose={onDecline} title={copy.title}>
      <div className="space-y-4 pb-4 text-sm text-ink-2">
        <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-forest" aria-hidden />
          <p>
            To do this, Pace sends {copy.sends} to <strong>OpenAI</strong>, our AI provider. OpenAI
            processes it to write a response and does not use it to train its models.
          </p>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>AI can get things wrong. Check estimates before saving.</li>
          <li>It is general wellness information, not medical advice.</li>
          <li>You can turn this off any time in Settings.</li>
        </ul>
        <p className="text-xs text-muted">
          Read more in our{" "}
          <a className="underline underline-offset-4" href={`${LEGAL_LINKS.privacy}#ai`}>
            Privacy Policy
          </a>
          .
        </p>
        <div className="space-y-2">
          <Button size="lg" fullWidth onClick={onAccept}>
            Allow AI features
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={onDecline}>
            Not now
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
