# Pace: App Store privacy, legal and health compliance

Last reviewed 26 September 2026. Keep this file, `ios/App/App/PrivacyInfo.xcprivacy`,
`src/lib/legal.ts` and the `/privacy` page in sync whenever data handling changes.

## URLs for App Store Connect

| Field | Value |
|---|---|
| Privacy Policy URL | `https://pace-nutrition.vercel.app/privacy` |
| Terms of Use (EULA) | `https://pace-nutrition.vercel.app/terms` (also add it to the app description, required for auto-renewing subscriptions) |
| Account deletion (web) | `https://pace-nutrition.vercel.app/account/delete` |
| Old policy URL | `/privacypolicy.html` now redirects permanently to `/privacy`, so Google Play and Health Connect links keep working |

In App Store Connect > App Information > License Agreement, either keep Apple's
standard EULA (our Terms section 10 is written to sit alongside it) or paste the
Terms. Keeping the standard EULA is simplest.

## App Privacy ("nutrition label") answers

**Do you or your third-party partners collect data from this app?** Yes.
**Is any data used to track users?** No, for every type below.
All types below are **linked to the user's identity** (they sit on the Supabase account).

| App Store category > type | Collected? | Purposes to tick |
|---|---|---|
| Contact Info > Email Address | Yes | App Functionality |
| Contact Info > Name | Yes (optional first name) | App Functionality, Product Personalization |
| Health & Fitness > Health | Yes (weight, body details, food and nutrition logs) | App Functionality, Product Personalization |
| Health & Fitness > Fitness | Yes (steps, workouts, activity level) | App Functionality, Product Personalization |
| User Content > Photos or Videos | Yes (meal photos) | App Functionality |
| User Content > Other User Content | Yes (coach messages, check-in notes) | App Functionality |
| Identifiers > User ID | Yes (Supabase user ID, RevenueCat app user ID) | App Functionality |
| Purchases > Purchase History | Yes (subscription status via RevenueCat) | App Functionality |
| Usage Data > Product Interaction | Yes (`tester_events`: app open, meal logged, etc.) | Analytics |
| Other Data > Other Data Types | Yes (age, sex for calorie formula, diet preferences) | App Functionality, Product Personalization |
| Location, Contacts, Browsing/Search History, Sensitive Info, Financial Info, Diagnostics, Advertising Data | No | |

Notes behind the answers:
- Progress photos, coach chat history, water, steps and reminders are stored on
  the device only today, but meal photos and coach messages are sent to our
  servers and OpenAI, so they count as collected.
- Health check answers (pregnant, eating disorder, clinician-managed diet) never
  leave the device, so they are not "collected".
- If the HealthKit thread ships Apple Health reading, steps and weight are
  already covered by Health & Fitness above. HealthKit data must never be used
  for advertising (Guideline 5.1.3); the policy says so.
- If crash reporting or any analytics SDK is added later, add Diagnostics and
  update the privacy manifest.

## What the app now does for compliance

| Requirement | Where it is handled |
|---|---|
| Account deletion in-app (5.1.1(v)) | Settings > Delete account, plus `/account/delete` on the web (already existed) |
| Privacy policy link in app (5.1.1(i)) | Settings > Health & privacy, sign-in screen footer, onboarding health check |
| Consent before sharing personal data with third-party AI (5.1.2(i)) | `useAiConsent` sheet before the first meal photo or coach message; can be turned off in Settings |
| AI output disclosure | "AI estimate" label on photo estimates; "Replies are written by AI" line on the coach |
| Health/medical claims (1.4.1, 5.1.3) | Terms section 1, onboarding line, Settings card, sign-in footer |
| Adults only | Age 18+ required in onboarding with a clear message; 18+ confirmation on the health check; plan editor blocks under-18 |
| Unsafe goals | No goal weight below BMI 18.5; no weight-loss option when already at that floor; calorie floors (1200/1500) already existed |
| Special-category health data (UK/EU GDPR Art. 9) | Explicit consent checkbox on the onboarding health check |
| Pregnancy, eating disorders, clinician-managed diets | Onboarding health check turns off weight-loss and weight-gain goals and signposts GP/Beat |
| Data minimisation at OpenAI | `store: false` on every OpenAI Responses call |
| iOS privacy manifest | `ios/App/App/PrivacyInfo.xcprivacy`, added to the App target's resources |
| Subscription terms (3.1.2) | Terms section 4. The paywall itself still needs visible Terms and Privacy links, price, period and Restore (billing work) |

## App Review notes (compliance paragraph to paste)

> Pace is for adults 18+. It is a food diary and general wellness tool, not a
> medical device. Before any meal photo or coach message is sent to our AI
> provider (OpenAI), the app asks for permission and explains what is sent; this
> can be turned off in Settings > AI features. Users can delete their account
> and all data in Settings > Delete account. Privacy Policy and Terms are linked
> from sign-in, onboarding and Settings.

## Needs Daniel's decision or a lawyer

1. **Who is the operator?** `src/lib/legal.ts` names "Daniel D'Silva" as the
   controller with `vxvo.admin@gmail.com`. Confirm the legal name, whether you
   trade as a sole trader or a company (then use the company name and number),
   and consider a dedicated support address on your own domain.
2. **UK ICO data protection fee.** Anyone processing personal data for a
   business in the UK normally has to register and pay the fee (about £52 a year
   for the smallest tier). Health data makes this more likely to be checked.
3. **Governing law** is set to England and Wales. Change it if you are based
   elsewhere.
4. **Data Processing Agreements.** Accept the standard DPAs for Supabase,
   Vercel, OpenAI and RevenueCat in their dashboards (they are click-through).
   Consider OpenAI zero data retention if you want the 30-day abuse log removed.
5. **Supabase region.** If the project is in a US region, the transfer wording
   in the policy covers it; an EU/UK region would be simpler for GDPR.
6. **US consumer health data laws** (Washington My Health My Data Act, Nevada,
   Connecticut). The policy has a short section, but if you market in the US a
   lawyer should check whether a separate consumer health data policy is needed.
7. **Data Protection Impact Assessment.** Large-scale health data plus AI is the
   kind of processing the ICO expects a DPIA for. A short written one is enough
   at this size.
8. **Lawyer review of the Terms**, especially the liability cap and the
   subscription wording, before heavy marketing spend.
