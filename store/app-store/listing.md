# Pace: App Store listing (v1.0)

Ready to paste into App Store Connect. Character counts are checked against Apple's
limits. Primary locale is **English (UK)**; the same copy works for English (US)
with the spelling swaps listed at the end.

## App information

| Field | Value | Limit |
|---|---|---|
| **Name** | `Pace: AI Calorie Counter` | 24 / 30 |
| **Subtitle** | `Photo Food Log & Weight Loss` | 28 / 30 |
| **Primary category** | Health & Fitness | |
| **Secondary category** | Food & Drink | |
| **Bundle ID** | `com.danieldsilva.pace` | |
| **SKU** | `pace-ios-001` | |
| **Content rights** | Does not contain third-party content that needs rights (recipe photos are owned or licensed; see `scripts/fetch-recipe-images.mjs`) | |
| **Copyright** | `2026 Daniel D'Silva` | |

Why this name: "Pace" alone is likely taken and says nothing in search. App Store
search weights the name most, and "AI calorie counter" is the exact phrase people
type for Cal AI style apps. The subtitle adds "photo", "food log" and "weight loss"
without repeating any name word, so all of them are indexed.

If `Pace: AI Calorie Counter` is rejected as taken, fall back in this order:
`Pace – Calorie Counter & Coach` (29), `Pace: Snap & Track Calories` (27).

## Keywords (100 / 100)

```
macro,protein,diet,nutrition,meal,planner,tracker,diary,barcode,scan,kcal,coach,recipes,lose,healthy
```

Rules followed: no spaces, no words already in the name or subtitle (Apple indexes
those anyway), singular forms where Apple matches plurals, and no competitor brand
names (a 2.3.7 rejection risk).

## Promotional text (161 / 170)

Can be changed any time without a new build. Use it for launch news and offers.

```
New: snap a photo of any meal and Pace estimates the calories and protein in seconds. Then your AI coach helps you plan what to eat next. Try it free for 7 days.
```

## Description (2,854 / 4,000)

```
Losing weight shouldn't mean weighing every grape. Snap a photo of your plate and Pace estimates the calories, protein, carbs and fat in seconds. You check it, tap save, and get on with your day.

Pace is a calm, adult weight-loss companion built around three things that actually work: knowing what you eat, eating enough protein, and staying consistent. No streak guilt, no red numbers, no 40-minute logging sessions.

SNAP YOUR PLATE
• Take a photo or pick one from your library, and Pace's AI works out what's on the plate and roughly how much
• Every estimate is editable, so you stay in control
• No photo? Type "flat white and a croissant" or scan a barcode instead

YOUR DAY AT A GLANCE
• One ring for calories, four for protein, carbs, fat and fibre
• Water and steps sit right beside your food
• Steps and weigh-ins sync automatically from Apple Health
• See exactly how much you have left, and whether you're on track for a steady day

A FOOD PLAN BUILT AROUND YOU
• A week of breakfasts, lunches and dinners that fit your calorie and protein targets
• Vegetarian, vegan and pescatarian options
• Step-by-step recipes, easy swaps, and a shopping list sorted by aisle

AN AI COACH IN YOUR POCKET
• Ask anything: "I've got 500 calories left, what should dinner be?"
• Practical, specific answers based on your targets and today's log
• Help getting back on track after a big weekend, without the lecture

PROGRESS THAT MAKES SENSE
• Weigh-ins shown as a trend line, so one salty dinner doesn't ruin your week
• Progress photos side by side
• Weekly pace compared with your target

TARGETS THAT FIT YOU
• Calorie, protein, carb, fat, fibre, water and step targets from your height, weight, age, activity and goal
• Choose how fast you want to go, with sensible floors so you never under-eat
• Change your goal or pace any time and Pace recalculates

GENTLE REMINDERS
• A nudge at mealtimes so a quick photo is all the logging you do

PACE PREMIUM
Pace is free to download, with 3 photo estimates a day and 5 coach messages a week. Premium unlocks unlimited photo logging and coaching, your weekly food plan, full progress history and custom reminders. Start with a 7-day free trial.

Payment is charged to your Apple Account at confirmation of purchase, after any free trial ends. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel any time in your App Store account settings.

Terms of Use: https://pace-nutrition.vercel.app/terms
Privacy Policy: https://pace-nutrition.vercel.app/privacy

Pace is for adults (18+) and offers general wellness information. It is not medical advice and is not intended for people who are pregnant, have or are recovering from an eating disorder, or need a clinical nutrition plan. AI estimates are approximate; check them before saving.
```

Two lines in the description depend on other launch work: the Apple Health bullet
(native iOS draft PR) and the free-tier limits (3 photos a day, 5 coach messages a
week, from the AI-limits draft PR). Remove either line if that PR doesn't ship in 1.0.

