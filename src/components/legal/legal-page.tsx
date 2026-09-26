import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL, LEGAL_LINKS } from "@/lib/legal";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 text-ink-2">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          {eyebrow}
        </p>
        <h1 className="font-display text-[36px] leading-[1.05]">{title}</h1>
        <p className="text-sm text-muted">Last updated {updated}</p>
      </header>
      <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed">
        {children}
      </div>
      <footer className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline pt-6 text-sm text-muted">
        <Link className="underline underline-offset-4" href={LEGAL_LINKS.privacy}>
          Privacy Policy
        </Link>
        <Link className="underline underline-offset-4" href={LEGAL_LINKS.terms}>
          Terms of Use
        </Link>
        <Link className="underline underline-offset-4" href={LEGAL_LINKS.deleteAccount}>
          Delete your account
        </Link>
        <a className="underline underline-offset-4" href={`mailto:${LEGAL.contactEmail}`}>
          {LEGAL.contactEmail}
        </a>
      </footer>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;
}
