# BuiltWithOpenClaw

A curated directory of products built with OpenClaw. Free listings with manual review, featured slots at $29/week.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (admin only)
- **Storage**: Supabase Storage
- **Payments**: Dodo Payments
- **Hosting**: Vercel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Publishable key (`sb_publishable_...`) or legacy anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Secret key (`sb_secret_...`) or legacy service_role key (server-side only)
- `DODO_PAYMENTS_API_KEY` - Dodo Payments API key
- `DODO_PAYMENTS_WEBHOOK_KEY` - Dodo webhook signing secret
- `DODO_PRODUCT_ID` - Dodo product ID for homepage featured ($49)
- `DODO_BLOG_FEATURED_PRODUCT_ID` - Dodo product ID for blog featured ($29)
- `DODO_PAYMENTS_ENVIRONMENT` - `test_mode` or `live_mode`
- `ADMIN_EMAILS` - Comma-separated admin emails allowed to login
- `RESEND_API_KEY` - (Optional) For claim verification emails and weekly digest
- `NEXT_PUBLIC_APP_URL` - App URL (e.g. https://builtwithopenclaw.com)
- `CRON_SECRET` - (Optional) For Vercel Cron to call weekly digest; set in Vercel env vars

### 3. Database setup

Run the SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor. Then run `002_storage.sql` to create the storage bucket.

### 4. Create admin user

In Supabase Dashboard: Authentication → Users → Add user. Add the email to `ADMIN_EMAILS`.

### 5. Dodo Payments setup

1. Create a Dodo Payments account at [dodopayments.com](https://dodopayments.com)
2. Create products: "Homepage Featured" ($49) and "Blog Featured" ($29)
3. Copy the Product ID to `DODO_PRODUCT_ID`
4. Copy API key to `DODO_PAYMENTS_API_KEY`
5. Create webhook endpoint: `https://your-domain.com/api/webhooks/dodo`
6. Subscribe to `payment.succeeded`
7. Copy webhook secret to `DODO_PAYMENTS_WEBHOOK_KEY`

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
- `src/lib/` - Utilities, Supabase, Dodo Payments
- `supabase/migrations/` - SQL schema

## Features

- **Public**: Homepage, directory, listing detail, submit form, get featured, collections
- **Admin**: Login, submissions queue, listings, featured slots, payments, reports, newsletter. GitHub import
- **Trust**: Claim listing, verified badge, report listing
- **Engagement**: Upvotes, newsletter signup
- **SEO**: Sitemap, RSS feed, OG images (via metadata)
