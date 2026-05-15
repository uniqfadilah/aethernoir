@AGENTS.md

# aethernoir — Dark Art Portfolio

A gothic/moody dark-art portfolio website. Content is managed via Sanity (headless CMS). All copy, images, captions, the contact email recipient, and SEO metadata are editable in Sanity Studio — there are no hard-coded strings for content.

---

## 0. READ-FIRST (Next.js 16)

This repo uses **Next.js 16.2.6 + React 19**. APIs and conventions differ from older Next.js. **Before writing any code that touches Next.js APIs, read the relevant guide in `node_modules/next/dist/docs/`** (especially `01-app/` for App Router, metadata, server actions, image, fonts, caching, and `02-pages/` only if needed). Heed deprecation notices. Do not rely on training-data memory of Next.js.

Notable: in Next.js 16, dynamic route params and `searchParams` are async (`await params`), `cookies()`/`headers()` are async, and `fetch()` is **uncached by default** — opt into caching explicitly via `cache: 'force-cache'` or `next: { revalidate, tags }`.

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router only) |
| UI | React 19, TypeScript (strict), Tailwind CSS v4 |
| CMS | Sanity v3 (embedded Studio at `/studio`) |
| Sanity client | `next-sanity` (server-side GROQ) |
| Images | `@sanity/image-url` + `next/image` (Sanity CDN as remote) |
| Email | Resend (via Server Action) |
| Validation | `zod` for contact form |
| Fonts | `next/font/google` — Cinzel (display) + EB Garamond (body) |

Install commands when scaffolding (run individually, do not bundle):
```bash
npm i next-sanity @sanity/image-url sanity @sanity/vision styled-components
npm i resend zod
npm i -D @sanity/types
```

---

## 2. Directory layout

```
app/
  layout.tsx                  # root: fonts, theme, JSON-LD WebSite, global metadata
  page.tsx                    # / (home: hero + carousel)
  about/page.tsx              # /about
  art/
    page.tsx                  # /art (grid + tag filter)
    [slug]/
      page.tsx                # /art/[slug]
      opengraph-image.tsx     # dynamic OG image per artwork
  contact/
    page.tsx                  # /contact (client form)
    actions.ts                # 'use server' sendContact()
  studio/[[...tool]]/page.tsx # Sanity Studio mount
  sitemap.ts
  robots.ts
  not-found.tsx
components/
  art/Carousel.tsx
  art/ArtGrid.tsx
  art/ArtCard.tsx
  art/RelatedArt.tsx
  contact/ContactForm.tsx
  layout/Header.tsx
  layout/Footer.tsx
  ui/PortableText.tsx
  ui/SanityImage.tsx
  seo/JsonLd.tsx
lib/
  sanity/
    client.ts                 # createClient (server) + image builder
    queries.ts                # all GROQ queries (one named export per query)
    types.ts                  # generated/handwritten types for query results
    revalidate.ts             # tag constants
  seo/
    metadata.ts               # helpers: buildMetadata(), absoluteUrl()
    jsonld.ts                 # builders: websiteJsonLd, artworkJsonLd, personJsonLd
  env.ts                      # zod-validated process.env
sanity/
  schema.ts                   # exports array of all schemas
  schemas/
    siteSettings.ts
    home.ts
    about.ts
    artwork.ts
    tag.ts
    objects/seo.ts
    objects/portableText.ts
sanity.config.ts              # studio config (root)
```

Rule: anything fetched from Sanity goes through `lib/sanity/queries.ts`. No inline GROQ in components/pages.

---

## 3. Sanity schemas (spec)

Dataset: `production`. Project ID via `NEXT_PUBLIC_SANITY_PROJECT_ID`. All singletons must be locked to a single document (use `__experimental_actions` or document actions filter).

### `siteSettings` (singleton)
- `siteTitle` — string, required
- `siteDescription` — text, required
- `contactEmail` — string, required, email validation **(this is the recipient for /contact form)**
- `socialLinks[]` — array of `{ platform, url }`
- `defaultOgImage` — image with hotspot, required
- `seo` — `seoObject` (see below)

### `home` (singleton)
- `heroTitle` — string, required
- `heroSubtitle` — text
- `featuredArtworks[]` — array of `reference → artwork`, **ordered** (drives carousel order), min 1
- `seo` — `seoObject`

### `about` (singleton)
- `body` — Portable Text (block content), required — the introduction text
- `portrait` — image with hotspot, optional
- `seo` — `seoObject`

