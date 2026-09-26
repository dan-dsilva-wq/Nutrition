# Store and marketing

- `app-store/listing.md` – App Store Connect copy: name, subtitle, keywords, description, age rating, pricing, screenshot plan, review notes.
- `app-store/screenshots/` – upload-ready screenshots (JPEG; iPhone 6.9" 1320×2868, iPad 13" 2064×2752).
- `app-store/template/` – caption text (`captions.json`) and frame used to build them.
- `launch-plan.md` – positioning, launch checklist, channels, metrics.

Regenerate screenshots after UI changes:

```bash
NEXT_PUBLIC_PACE_DEMO_MODE=1 NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= OPENAI_API_KEY= npx next dev -p 3100
node scripts/store-screenshots.mjs
```

The public landing page (App Store marketing URL) is `src/app/about/page.tsx`, with images in `public/marketing/`.
