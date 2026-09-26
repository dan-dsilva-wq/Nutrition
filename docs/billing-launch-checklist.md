# Billing Launch Checklist

Billing is wired but disabled by default. The beta/local trial path remains active
until `NEXT_PUBLIC_BILLING_ENABLED=true`.

How the pieces fit together:

- The native iOS and Android apps load the production Next.js site
  (`https://pace-nutrition.vercel.app`, see `capacitor.config.ts`), so every
  `NEXT_PUBLIC_*` billing value comes from the Vercel deployment, not from the
  Xcode or Gradle build. `NEXT_PUBLIC_*` values are inlined at build time, so
  change them in Vercel and then **redeploy**.
- Purchases go through RevenueCat (`src/lib/billing/revenuecat-client.ts`). The
  Supabase user id is the RevenueCat app user id.
- The app picks the offering's `monthly` package first, then `annual`, then
  `weekly`, then the first package.
- RevenueCat calls `/api/billing/webhook/revenuecat`, which writes
  `public.billing_events` and `public.billing_subscriptions`. The app reads
  `/api/billing/entitlement` from that table.
- While `NEXT_PUBLIC_BILLING_ENABLED` is not `true` on a deployment, its webhook
  replies `{ "billingEnabled": false }` and writes nothing, and its entitlement
  route returns `enabled: false`. Webhook and purchase tests only work against a
  deployment that has billing turned on (see "Sandbox deployment" below).

## RevenueCat project (shared)

1. Create the Pace RevenueCat project.
2. Create the `premium` entitlement, or set
   `NEXT_PUBLIC_REVENUECAT_ENTITLEMENT_ID` to the entitlement name you choose.
3. Create an offering and mark it as the current offering, or set
   `NEXT_PUBLIC_REVENUECAT_OFFERING_ID` to a specific offering identifier.

## Supabase setup (shared)

1. Apply `supabase/migrations/006_billing_entitlements.sql` (Supabase Dashboard >
   SQL Editor, paste and run, or `supabase db push`).
2. Confirm the tables exist: Table Editor shows `billing_subscriptions` and
   `billing_events`, both with RLS enabled.
3. Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in every Vercel environment that
   will have billing on (Production, and Preview for the sandbox deployment).
   Without it the webhook and entitlement routes return 503.

## Webhook setup (shared)

1. Generate a long random secret, for example `openssl rand -hex 32`, and
   prefix it with `Bearer ` (the full value is what RevenueCat sends).
2. In Vercel, set `REVENUECAT_WEBHOOK_AUTHORIZATION` to that exact full value.
   The route compares the whole `Authorization` header string.
3. In RevenueCat > Project settings > Integrations > Webhooks, add a webhook:
   - URL: `https://pace-nutrition.vercel.app/api/billing/webhook/revenuecat`
   - Authorization header value: the same exact value as step 2
   - Environment: both production and sandbox (App Review purchases are sandbox
     purchases made against the production app, so the production webhook must
     accept sandbox events)
4. Once billing is on for the deployment the webhook points at, send a RevenueCat
   test event and confirm a `TEST` row lands in `public.billing_events`. A `TEST`
   row has no `user_id` and never touches `billing_subscriptions`; that is expected.

## Google Play

1. Add the Google Play subscription product/base plan/offer in RevenueCat.
2. Attach it to the `premium` entitlement and to the current offering.
3. Copy the RevenueCat Google public SDK key (starts with `goog_`) into
   `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY`.

## iOS App Store

Do these after the one-time Apple setup in `IOS_RELEASE_CHECKLIST.md` (App ID
`com.danieldsilva.pace` registered and the app created in App Store Connect).

### 1. App Store Connect: agreements

1. App Store Connect > Business: accept the **Paid Apps Agreement** and complete
   bank account and tax forms. Until its status is Active, subscription products
   do not load, even in sandbox, and the purchase button will fail with
   "No RevenueCat subscription package is configured."

### 2. App Store Connect: subscription and free trial

1. Open the Pace app > Monetization > Subscriptions and create a subscription
   group, for example `Pace Premium`. Add a group display name localization.
2. In the group, create the subscription:
   - Reference name: `Pace Premium Monthly`
   - Product ID: `pace_premium_monthly` (cannot be changed or reused later)
   - Subscription duration: 1 month (the app prefers the monthly package)
3. Set the subscription price for your base country and let Apple fill the other
   storefronts.