### `artwork`
- `title` — string, required
- `slug` — slug, source = `title`, required, unique
- `image` — image with hotspot + required `alt` field, required
- `caption` — Portable Text, required
- `tags[]` — array of `reference → tag`
- `year` — number
- `medium` — string (e.g. "oil on canvas", "digital")
- `publishedAt` — datetime, required, defaults to now
- `seo` — `seoObject`

Orderings: `publishedAt desc` default. Preview: title + image.

### `tag`
- `name` — string, required
- `slug` — slug from name, required, unique

### `seoObject` (reusable object, not a document)
- `metaTitle` — string (optional override; falls back to doc title)
- `metaDescription` — text (optional override)
- `ogImage` — image (optional; falls back to artwork image or `siteSettings.defaultOgImage`)
- `keywords[]` — string array
- `noIndex` — boolean, default false

---

## 4. Pages

### `/` (Home)
Fetch: `home` singleton + dereferenced `featuredArtworks`. Render hero (Cinzel display) + full-bleed carousel of artworks. Click on slide → `/art/[slug]`.

### `/about`
Fetch: `about` singleton. Render `body` via Portable Text component. Show `portrait` if present.

### `/art`
Fetch: all artworks ordered by `publishedAt desc`, plus all tags. Responsive masonry/grid. Optional tag filter via `?tag=slug` (server-rendered, no client state).

### `/art/[slug]`
Fetch in **one GROQ query**: the artwork by slug + up to 8 related artworks **sharing at least one tag** (exclude current). If none share tags, fall back to 6 latest other artworks.
Layout: large image at top, title, meta (year/medium), Portable Text caption, then `<RelatedArt>` grid below.
`generateStaticParams` over all slugs. Use `notFound()` if slug missing.

### `/contact`
Render `<ContactForm>` (client component) — fields: `name`, `email`, `subject`, `message`. On submit calls Server Action `sendContact()` in `app/contact/actions.ts`:
1. Validate with zod
2. Fetch `siteSettings.contactEmail` from Sanity (server-side)
3. Send via Resend (`from` = configured verified domain, `to` = contactEmail, `reply_to` = form email)
4. Return `{ ok: true }` or `{ ok: false, error }`
Never expose `contactEmail` to the client. Rate-limit by IP if practical (in-memory map is fine for v1).

### `/studio/[[...tool]]`
Mount `NextStudio` from `next-sanity/studio`. Studio config in `sanity.config.ts`.

---

## 5. Aesthetic — Gothic / Moody

Tokens (put in `app/globals.css` as Tailwind v4 `@theme`):
```
--color-bg: #0a0807;
--color-surface: #1a1614;
--color-ink: #ece6d8;       /* parchment-cream text */
--color-muted: #8a7f72;
--color-accent: #8b0000;    /* blood red */
--color-gold: #b08d57;      /* tarnished gold */
--font-display: "Cinzel", serif;
--font-body: "EB Garamond", serif;
```

Style rules:
- Background defaults to `--color-bg`; use subtle film grain (CSS noise SVG overlay at ~3% opacity).
- All display headings use `font-display`, all-caps, wide letter-spacing.
- Body text uses `font-body`, larger than usual (18–20px) for readability against dark BG.
- Vignette on hero / artwork detail (radial gradient, candle-warm at edges).
- Hover on art cards: slow fade + slight scale + warm glow (gold).
- No bright pure-white text; always `--color-ink` (cream).
- Respect `prefers-reduced-motion` — disable scale/fade transitions if set.

---

## 6. SEO — non-negotiable

This is a portfolio for an artist; SEO is a feature, not an afterthought.

### Metadata
- Root `layout.tsx` exports `metadata` with `metadataBase = new URL(env.SITE_URL)`, default OG image from `siteSettings.defaultOgImage`, Twitter card `summary_large_image`.
- Every page exports `generateMetadata()` that:
  1. Fetches the relevant Sanity doc
  2. Uses `seoObject` overrides if present, otherwise derives from doc fields
  3. Sets `alternates.canonical` to the page's absolute URL
  4. Sets `robots: { index: !seo.noIndex }`
- `/art/[slug]` MUST set `openGraph.images` to the artwork image (via Sanity image URL with `?w=1200&h=630&fit=crop&auto=format`).

### Dynamic OG images
`app/art/[slug]/opengraph-image.tsx` — runtime `nodejs`, returns the Sanity artwork image at 1200×630 with the title overlaid (use `ImageResponse`).

