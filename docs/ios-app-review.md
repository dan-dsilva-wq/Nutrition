# Pace iOS: App Review readiness

This covers the native features added so Pace reads as an iPhone app, not a
wrapped website (guideline 4.2), plus Sign in with Apple (4.8) and Apple token
revocation on account deletion (5.1.1(v)). Billing and the paywall are covered
in `docs/billing-launch-checklist.md`.

## What the iOS app now does natively

| Feature | Where | Notes |
|---|---|---|
| Apple Health (read steps and weight) | Settings and Integrations, "Connect Apple Health" | `@capgo/capacitor-health`. Steps only ever go up, so manual entries are kept. A weight recorded in Health today is logged once. Syncs on launch and on return to foreground. |
| Sign in with Apple | Sign-in screen, above Google | Native sheet via the in-app plugin `ios/App/App/AppleSignInPlugin.swift`, then Supabase `signInWithIdToken`. Web and Android use Supabase's Apple OAuth page. |
| Apple token revoke on delete | Settings, Delete account | Apple users re-confirm with Apple, and the server revokes the grant when the `APPLE_*` env vars are set. Deletion still runs if they cancel. |
| Offline screen | Any time the live site can't load | `capacitor-web/offline.html`, wired through `server.errorPath`. Retries automatically when the network returns. |
| No "coming soon" cards | Integrations | The roadmap cards only show on the web. On Android the Integrations menu item is hidden until there's something to connect. |
| Camera, photo picker, meal reminders, StoreKit | Already shipped | Unchanged. |

## Daniel's steps (need your Apple account or Mac)

1. **Apple Developer > Identifiers > com.danieldsilva.pace**: tick **HealthKit** and
   **Sign in with Apple**, then save. Xcode's automatic signing picks this up, but the
   App ID must allow both or the archive fails to sign.
2. **Apple Developer > Keys**: create a key with **Sign in with Apple** enabled for the
   Pace App ID. Download the `.p8` once (Apple won't show it again) and note the Key ID
   and your Team ID.
3. **Supabase > Authentication > Providers > Apple**: turn it on. In **Client IDs** put
   `com.danieldsilva.pace` (for the iPhone app). For Apple sign-in on the website too, also
   create a Services ID in Apple Developer, add it here, and fill in the secret key fields
   from step 2 as Supabase describes.
4. **Vercel > Pace > Settings > Environment Variables (Production)**: set `APPLE_TEAM_ID`,
   `APPLE_SIGN_IN_KEY_ID` and `APPLE_SIGN_IN_PRIVATE_KEY` (the `.p8` contents, newlines as
   `\n`). Redeploy.
5. **On the Mac**: `npm install`, `npm run cap:sync:ios`, `npm run cap:open:ios`. In Xcode,
   open Signing & Capabilities for the App target and check that HealthKit and Sign in with
   Apple both appear (they come from `App/App.entitlements`). Build to a real iPhone.
   Run `cap sync` on the Mac, not on Windows. Windows writes backslash paths into
   `CapApp-SPM/Package.swift`, and Xcode can't resolve them.
6. **Test on the iPhone** before archiving:
   - Sign in with Apple, sign out, and sign in again.
   - Settings > Connect Apple Health > allow. Today's steps match the Health app. Add a
     weight in Health, reopen Pace, and check it appears on Progress.
   - Turn on airplane mode, relaunch, and check the "You're offline" screen. Turn airplane
     mode off and check it reconnects without you tapping anything.
   - Delete a test Apple account from Settings. Afterwards, Settings > Apple Account >
     Sign in with Apple no longer lists Pace.
7. **App Store Connect > App Privacy**: add **Health & Fitness** (Health, Fitness) as data
   linked to the user, used for App Functionality. Not used for tracking.
8. Paste the review notes below into **App Review Information > Notes**, and add a demo
   account that signs in with email and password.

## App Review notes (paste into App Store Connect)

> Pace is a nutrition and weight-loss companion. Beyond its web content, the iPhone app uses:
>
> - **Camera and Photos**: the + button > Photo takes or picks a meal photo, and the AI estimates its nutrition.
> - **HealthKit (read only)**: menu > Settings (or Integrations) > Connect Apple Health reads today's steps and body weight to fill in the Today and Progress screens. Pace never writes to Health, and HealthKit data is not used for advertising.
> - **Local notifications**: menu > Reminders schedules meal-photo reminders.
> - **Sign in with Apple**: offered on the sign-in screen alongside email and Google.
> - **In-app purchase**: subscriptions go through StoreKit, and you can restore them from Settings.
> - **Account deletion**: menu > Settings > Delete account removes the account and its data, and for Sign in with Apple users it also revokes the Apple grant.
>
> Demo account: (email / password)
> The app needs a network connection for AI features. Without one it shows an offline screen and reconnects automatically.

## Worth doing next (not required to pass)

- iPad: the app target allows iPad (`TARGETED_DEVICE_FAMILY = 1,2`), so App Store Connect
  will ask for iPad screenshots and reviewers may test on one. If the layout isn't tuned
  for iPad, set the target to iPhone only in Xcode before the first upload.
- Write meals and water to Apple Health (dietary energy, protein, water).
- Native share sheet and haptics.