The Terms and Privacy pages come from the compliance work (draft PR #4); they must be
live on production before submission. Also paste the Terms URL into App Store Connect's
"License Agreement" field (or choose Apple's standard EULA and change the line above to
`https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`). App Privacy label
answers are in `docs/app-store-privacy.md` from the same PR.

## What's New (v1.0)

```
Welcome to Pace. Snap your meals, hit your protein, and let your AI coach help with the rest.
```

## URLs

| Field | Value |
|---|---|
| Marketing URL | `https://pace-nutrition.vercel.app/about` (landing page in this PR) |
| Support URL | Use the compliance thread's support page once live; until then `https://pace-nutrition.vercel.app/about#support` |
| Privacy Policy URL | `https://pace-nutrition.vercel.app/privacy` |

## Age rating questionnaire

Apple's 2025 questionnaire (ratings 4+, 9+, 13+, 16+, 18+). Suggested answers,
inferred from what the app does today. Re-check the wording in App Store Connect,
since Apple revises it.

| Question | Answer | Why |
|---|---|---|
| Violence, sexual content, nudity, profanity, horror, drugs, alcohol, tobacco, gambling, contests | None | Not in the app |
| Medical or treatment information | Infrequent/Mild | Nutrition targets and weight-loss guidance are wellness, but safer to declare than be flagged |
| Health or wellness topics | Yes | Calorie targets, weight loss |
| Unrestricted web access | No | WebView only loads Pace's own domain (`allowNavigation`) |
| User-generated content shared with others | No | Logs, photos and coach chats are private to the user |
| Messaging and chat between users | No | The AI coach is not person-to-person |
| Advertising | No | |
| Parental controls / age assurance | No | |
| **Override to a higher rating** | **18+** | Pace is built for adults, onboarding blocks under-18s (`body-step.tsx` requires age ≥ 18), and a weight-loss app rated 13+ invites a review question about minors |

## Pricing recommendation

What competitors charge (US storefront, September 2026):

| App | Monthly | Annual | Trial | Photo logging |
|---|---|---|---|---|
| Cal AI | $9.99 | $29.99 | 3 days | Premium only |
| MyFitnessPal Premium | – | $79.99 | Yes | Premium (Meal Scan) |
| Lose It! Premium | – | $39.99 | Yes | Premium (Snap It) |
| MacroFactor | – | $71.99 | Yes | Yes |
| Cronometer Gold | – | $59.88 | Yes | Limited |
| Noom | – | ~$209 | Yes | No |

Sources: [eesel.ai on Cal AI pricing](https://www.eesel.ai/blog/cal-ai-pricing),
[kcalm comparison](https://kcalm.app/blog/best-calorie-tracking-apps-comparison/).

**Recommendation: two plans, one entitlement (`premium`), annual shown first.**

| Plan | UK | US | EU | Trial |
|---|---|---|---|---|
| **Annual** (default, "Save 50%") | **£29.99** | $34.99 | €34.99 | 7 days free |
| Monthly | **£4.99** | $5.99 | €5.99 | 7 days free |

Why:
- £4.99/month is under Cal AI's $9.99 and matches the planned price, so it stays.
- The annual plan is where the money is in this category: most calorie apps sell
  annual first, and annual subscribers churn far less than monthly ones. £29.99 is
  half of 12 × £4.99, at Cal AI's annual price, and under Lose It and MFP.
- Keep the 7-day trial Pace already promises (longer than Cal AI's 3 days, which is
  a selling point) on both plans at launch. After a month of data, test trial on
  annual only.
- Put both products in one App Store subscription group so users can switch without
  double-paying.
- Product IDs to create: `pace_premium_annual`, `pace_premium_monthly`.

The billing thread owns the paywall and RevenueCat offering; this is input for it.

## Screenshot plan

Six captioned screenshots per device, in upload order. Files are in
`store/app-store/screenshots/`, regenerated by `node scripts/store-screenshots.mjs`
(captions in `template/captions.json`).

| # | Screen | Caption |
|---|---|---|
| 1 | Log (photo) | PHOTO FOOD LOGGING · Snap your plate. *Pace does the maths.* |
| 2 | Today | YOUR DAY AT A GLANCE · Calories, protein, *all in one ring.* |
| 3 | Food plan | YOUR FOOD PLAN · A week of meals *built around you.* |
| 4 | Coach | AI COACH · Stuck? *Just ask.* Real answers, fast. |
| 5 | Progress | PROGRESS · Watch the trend, *not the scale.* |
| 6 | Targets | PERSONAL TARGETS · Targets that fit *your body and pace.* |

| Slot | Size | Folder | Needed? |
|---|---|---|---|
| iPhone 6.9" | 1320 × 2868 | `screenshots/iphone-6.9/` | Required. Apple scales it down for smaller iPhones |
| iPad 13" | 2064 × 2752 | `screenshots/ipad-13/` | Required while the Xcode target includes iPad (`TARGETED_DEVICE_FAMILY = "1,2"`) |

Note on iPad: Pace's layout is phone-width, so on iPad it sits in a centred column.
That passes review but looks thin. The simplest path is shipping iPhone-only
(`TARGETED_DEVICE_FAMILY = 1`); iPhone apps still run on iPad in compatibility mode
and then no iPad screenshots are needed. That change belongs to the native iOS thread.

App preview video (optional, later): 15 to 30 seconds, 886 × 1920 portrait for the
6.9" slot. Storyboard: photo taken, estimate appears,
ring fills, coach answer, trend line.

## App Review notes (draft)

```
Pace is an adult weight-loss and nutrition tracker.

Demo account: [email] / [password]  (pre-loaded with a week of meals and weigh-ins)

Native features to try:
• Camera and photo library: Log tab > Photo > Open camera. The photo is sent to our server for an AI nutrition estimate, which the user reviews before saving.
• Local notifications: You > Reminders > turn on meal photo reminders, then "Send a test".
• In-app purchase: the 7-day free trial and subscriptions use StoreKit via RevenueCat. Restore Purchases is on the paywall.
• Account deletion: You > Settings > Delete account.

AI output is labelled as an estimate and can be edited. The coach gives general wellness information, not medical advice, and the app is restricted to users 18+.
```

Merge with whatever the native iOS thread adds (HealthKit, Sign in with Apple,
offline page) before submitting.

## English (US) localisation

Same copy with these swaps: "maths" → "math", "fibre" → "fiber", "flat white and a
croissant" → "a latte and a bagel", "Apple Account" stays. Prices from the table above.