4. Add an App Store localization (display name and description), for example
   "Pace Premium" / "Unlock every premium feature in Pace."
5. Add the review information: a screenshot of the Pace paywall sheet and a short
   review note.
6. Under Subscription Prices > Introductory Offers, create an introductory offer:
   - Type: Free
   - Duration: 1 week. The app copy promises "Your first 7 days are on us", so
     keep this at 1 week.
   - All countries/regions, no end date.
7. The product will show "Ready to Submit". The first subscription can only be
   approved together with an app version: on the app version page, under
   "In-App Purchases and Subscriptions", select `pace_premium_monthly` before
   submitting the version for review.

### 3. App Store Connect: keys for RevenueCat

1. Users and Access > Integrations > In-App Purchase: generate an In-App Purchase
   key, download the `.p8` file (only downloadable once), and note its Key ID and
   the Issuer ID shown on that page.
2. Optional but recommended: Users and Access > Integrations > App Store Connect
   API: generate a key with the App Manager role so RevenueCat can import
   products and prices.

### 4. RevenueCat: iOS app

1. In the Pace RevenueCat project, add an App Store app:
   - Bundle ID: `com.danieldsilva.pace`
   - Upload the In-App Purchase key `.p8`, Key ID and Issuer ID from step 3.1.
   - Upload the App Store Connect API key from step 3.2 if you made one.
2. In the RevenueCat iOS app settings, copy the **Apple Server Notification URL**.
   In App Store Connect > the Pace app > App Information > App Store Server
   Notifications, paste it for both Production and Sandbox (Version 2).
3. Products: add (or import) `pace_premium_monthly` for the App Store app.
4. Entitlements: attach `pace_premium_monthly` to `premium`.
5. Offerings: in the current offering, add a package of type **Monthly**
   (`$rc_monthly`) containing `pace_premium_monthly`. The app reads
   `offering.monthly`, so a custom package identifier will only be used if there
   is no monthly, annual or weekly package.
6. Copy the RevenueCat **Apple public SDK key** (starts with `appl_`) from
   Project settings > API keys.

### 5. Xcode: In-App Purchase capability

1. Open `ios/App/App.xcodeproj` (`npm run cap:open:ios`), select the `App`
   target > Signing & Capabilities, and add **In-App Purchase** if it is not
   listed. The RevenueCat plugin is already included through
   `ios/App/CapApp-SPM/Package.swift`; no other native change is needed.

### 6. Vercel environment for iOS

Set these in Vercel (Production for launch, Preview for the sandbox deployment
below) and redeploy:

```env
NEXT_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_REVENUECAT_ENTITLEMENT_ID=premium
NEXT_PUBLIC_REVENUECAT_OFFERING_ID=
REVENUECAT_WEBHOOK_AUTHORIZATION=Bearer <secret from Webhook setup>
SUPABASE_SERVICE_ROLE_KEY=<already set>
```

**Per-store keys:** RevenueCat keys are per store (`appl_` vs `goog_`) and both
native apps load the same site, so each platform reads its own variable
(`NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY`).
The older `NEXT_PUBLIC_REVENUECAT_PUBLIC_API_KEY` is used for any platform whose
own key is empty.

Optional paywall links: `NEXT_PUBLIC_TERMS_OF_USE_URL` (defaults to Apple's
standard EULA on iOS) and `NEXT_PUBLIC_PRIVACY_POLICY_URL` (defaults to
`https://pace-nutrition.vercel.app/privacypolicy.html`).

## Sandbox deployment

Billing must be on for a deployment before you can test purchases or the webhook,
but turning it on in Production switches every existing beta user from the local
trial to real billing. Test on a separate deployment first.

1. Create a git branch named `billing-sandbox` from `main` and push it. Vercel
   gives it a stable URL like
   `https://nutrition-git-billing-sandbox-daniels-projects-f6d294fb.vercel.app`
   (the exact URL is in the Vercel deployment for that branch).
2. In Vercel > Settings > Environment Variables, add Preview variables scoped to
   the `billing-sandbox` branch: everything in section 6 above plus
   `NEXT_PUBLIC_BILLING_ENABLED=true`. Redeploy the branch.
3. RevenueCat must be able to reach the preview webhook. Either turn off Vercel
   Deployment Protection for Preview, or add a Protection Bypass for Automation
   secret and append `?x-vercel-protection-bypass=<secret>` to the webhook URL.
