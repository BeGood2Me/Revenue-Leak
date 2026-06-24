# Revenue Leak

Find the top 3 places your business is losing revenue — and what to fix first.

A self-serve diagnostic tool for **SaaS**, **ecommerce**, **agency**, and **service** businesses. Users complete a tailored questionnaire, see a free preview of leak severity scores, and unlock the full interactive report via a one-time Stripe payment.

## Features

- Multi-niche questionnaires (~10 questions each) mapped to 6 universal leak categories
- Config-driven scoring and monthly revenue loss estimation
- SQLite database via Prisma (swap to Postgres in production)
- Stripe Checkout + webhook payment flow
- Gated full report at `/result/[id]`
- Mobile-first Tailwind UI

## Quick start

### One-command local setup

```bash
npm install
npm run setup
npm run dev
```

`npm run setup` automates as much as possible:

- Creates `.env.local` from `.env.example` if missing
- Generates `DIAGNOSTIC_ACCESS_SECRET`
- Sets `DATABASE_URL` and `NEXT_PUBLIC_APP_URL`
- Runs `prisma generate` + `prisma db push` (SQLite)
- Configures Stripe test keys, price, and webhook secret **if** Stripe CLI is installed and logged in

`npm install` and `npm run dev` also run lightweight checks (`postinstall` / `predev`) so secrets and the local DB exist before the app starts.

### Stripe CLI (for checkout + webhooks)

If setup skipped Stripe, install and log in once:

```powershell
winget install Stripe.StripeCli
npm run stripe:login
npm run setup
```

`npm run stripe:listen` forwards webhooks and **auto-saves** `whsec_…` to `.env.local`.

### Environment variables

Most values are written automatically by `npm run setup`. Reference:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `file:./dev.db` for SQLite (auto-set) |
| `DIAGNOSTIC_ACCESS_SECRET` | Signs preview/report tokens (auto-generated) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) — auto via Stripe CLI |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key — auto via Stripe CLI |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret — auto via `stripe listen --print-secret` or `stripe:listen` |
| `STRIPE_PRICE_ID_DIAGNOSTIC` | One-time Price ID — auto-created ($29) |
| `NEXT_PUBLIC_APP_URL` | App URL (`http://localhost:3000` locally, auto-set) |

### Manual database migrations (optional)

`npm run setup` uses `prisma db push` for frictionless local dev. For migration history:

```bash
npm run db:migrate
```

### Email delivery (Resend via Vercel Marketplace)

**Recommended for Vercel:** Install [Resend from the Vercel Marketplace](https://vercel.com/integrations/resend). It auto-adds `RESEND_API_KEY` to your project — no manual API key copy/paste.

After installing, you still need to add one env var in Vercel:

```
EMAIL_FROM="Revenue Leak <reports@yourdomain.com>"
```

Verify your domain in the Resend dashboard before going live (Marketplace links your Resend account).

**Local development:** Either run `vercel env pull` after installing Resend on your linked project, or add `RESEND_API_KEY` manually to `.env.local`. Without it locally, the report link prints in the server console instead of sending.

### Run locally

Open [http://localhost:3000](http://localhost:3000).

#### Local testing without webhooks (fallback)

If checkout completes but the webhook isn't running, the app still unlocks the report and sends the email when Stripe redirects back to `/result/[id]?session_id=...`. Webhooks are still recommended for production.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Full local bootstrap (env, DB, Stripe if CLI available) |
| `npm run env:setup` | Env + DB only (no Stripe) |
| `npm run dev` | Start development server (auto-checks env/DB first) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run unit tests |
| `npm run stripe:setup` | Stripe keys, price, and webhook secret only |
| `npm run stripe:listen` | Forward webhooks (auto-saves `whsec_…`) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
app/
  page.tsx                          # Landing + wizard
  result/[id]/page.tsx              # Paid report view
  api/diagnostic/route.ts           # Create & fetch diagnostics
  api/stripe/create-checkout-session/
  api/stripe/webhook/
components/                         # UI components
lib/
  questions/                        # Per-niche question configs
  scoring.ts                        # Leak severity (0–100)
  estimation.ts                     # Monthly $ loss formulas
  insights.ts                       # Explanations & recommendations
  diagnostic.ts                     # Orchestrator
prisma/schema.prisma
```

## Deployment (Vercel)

1. Push to GitHub and import in [Vercel](https://vercel.com).
2. Add environment variables in **Project → Settings → Environment Variables**:

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Postgres URL (Vercel Postgres, Neon, or Supabase) |
| `STRIPE_SECRET_KEY` | Live or test key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Matching publishable key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard webhook |
| `STRIPE_PRICE_ID_DIAGNOSTIC` | Your one-time price ID |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `DIAGNOSTIC_ACCESS_SECRET` | Long random string — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `RESEND_API_KEY` | Auto-added when you install Resend from Vercel Marketplace |
| `EMAIL_FROM` | **You set this** — e.g. `Revenue Leak <reports@yourdomain.com>` |

Install Resend from [Vercel Marketplace](https://vercel.com/integrations/resend) (or run `vercel integration add resend` on a linked project).

3. **Database:** Switch `prisma/schema.prisma` to `postgresql`, then run `npx prisma migrate deploy`.
4. **Stripe webhook:** `https://your-domain.vercel.app/api/stripe/webhook` → events `checkout.session.completed` and `charge.refunded`
5. **Resend domain:** Verify your sending domain in Resend before going live.

Customers enter email at Stripe Checkout. After payment they see the report immediately **and** receive an email with a permanent link.

## Testing

```bash
npm test                 # Unit + API integration tests (uses prisma/test-integration.db)
npm run test:e2e         # Playwright browser tests (starts dev server if needed)
npm run test:paid-flow   # End-to-end paid report verification (app must be running)
npm run test:all         # Vitest + Playwright
```

**Paid flow (manual Stripe):**

```bash
npm run dev              # terminal 1
npm run stripe:listen    # terminal 2 (webhooks)
npm run test:paid-flow -- --stripe
```

Open the printed Checkout URL and pay with test card `4242 4242 4242 4242`.

**Nurture cron (production):** `vercel.json` runs `/api/cron/nurture` daily. Set `CRON_SECRET` in Vercel; Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.

## Leak categories

All niches score these six categories:

1. **Acquisition** — traffic that never becomes a lead
2. **Response** — slow or missed replies
3. **Conversion** — interest that doesn't close
4. **Retention** — churn and no repeat business
5. **Billing / recovery** — failed payments and under-billing
6. **Expansion** — missing upsells and cross-sells

## License

Private / proprietary — all rights reserved.
