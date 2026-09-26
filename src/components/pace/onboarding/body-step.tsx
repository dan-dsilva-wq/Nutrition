"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/state/app-state";
import { Button, Field, Input, Select } from "../primitives";
import type { ProfileDraft } from "@/lib/state/types";

export function BodyStep({ onNext }: { onNext: () => void }) {
  const { draft, onboardingExtras, actions } = useAppState();
  const [local, setLocal] = useState<ProfileDraft>(draft);

  const ageNumber = Number(local.age);
  const underAge = local.age.trim() !== "" && ageNumber > 0 && ageNumber < 18;
  const isValid =
    ageNumber >= 18 &&
    ageNumber <= 120 &&
    Number(local.heightCm) > 0 &&
    Number(local.currentWeightKg) > 0;

  function submit() {
    if (!isValid) return;
    actions.setDraft(local);
    onNext();
  }

  const name = onboardingExtras.name;

  return (
    <div className="flex h-full flex-col">
      <div>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Step 2 · About you
        </span>
        <h2 className="mt-2 font-display text-3xl leading-tight text-ink-2">
          {name
            ? `${name}, a few details about you.`
            : "A few details about you."}
        </h2>
        <p className="mt-2 text-sm text-muted">
          We use these to work out your calorie and protein targets.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Field label="Age">
            <Input
              inputMode="numeric"
              value={local.age}
              onChange={(e) => setLocal({ ...local, age: e.target.value })}
            />
          </Field>
          <Field label="Sex (for calories)">
            <Select
              value={local.sexForCalories}
              onChange={(e) =>
                setLocal({
                  ...local,
                  sexForCalories: e.target
                    .value as ProfileDraft["sexForCalories"],
                })
              }
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Select>
          </Field>
          <Field label="Height (cm)">
            <Input
              inputMode="numeric"
              value={local.heightCm}
              onChange={(e) => setLocal({ ...local, heightCm: e.target.value })}
            />
          </Field>
          <Field label="Current weight (kg)">
            <Input
              inputMode="decimal"
              value={local.currentWeightKg}
              onChange={(e) =>
                setLocal({ ...local, currentWeightKg: e.target.value })
              }
            />
          </Field>
        </div>
        {underAge ? (
          <p className="mt-4 rounded-2xl border border-clay/30 bg-white/65 px-3 py-2 text-sm text-clay" role="alert">
            Pace is for adults aged 18 and over, so we can&apos;t set up a plan for you. If you&apos;d
            like help with food and growing up healthy, a parent, school nurse or GP is a great place
            to start.
          </p>
        ) : null}
      </div>
      <div className="mt-auto pt-8">
        <Button onClick={submit} size="lg" fullWidth disabled={!isValid}>
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
