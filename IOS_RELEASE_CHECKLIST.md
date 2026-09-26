# Pace iOS release checklist

The native project is ready at `ios/App/App.xcodeproj`. The app bundle ID is
`com.danieldsilva.pace`, the display name is `Pace`, and the first release is
version `1.0` build `1`.

## What is already configured

- Capacitor iOS shell targeting iOS 15+
- Production site: `https://pace-nutrition.vercel.app`
- Pace app icon and launch screen
- Native camera and photo-library permission text
- Native meal reminder notifications
- Google/Supabase OAuth callback: `com.danieldsilva.pace://auth/callback`
- RevenueCat native purchase and restore-purchase plugin
- Automatic Xcode signing
- Export-compliance declaration for standard/exempt HTTPS encryption

## One-time account setup

1. On a Mac, install Xcode 26 or newer and sign in to Xcode with the Apple
   Account that belongs to your paid developer team.
2. In Apple Developer, register the explicit App ID `com.danieldsilva.pace` if
   Xcode has not already created it.
3. In App Store Connect, create a new iOS app using that bundle ID. The App Store
   listing name can be different if `Pace` is unavailable; do not change the
   bundle ID after the first upload.
4. In Supabase Dashboard > Authentication > URL Configuration, add
   `com.danieldsilva.pace://auth/callback` to the allowed redirect URLs.
5. If subscriptions are being enabled, create the App Store subscription product,
   connect the Apple app to RevenueCat, add the product to the `premium`
   entitlement/current offering, and set the public iOS RevenueCat SDK key in the
   Vercel production environment. Keep `NEXT_PUBLIC_BILLING_ENABLED=false` until
   the product and webhook have been tested in sandbox.

## Install directly on your own iPhone

Run these commands on the Mac:

```bash
npm install
npm run cap:sync:ios
npm run cap:open:ios
```

Then in Xcode:

1. Select the `App` project and `App` target.
2. Open Signing & Capabilities, leave “Automatically manage signing” enabled,
   and select your developer team.
3. Connect and unlock the iPhone, select it as the run destination, and press
   Run. Trust Developer Mode on the phone if iOS asks.

This creates a signed development install. It is tied to the developer account
and is not the build to send to customers.

## Make it downloadable with TestFlight

1. In Xcode, choose “Any iOS Device (arm64)” as the run destination.
2. Choose Product > Archive.
3. In Organizer, choose Distribute App > App Store Connect > Upload and keep
   automatic signing enabled.
4. Wait for Apple to process build `1`, then open the TestFlight tab in App Store
   Connect.
5. Add yourself as an internal tester. Install Apple's TestFlight app on the
   iPhone and accept the invite.

Internal testers can install without beta review. External testers need TestFlight
test information and may require Apple's beta review.

## Before public App Store review

- Test account creation, Google sign-in, sign-out, and in-app account deletion.
- Test camera, photo-library selection, meal analysis, barcode scanning, and
  reminders on a physical iPhone.
- Test purchase and restore purchase with an Apple sandbox tester if billing is on.
- Add the Privacy Policy URL `https://pace-nutrition.vercel.app/privacy`, the
  Terms URL `https://pace-nutrition.vercel.app/terms`, and a support URL.
- Complete App Privacy answers using `docs/app-store-privacy.md`, which also
  lists the open legal decisions and the compliance paragraph for review notes.
- Provide App Review with a working demo account and clear notes explaining the
  camera, AI meal estimate, account deletion, and subscription flow.
- Upload current iPhone screenshots and complete age rating, category, copyright,
  pricing, and regional availability.
- Increase `CURRENT_PROJECT_VERSION` for every subsequent upload.

## Important release rule

The installed app loads the production Next.js deployment because its AI, food,
auth, and deletion routes require a server. Deploy and smoke-test the Vercel site
before every archive. Do not ship a build with `CAPACITOR_SERVER_URL` pointing to
localhost or a preview deployment.
