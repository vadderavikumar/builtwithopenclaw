# BuiltWithOpenClaw

A curated directory of products built with OpenClaw. Free listings with manual review, featured slots at $49/week.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (admin only)
- **Storage**: Supabase Storage
- **Payments**: Stripe Checkout
- **Hosting**: Vercel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_FEATURED_PRICE_ID` - Stripe Price ID for featured slot ($49)
- `ADMIN_EMAILS` - Comma-separated admin emails allowed to login
- `RESEND_API_KEY` - (Optional) For claim verification emails
- `NEXT_PUBLIC_APP_URL` - App URL (e.g. https://builtwithopenclaw.com)

### 3. Database setup

Run the SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor. Then run `002_storage.sql` to create the storage bucket.

### 4. Create admin user

In Supabase Dashboard: Authentication → Users → Add user. Add the email to `ADMIN_EMAILS`.

### 5. Stripe setup

1. Create a product "Featured Slot" with price $49
2. Copy the Price ID to `STRIPE_FEATURED_PRICE_ID`
3. Create a webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Subscribe to `checkout.session.completed`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 6. Run the app

```bash
npm run dev
```

## Seed data

```bash
npx tsx scripts/seed.ts
```

(Requires env vars to be set)

## Project structure

- `src/app/` - Pages and API routes
- `src/components/` - React components
- `src/lib/` - Utilities, Supabase, Stripe
- `supabase/migrations/` - SQL schema

## Features

- **Public**: Homepage, directory, listing detail, submit form, get featured, collections
- **Admin**: Login, submissions queue, listings, featured slots, payments, reports, newsletter. GitHub import
- **Trust**: Claim listing, verified badge, report listing
- **Engagement**: Upvotes, newsletter signup
- **SEO**: Sitemap, RSS feed, OG images (via metadata)