### JSON-LD
- Root layout: `WebSite` schema with `name`, `url`, `potentialAction` SearchAction (even if no search, helps).
- `/about`: `Person` schema (name from `siteSettings.siteTitle` or dedicated `artistName`, sameAs = social links).
- `/art/[slug]`: `VisualArtwork` schema — `name`, `image`, `creator` (Person ref), `dateCreated` (year), `artMedium` (medium), `description` (plain-text caption).

Render via `<JsonLd>` component using `<script type="application/ld+json">`.

### Crawlability
- `app/sitemap.ts`: include `/`, `/about`, `/art`, `/contact`, plus every `artwork.slug` (use `lastModified` from `_updatedAt`).
- `app/robots.ts`: allow all by default; disallow `/studio` and `/api`.
- All images: meaningful `alt` from Sanity (`image.alt` field is **required** in schema).
- Semantic HTML: `<main>`, `<article>` per artwork, `<nav>`, `<header>`, `<footer>`. One `<h1>` per page.

### Performance (Lighthouse target ≥ 95 mobile)
- `next/image` everywhere; never raw `<img>` for content images.
- `next/font` with `display: 'swap'`, preload only display+body weights actually used.
- Server Components by default; mark `'use client'` only when needed (carousel interaction, contact form).
- Lazy-load below-the-fold images via `loading="lazy"` (default on `next/image` except priority).
- Hero/carousel first slide: `priority`.

---

## 7. Data fetching & caching

- All Sanity reads are server-side. Never expose the write token or use the API on the client (read-only public dataset is OK).
- Use `next-sanity`'s `createClient` with `useCdn: true` in prod, `false` in dev.
- Tag every fetch with `next: { tags: ['sanity', `<docType>:<id>`] }` for on-demand revalidation.
- Expose a `POST /api/revalidate` route that validates a Sanity webhook signature (`@sanity/webhook`) and calls `revalidateTag('sanity')` (or a finer tag from the payload). Set this webhook up in Sanity Manage.
- ISR fallback: pages can also set `export const revalidate = 3600` as a backstop.

---

## 8. Environment variables

`lib/env.ts` validates these with zod at import time. Fail fast if missing.

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-15
SANITY_API_READ_TOKEN=            # optional; only if dataset is private
SANITY_REVALIDATE_SECRET=         # webhook signing secret

RESEND_API_KEY=
RESEND_FROM_EMAIL=                # e.g. "Aethernoir <noreply@aethernoir.art>"

SITE_URL=                         # absolute, no trailing slash, e.g. https://aethernoir.art
```

Commit `.env.example` with empty values. Never commit `.env.local`.

---

## 9. Conventions

- **TypeScript strict**. No `any`. Type GROQ results explicitly in `lib/sanity/types.ts`. Consider `sanity-codegen` later but not required for v1.
- **Server Components by default**. Add `'use client'` only at the leaf component that needs interactivity.
- **One GROQ query per page** when feasible (use projections + joins inside a single query rather than multiple round-trips).
- **No client-side Sanity fetching** in v1.
- **Tailwind v4**: use `@theme` in `globals.css` for tokens; no separate `tailwind.config.ts` unless needed.
- **Accessibility**: keyboard-navigable carousel (arrow keys + visible focus), `alt` on every image, sufficient contrast (test cream-on-near-black against WCAG AA).
- **Error handling at boundaries only**: validate form input (zod), validate env (zod), validate webhook signatures. Trust internal Sanity data shapes after typing.
- **No `<img>`, no raw `fetch()` to Sanity** — always go through the typed client.

---

## 10. Commands

```bash
npm run dev      # next dev — http://localhost:3000, studio at /studio
npm run build    # next build (must pass before any merge)
npm run start    # next start
npm run lint     # eslint
```

When verifying UI work: start `npm run dev`, exercise the actual flow in a browser (home carousel, art grid, art detail with related, contact form submission, studio edit → revalidate). Type-check passes ≠ feature works.

---

## 11. When in doubt

1. Check `node_modules/next/dist/docs/` for the relevant Next.js 16 guide.
2. Check Sanity's current docs for v3 Studio + `next-sanity` patterns — APIs evolve.
3. Prefer the minimal change that satisfies the spec. Don't add abstractions for hypothetical needs.
4. Keep CMS-editable content out of code. If a string is in `.tsx`, it should be UI chrome, not content.
