# PinAffiliate Pro

**Create Pins • Add Affiliate Links • Earn More**

A Pinterest-style affiliate marketing platform for creators and bloggers. This repo contains a **working foundation** — real, runnable code, not tutorials or stubs — covering authentication, the pin/affiliate-link system, boards, blog, comments, analytics, and an admin API. It's built to be extended, not a finished 100-page platform (see **What's not built yet** below for an honest scope map).

---

## Tech stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion-ready, lucide-react icons, SWR
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth (access + refresh tokens), express-validator, helmet, rate limiting

## Project structure

```
pinaffiliate-pro/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Pin, Board, BlogPost, Comment, ClickEvent
│   ├── controllers/               # Business logic per resource
│   ├── routes/                    # Express routers
│   ├── middleware/                # auth (JWT guard), errorHandler, rateLimiters
│   ├── utils/tokens.js            # JWT sign/verify helpers
│   ├── app.js / server.js
│   └── .env.example
└── frontend/
    ├── src/app/
    │   ├── (auth)/login, register, forgot-password, reset-password/[token]
    │   ├── dashboard/page.tsx     # stat cards, quick actions, ad slots
    │   ├── pin/[slug]/page.tsx    # public pin page w/ affiliate buy button
    │   ├── page.tsx               # homepage — hero + pin feed
    │   └── globals.css            # design tokens (see DESIGN.md)
    ├── src/components/
    │   ├── ui/ (Button, Input, AdSlot)
    │   ├── layout/ (Navbar, Footer)
    │   └── pin/PinCard.tsx        # signature "torn-tag" affiliate ribbon card
    ├── src/context/AuthContext.tsx
    └── src/lib/ (api.ts, types.ts, utils.ts)
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env
# fill in MONGO_URI (MongoDB Atlas or local), JWT secrets
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev         # starts on http://localhost:3000
```

The frontend calls the API at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`).

## What's fully built

- **Auth system**: register, login, JWT access+refresh tokens (httpOnly refresh cookie), forgot/reset password, email-verification token flow (console-logged — no provider wired, per the brief), Google/GitHub OAuth **placeholders** that return `501` until real credentials are added, protected routes, "remember me".
- **User profiles**: full schema (bio, country, social links, theme, privacy, notification settings), public profile endpoint, follow/unfollow.
- **Pins & affiliate links**: full CRUD, scheduling, draft/publish workflow, SEO fields, affiliate button config (text/color/icon/nofollow/sponsored/new-tab), click tracking that increments both the pin and the owner's stats, like/save/report.
- **Boards**: CRUD, follow, public board pages with their pins.
- **Blog**: CRUD, categories matching the brief, publish workflow, related posts.
- **Comments**: polymorphic (works for both pins and blog posts).
- **Analytics**: MongoDB aggregation endpoints for overview, daily/monthly timeseries, top affiliate links, top categories, CTR — CSV export is a documented placeholder.
- **Admin API**: user management (suspend/reactivate), reported-pin moderation, featured-pin toggling, platform overview stats.
- **Frontend UI**: homepage with editorial hero + masonry pin feed, full auth flow, dashboard overview with live stat cards, public pin detail page with the affiliate buy button, related pins, and ad slots wired in. `AdSlot` is wired to **[EthicalAds](https://www.ethicalads.io)** — a privacy-respecting, developer-focused network with no third-party tracking scripts. Set `NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID` in `frontend/.env.local` once you've signed up as a publisher; until then, every ad location renders a clearly-labeled placeholder so layout/spacing preview correctly. No AdSense or shady ad-network scripts are embedded, exactly as the brief asked.
- **Design system**: a real, considered visual identity — see `DESIGN.md` — not default Tailwind styling.

## What's not built yet (honest roadmap)

Generating literally every page/API for a spec this size in one pass isn't realistic at production quality, so these are stubbed at the architecture level (model + route pattern already established) but need their UI or business logic filled in next:

1. **Admin panel UI** — the API is complete (`/api/admin/*`); no dashboard screens yet.
2. **Blog frontend** — list/detail pages, categories, tags, newsletter signup UI (API is complete).
3. **Board management UI** — create/edit board screens (API is complete).
4. **Pin upload form** — the create-pin API and validation are done; the multi-field upload form (image upload, tags input, scheduler) isn't built.
5. **Full analytics dashboard charts** — `/api/analytics/*` returns real aggregated data; hook it into `recharts` (already installed) for the dashboard charts.
6. **Search UI** — text indexes exist on Pin/BlogPost; build the search results page and filters.
7. **Notifications** — no model yet; add a `Notification` schema + real-time delivery (or polling) when ready.
8. **Image uploads** — pins currently take an `imageUrl` string; wire up S3/Cloudinary/multer storage for real uploads.
9. **SEO extras** — sitemap.xml, robots.txt, JSON-LD schema, OpenGraph images per page.
10. **CSV export & real email provider** — both are clearly marked placeholders in the code (`console.log` stand-ins) — swap in SendGrid/Resend and a CSV lib when you're ready.

Happy to build out any of these next — just say which piece and I'll pick up exactly where this leaves off.
