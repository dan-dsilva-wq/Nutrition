/**
 * Builds the App Store screenshots in store/app-store/screenshots/.
 *
 * 1. Captures real app screens from a demo-mode dev server, seeded with a
 *    realistic day and two months of weigh-ins, at each App Store slot size:
 *      iphone-6.9   440 x 956  @3x -> 1320 x 2868
 *      ipad-13     1032 x 1376 @2x -> 2064 x 2752
 * 2. Frames each capture with its caption from
 *    store/app-store/template/captions.json using template/frame.html.
 *
 * Run:
 *   NEXT_PUBLIC_PACE_DEMO_MODE=1 NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= \
 *     OPENAI_API_KEY= npx next dev -p 3100
 *   node scripts/store-screenshots.mjs
 *
 * FRAME_ONLY=1 re-frames the existing raw captures (for caption tweaks).
 * PLAYWRIGHT_CHROMIUM_PATH points at a preinstalled Chromium if needed.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BASE = process.env.PACE_BASE_URL ?? "http://localhost:3100";
const root = resolve("store/app-store");

const SIZES = [
  { name: "iphone-6.9", width: 440, height: 956, scale: 3, isMobile: true },
  { name: "ipad-13", width: 1032, height: 1376, scale: 2, isMobile: false },
];

function seededState() {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const at = (h, m) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  const series = [86.4, 86.1, 85.9, 85.2, 85.4, 84.8, 84.3, 84.4, 83.7, 83.2, 83.3, 82.6, 82.0];
  const weights = series.map((weightKg, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (series.length - 1 - i) * 5);
    const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date, isoDate: iso(d), weightKg };
  });
  return {
    hasOnboarded: true,
    dayKey: iso(today),
    waterMl: 1750,
    steps: 7420,
    weights,
    meals: [
      {
        id: "m1",
        name: "Apple cinnamon protein oats",
        loggedAt: at(8, 5),
        calories: 380, proteinG: 28, carbsG: 52, fatG: 8, fiberG: 7,
        imageUrl: "/recipes/apple-cinnamon-protein-oats.jpg",
        confidence: 0.86,
      },
      {
        id: "m2",
        name: "Chicken caesar salad",
        loggedAt: at(12, 40),
        calories: 460, proteinG: 42, carbsG: 18, fatG: 22, fiberG: 5,
        imageUrl: "/recipes/chicken-caesar-salad.jpg",
        confidence: 0.82,
      },
      {
        id: "m3",
        name: "Greek yogurt & berries",
        loggedAt: at(15, 30),
        calories: 190, proteinG: 18, carbsG: 22, fatG: 3, fiberG: 4,
      },
    ],
    chat: [
      {
        role: "assistant",
        content:
          "Hi, I'm here when you need a hand with meals, your day, or anything that's getting in the way.",
      },
      { role: "user", content: "I've got 545 kcal left and I'm starving. What should dinner be?" },
      {
        role: "assistant",
        content:
          "Go protein-first so it keeps you full: a chicken fajita bowl (about 480 kcal, 42g protein) with extra peppers and salsa instead of cheese. That lands you right on target and closes most of your protein gap.",
        actions: ["Log it", "Something vegetarian"],
      },
    ],
    subscription: { status: "active", provider: "local", plan: "monthly" },
    onboardingExtras: {
      dietaryPreferences: [],
      commitments: { steps: true, water: true, nutrition: true },
      hasSeenTour: true,
      hasSeenFoodIntro: true,
      hasSeenWeekIntro: true,
      weekGenerated: true,
      weekPlanSeed: 7,
    },
  };
}

async function capture(browser, size, rawDir) {
  const ctx = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    isMobile: size.isMobile,
    hasTouch: true,
    storageState: {
      cookies: [],
      origins: [
        {
          origin: BASE,
          localStorage: [{ name: "pace.state.v2:demo", value: JSON.stringify(seededState()) }],
        },
      ],
    },
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/today?demo=1`);
  await page.getByRole("heading", { name: "Today", exact: true }).waitFor({ timeout: 60_000 });
  await page.waitForTimeout(1500);

  const nav = (href, viaMenu = false) => async () => {
    if (viaMenu) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(600);
    }
    await page.locator(`a[href="${href}"]`).first().click();
  };
  const screens = [
    ["today", async () => {}],
    ["log", nav("/log")],
    ["progress", nav("/progress")],
    ["foods", nav("/you/foods")],
    ["coach", nav("/you/coach")],
    ["plan", nav("/you/plan", true)],
  ];

  for (const [name, go] of screens) {
    try {
      await go();
    } catch (err) {
      console.warn(`[${size.name}] could not reach ${name}:`, err.message.split("\n")[0]);
      continue;
    }
    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.waitForTimeout(2500);
    // Hide the Next.js dev indicator.
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.screenshot({ path: join(rawDir, `${name}.png`) });
    console.log(`[${size.name}] captured ${name}`);
  }
  await ctx.close();
}

async function frame(browser, size, rawDir, outDir) {
  const captions = JSON.parse(readFileSync(join(root, "template", "captions.json"), "utf8"));
  const width = size.width * size.scale;
  const height = size.height * size.scale;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const frameUrl = pathToFileURL(join(root, "template", "frame.html")).href;
  for (const c of captions) {
    const params = new URLSearchParams({
      device: size.isMobile ? "phone" : "tablet",
      eyebrow: c.eyebrow,
      title: c.title,
      shot: pathToFileURL(join(rawDir, `${c.shot}.png`)).href,
    });
    await page.goto(`${frameUrl}?${params}`);
    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    // JPEG keeps the repo small; App Store Connect accepts it (no alpha).
    await page.screenshot({ path: join(outDir, `${c.file}.jpg`), type: "jpeg", quality: 92 });
    console.log(`[${size.name}] framed ${c.file}`);
  }
  await page.close();
}

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
);
for (const size of SIZES) {
  const rawDir = join(root, "raw", size.name);
  const outDir = join(root, "screenshots", size.name);
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });
  if (!process.env.FRAME_ONLY) await capture(browser, size, rawDir);
  await frame(browser, size, rawDir, outDir);
}
await browser.close();
