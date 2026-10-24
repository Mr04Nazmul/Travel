# Home, Far Away

A browser-local React + TypeScript travel poster editor by **Hossain Najmul**.

## Develop

Node 24: `npm ci`, `npm run dev`. Run `npm test` and `npm run build` before publication.
`node --experimental-strip-types tests/render.mjs` renders the production template offline to `/tmp/travel-qa/` at Post, Story and 2× sizes. It covers Dhaka–Kobe, London–Sylhet, Osaka–Kobe, Apia–Suva and Bengali/long-name layouts.

## Features

- Worldwide Open-Meteo / GeoNames city search with an explicit 250-country/territory selector (ISO regions plus Kosovo), country-filtered results, country/region disambiguation, request cancellation, errors and map/coordinate pin fallback. Cross-continent journey examples are resolved through the same live geographic API; they are not a fixed coverage list.
- Local IANA zone lookup for manual pins; Intl formats actual dates and DST. Great-circle distance, km/miles. Natural Earth map fitted around the short longitudinal arc and sampled great-circle route.
- One Canvas renderer for preview and exact PNG export. Locally hosted serif and Bengali fonts; original ivory and sage designs, Post and Story formats, 2× export.
- Local uploads (JPG/PNG/WebP, 15 MB), local downsampling, horizontal/vertical crop, zoom, replace/remove. No photo upload to a server. Photos intentionally do not survive reload.
- Licensed Dhaka and Kobe sample photographs. Other places use clearly illustrated cards until an upload or explicitly selected Commons image is supplied. Commons photos are nearby geotagged candidates; users must inspect relevance. Never substitutes a random city photo.
- Native file sharing where supported; generated image preview and download fallback otherwise. Settings-only share links omit name, quote and photos; sharing cities requires an explicit checkbox.
- Local drafts with storage failure notice and reset, reduced motion, focus outlines, semantic controls, responsive layout and metadata.

## Privacy and external services

No login, tracking or backend. City search queries go to Open-Meteo (GeoNames data, CC BY 4.0); photo searches/selected external images go to Wikimedia Commons. Coordinates from photo searches are city/pin coordinates. The map, fonts and timezone lookup run locally. Uploaded photos remain in browser memory; draft settings reside in localStorage. Share links only include cities when opted in. Do not use precise private locations in a public link.

The free public Open-Meteo endpoint has usage limits and noncommercial service terms. A paid/commercial rollout should configure an appropriate licensed service. Wikimedia provides no coverage guarantee. No Google Maps scraping, proprietary imagery or paid UI components are included. Cross-origin image failures stop export with a clear error; replace/remove the offending image.

## Deployment

`.github/workflows/pages.yml` validates pull requests and builds/deploys main to GitHub Pages. Repository Settings → Pages must be set to **GitHub Actions**, and Pages/Actions must be enabled. The connected integration can write code but may not have administration scope to enable Pages. A Pages deployment failure stating that the Pages site is missing requires this repository setting, not code changes.

Relative Vite assets support `https://mr04nazmul.github.io/Travel/` and custom static hosts. There was no existing production code, background video or audio in the initial repository. The initial README is preserved on `backup/before-home-far-away-20261024`.

## Design and licenses

The supplied reference is a design target, not a flattened background. A real geographic map and reusable code draw all dynamic content. Original abstract footer scenery is decorative, not a claimed photograph of either city. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for asset/component sources and licenses.

## Advertising integration

Google AdSense publisher `ca-pub-3728341118830943` and responsive footer unit `1630336858` were obtained from the connected owner account. The site includes publisher verification metadata and `public/ads.txt`. Optional advertising code loads only after Allow ads; Continue without ads leaves the poster editor fully usable. The app requests non-personalized advertising. A plain local opt-in is not a Google-certified CMP; configure Google's regional privacy messaging before serving personalized ads. Site registration, ownership verification, Google review, and DNS/custom-domain configuration remain separate account operations. The uploaded poster composition never includes ads. See `public/privacy.html` for the updated disclosure.
