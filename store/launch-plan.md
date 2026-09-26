# Pace launch plan

Goal: get Pace live on the UK and US App Store and to its first paying subscribers,
on a solo budget. Listing copy is in `app-store/listing.md`; the marketing page is
`/about` on the production site.

## Positioning

**One line:** Snap your plate, Pace does the maths, and a coach helps with what to
eat next.

**Who it's for:** adults who have tried calorie counting, found it tedious, and
want to lose weight steadily without weighing everything.

**Against the field:**
- *Cal AI* has photo logging but little beyond it. Pace adds a weekly food plan,
  a coach, and a longer (7-day) free trial, at the same annual price.
- *MyFitnessPal / Lose It* have huge databases but photo logging is a premium add-on
  and the apps feel busy. Pace is photo-first and calm.
- *Noom* coaches psychology at around £150+/year. Pace gives practical coaching for
  a fraction of that.

Tone: calm, practical, a bit British ("does the maths"), never shaming. Avoid
medical claims and "guaranteed" results.

## Before launch (checklist)

| # | Task | Owner | Notes |
|---|---|---|---|
| 1 | Merge the launch PRs (billing, native iOS, compliance, UX, this one) and deploy | Daniel | This PR only adds `/about`, `public/marketing/` and docs |
| 2 | Create App Store subscription group with `pace_premium_annual` and `pace_premium_monthly`, 7-day intro offer on both | Daniel | Prices in `listing.md` |
| 3 | Create the app record, paste listing copy, upload screenshots | Daniel | `store/app-store/screenshots/` |
| 4 | Decide iPhone-only vs iPad | Daniel | iPhone-only avoids thin-looking iPad UI; iPad screenshots are ready if kept |
| 5 | Demo account with a week of data for App Review | Daniel | Fill into review notes |
| 6 | TestFlight with 10 to 20 friends for a week | Daniel | Ask each for one screenshot of a bug or confusing moment |
| 7 | Set up [App Store Connect analytics](https://appstoreconnect.apple.com) and RevenueCat charts | Daniel | Track trial starts, trial-to-paid, 30-day retention |
| 8 | Once live, set `APP_STORE_URL` in `src/app/about/page.tsx` | Claude | One-line change |
| 9 | Ask for ratings with `SKStoreReviewController` after a win (e.g. 7-day streak or first 1 kg down) | Native thread | Never on first launch or after a paywall |

## Launch week

- **Day 0:** release manually (not automatic) on a Tuesday or Wednesday morning UK
  time, so you can watch for crashes and reviews.
- **Friends and family:** send the App Store link with a personal note and ask for
  an honest rating. Early ratings matter more than anything else for search rank.
- **Reddit (value first, no spam):** r/loseit, r/CICO, r/1200isplenty,
  r/SideProject, r/indiehackers. Post a genuine "I built this because..." story with
  one screenshot. Read each subreddit's self-promotion rules first; r/loseit only
  allows it in specific threads.
- **Product Hunt:** launch on a Tuesday. Use the OG image and screenshots 1, 3 and 4.
- **TikTok / Instagram Reels / YouTube Shorts:** the photo-to-calories moment is the
  hook. Three short formats to rotate:
  1. "I photographed everything I ate today" – day of meals, numbers pop up.
  2. "Asking my AI coach what to eat with 500 calories left" – screen recording.
  3. "What 1,600 calories looks like" – the weekly food plan, recipe by recipe.
  Post daily for the first 30 days; one format usually wins, then double down.

## After launch (first 90 days)

- **Apple Search Ads:** start with Search Results campaigns on "calorie counter",
  "ai calorie", "food tracker", "calorie counter photo" at £10 to £20/day, UK first.
  Turn off any keyword whose cost per trial is above about £3.
- **Paywall tests (via RevenueCat Experiments):** annual-first vs monthly-first,
  then trial on annual only.
- **Custom product pages:** one per content theme (photo logging, food plan, coach)
  so ads and TikTok bios land on the matching screenshots.
- **In-app events** on the App Store for moments like "New Year reset" (late
  December) and "Summer ready" (April); they show in search and Today tab.
- **Localise** the listing into German, French and Spanish once the English page
  converts; weight-loss apps sell well in DE.
- **Reply to every review** in App Store Connect, especially the bad ones.

## Numbers to watch

| Metric | Where | Good early target |
|---|---|---|
| Product page conversion (views → downloads) | App Store Connect | 30%+ |
| Onboarding completion | Tester events / Supabase | 60%+ |
| Download → trial start | RevenueCat | 10 to 15% |
| Trial → paid | RevenueCat | 35 to 50% |
| Day-30 retention | App Store Connect | 15%+ |

Targets are typical figures for subscription health apps from public RevenueCat
reports as I know them, not re-checked today; treat them as rough guides.
