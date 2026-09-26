import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  LineChart,
  Salad,
  ShieldCheck,
} from "lucide-react";

/**
 * Public marketing page, used as the App Store "Marketing URL" and for launch
 * links. Lives outside the (app) group so it skips AuthGate and the app shell.
 *
 * Set APP_STORE_URL once the listing is live; until then the CTA reads
 * "Coming soon to the App Store".
 */
const APP_STORE_URL: string | null = null;
const SUPPORT_EMAIL = "vxvo.admin@gmail.com";

export const metadata: Metadata = {
  title: "Pace: AI calorie counter & photo food log",
  description:
    "Snap a photo of your meal and Pace estimates the calories and protein in seconds. A calm weight-loss app with a weekly food plan and an AI coach.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Pace: snap your plate, Pace does the maths",
    description:
      "AI photo food logging, a food plan built around you, and a coach in your pocket. Try it free for 7 days.",
    url: "/about",
    siteName: "Pace",
    type: "website",
    images: [{ url: "/marketing/og.png", width: 1200, height: 630, alt: "Pace app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pace: snap your plate, Pace does the maths",
    description: "AI photo food logging, a weekly food plan and a coach. Free for 7 days.",
    images: ["/marketing/og.png"],
  },
};

const features = [
  {
    icon: Camera,
    eyebrow: "Photo food logging",
    title: "Snap your plate.",
    accent: "Pace does the maths.",
    body: "Take a photo and Pace estimates the calories, protein, carbs and fat in seconds. Check it, tweak it if you like, and save. No photo? Type it or scan a barcode.",
    shot: "/marketing/log.webp",
    alt: "Pace log screen with a photo button and today's meals",
  },
  {
    icon: Salad,
    eyebrow: "Your food plan",
    title: "A week of meals",
    accent: "built around you.",
    body: "Breakfasts, lunches and dinners that fit your targets, with step-by-step recipes, easy swaps and a shopping list sorted by aisle. Vegetarian and vegan too.",
    shot: "/marketing/foods.webp",
    alt: "Pace weekly food plan with recipe photos",
  },
  {
    icon: Bot,
    eyebrow: "AI coach",
    title: "Stuck?",
    accent: "Just ask.",
    body: "\"I've got 500 calories left, what should dinner be?\" Get a specific, practical answer based on your targets and today's log, without the lecture.",
    shot: "/marketing/coach.webp",
    alt: "Pace coach suggesting a high-protein dinner",
  },
  {
    icon: LineChart,
    eyebrow: "Progress",
    title: "Watch the trend,",
    accent: "not the scale.",
    body: "Weigh-ins become a smooth trend line, so one salty dinner doesn't ruin your week. Add progress photos and compare side by side.",
    shot: "/marketing/progress.webp",
    alt: "Pace progress chart trending down over two months",
  },
];

const faqs = [
  {
    q: "How accurate are the photo estimates?",
    a: "They're a good starting point, typically close enough to keep you honest without weighing food. Every estimate is editable, and Pace always asks you to check before saving.",
  },
  {
    q: "What does it cost?",
    a: "Pace is free to download with a few photo estimates and coach messages each week. Premium unlocks unlimited photo logging, your weekly food plan, the coach and full progress history, with a 7-day free trial. Cancel any time in your App Store settings.",
  },
  {
    q: "Who is Pace for?",
    a: "Adults (18+) who want to lose weight steadily. Pace gives general wellness guidance, not medical advice, and isn't designed for pregnancy, eating disorder recovery or clinical nutrition plans.",
  },
  {
    q: "What happens to my data?",
    a: "Your logs and photos are private to your account. You can delete your account and data from Settings at any time.",
  },
];

function StoreButton({ className = "" }: { className?: string }) {
  if (APP_STORE_URL) {
    return (
      <a
        href={APP_STORE_URL}
        className={`inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-elevated)] transition hover:bg-black ${className}`}
      >
        Download on the App Store <ArrowRight size={16} aria-hidden />
      </a>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white ${className}`}
    >
      Coming soon to the App Store
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/about" className="font-display text-2xl text-ink">
          Pace<span className="text-forest">.</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <a href="#features" className="hidden hover:text-ink sm:inline">
            Features
          </a>
          <a href="#faq" className="hidden hover:text-ink sm:inline">
            FAQ
          </a>
          <Link
            href="/today"
            className="rounded-full border border-stone-2 bg-white/70 px-4 py-2 font-medium text-ink backdrop-blur hover:bg-white"
          >
            Open web app
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            AI calorie counter
          </p>
          <h1 className="font-display mt-4 text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            Snap your plate.
            <br />
            <em className="text-forest">Lose weight calmly.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Take a photo of any meal and Pace estimates the calories and protein in
            seconds. Then a food plan and an AI coach help you decide what to eat
            next. No weighing every grape.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreButton />
            <span className="text-sm text-muted">7-day free trial · Cancel any time</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[320px]">
          <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.18),transparent_65%)]" />
          <PhoneShot src="/marketing/today.webp" alt="Pace today screen" priority />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl space-y-24 px-5 py-12 sm:px-8">
        {features.map((f, i) => (
          <div
            key={f.eyebrow}
            className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="mx-auto w-full max-w-[280px]">
              <PhoneShot src={f.shot} alt={f.alt} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                <f.icon size={16} aria-hidden /> {f.eyebrow}
              </div>
              <h2 className="font-display mt-3 text-4xl leading-tight text-ink sm:text-5xl">
                {f.title} <em className="text-forest">{f.accent}</em>
              </h2>
              <p className="mt-4 max-w-md text-base text-muted">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-[var(--radius-xl)] border border-white/70 bg-white/60 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-12">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["Tell Pace about you", "Height, weight, goal and how fast you want to go. Pace sets calorie, protein, water and step targets."],
              ["Snap what you eat", "Photo, text or barcode. Each meal takes seconds, and you check every estimate."],
              ["Follow the trend", "Your food plan and coach keep you on track, and the trend line shows it working."],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cream font-semibold text-forest">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Questions</h2>
        <div className="mt-6 divide-y divide-hairline rounded-[var(--radius-lg)] border border-white/70 bg-white/60 backdrop-blur-xl">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-ink marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="support" className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-8">
        <ShieldCheck className="mx-auto text-forest" size={28} aria-hidden />
        <h2 className="font-display mt-3 text-3xl text-ink">Need help?</h2>
        <p className="mt-3 text-muted">
          Email{" "}
          <a className="font-medium text-forest underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&apos;ll get back to you within two working days. You can delete your
          account at any time from Settings, or{" "}
          <Link className="font-medium text-forest underline" href="/account/delete">
            here
          </Link>
          .
        </p>
        <div className="mt-8">
          <StoreButton />
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-muted sm:px-8">
        <span>© 2026 Pace</span>
        <nav className="flex gap-5">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-ink">
            Contact
          </a>
        </nav>
      </footer>
    </main>
  );
}

function PhoneShot({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="rounded-[44px] bg-ink p-2.5 shadow-[0_40px_90px_rgba(15,23,20,0.18)]">
      <Image
        src={src}
        alt={alt}
        width={660}
        height={1434}
        preload={priority}
        className="h-auto w-full rounded-[36px]"
      />
    </div>
  );
}