4. Add a second RevenueCat webhook pointing at
   `https://<preview-url>/api/billing/webhook/revenuecat` with the same
   Authorization value, environment Sandbox only. Send a test event and confirm
   a `TEST` row in `public.billing_events`.
5. On the Mac, set `CAPACITOR_SERVER_URL=https://<preview-url>` in `.env.local`,
   run `npm run cap:sync:ios`, and install on a physical iPhone from Xcode. This
   build is for testing only; clear `CAPACITOR_SERVER_URL` and re-sync before any
   archive.

## iOS sandbox testing

1. App Store Connect > Users and Access > Sandbox > Test Accounts: create a
   sandbox Apple Account with an email you do not use for a real Apple Account.
2. On the iPhone: Settings > Developer > Sandbox Apple Account, sign in with the
   sandbox account (Developer Mode must be on). Do not sign out of your real
   Apple Account.
3. Open the sandbox build, sign in to Pace, open the paywall and tap
   **Start free trial**. The Apple sheet should say the first week is free and
   show your monthly price, marked [Sandbox].
4. Check in Supabase:
   - `billing_events` has an `INITIAL_PURCHASE` row with your user id.
   - `billing_subscriptions` has a row for your user id with `status = 'trial'`,
     `store = 'APP_STORE'`, `environment = 'SANDBOX'`,
     `product_id = 'pace_premium_monthly'` and a `trial_ends_at`.
   - RevenueCat > Customers shows the Supabase user id with `premium` active.
5. Premium features unlock in the app, including after force-quitting and
   reopening (the app reloads the entitlement from `/api/billing/entitlement`).
6. Sandbox time is accelerated: a 1-week trial lasts about 3 minutes and a
   1-month renewal about 5 minutes. Wait for the trial to convert and confirm a
   `RENEWAL` event and `status = 'active'`.
7. Cancel from Settings > Developer > Sandbox Apple Account > Manage, wait for
   expiry, and confirm `status = 'expired'` and the paywall returns.
8. Delete the app, reinstall, sign in, and tap **Restore purchases** on the
   paywall. It should restore the subscription (or say "No active subscription
   was found for this store account." if it has expired).
9. Repeat once through a TestFlight build pointed at Production after launch
   day's switch, since TestFlight purchases are also sandbox purchases.

## Before submitting the iOS app with billing

- The first subscription is selected on the app version (iOS step 2.7).
- Apple Guideline 3.1.2 requires the paywall to show the price, billing period,
  what happens after the free trial, and working links to the Terms of Use (EULA)
  and Privacy Policy. With billing on, the paywall sheet, locked cards and
  onboarding trial offer show these under the subscribe button. In the sandbox
  build, confirm the price line appears (e.g. "7-day free trial, then £4.99 per
  month.") and both links open. Also add the Terms of Use link to the App Store
  description (App Store Connect > the version > Description, or the EULA field
  in App Information).
- App Privacy answers include Purchases.
- The review notes explain the 1-week free trial and the demo account can reach
  the paywall.

## Launch switch

Only after the store product, sandbox purchase and webhook are confirmed:

1. In Vercel Production, confirm `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY` is the
   `appl_` key (and `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY` the `goog_` key if
   Android is launching too),
   `REVENUECAT_WEBHOOK_AUTHORIZATION` matches the production RevenueCat webhook,
   and `SUPABASE_SERVICE_ROLE_KEY` is set.
2. Set:

   ```env
   NEXT_PUBLIC_BILLING_ENABLED=true
   ```

3. Redeploy Production and wait for it to finish.
4. Send a RevenueCat test event to the production webhook and confirm a `TEST`
   row in `public.billing_events`.
5. Submit the iOS app version with `pace_premium_monthly` attached (or, if it is
   already approved, release it).

With billing enabled, the app ignores old local trial state and reads
entitlements from `/api/billing/entitlement`. Existing beta users lose their
local trial and see the paywall, and on the web (outside the native apps) the
purchase button shows "Live billing is not enabled for this build." because
purchases are native-only.

## First payment

The first real payment arrives when a production user's free week ends. In
RevenueCat > Overview it appears as a conversion, and the webhook writes a
`RENEWAL` event with `environment = 'PRODUCTION'` and moves that user's
`billing_subscriptions.status` from `trial` to `active`. Apple pays out monthly,
about 33 days after the end of the fiscal month, once the Paid Apps Agreement
and banking are active.
