# The Lending Lab

A lead-generation and pre-qualification website for **Building Hope Impact Fund's** (BHIF) philanthropically fueled loan program. The Lending Lab serves small schools enrolling 10–100 pK-12 students across the United States — schools that traditional banks overlook.

## Loan Products

| Product | Amount | Term | Rate |
|---------|--------|------|------|
| Term Loan | $10K – $50K | 4–6 years, quarterly payments | 5% flat |
| Revolving Line of Credit | Up to $100K | Annual renewal | Prime – 1% on drawn balance |

**Application window:** May 6 – November 6, 2026 (or until 100% deployed).

## Architecture

```
client/           React 19 + TailwindCSS 4 + shadcn/ui (Vite)
server/           Express 5 API (Replit/local dev)
netlify/functions Serverless API (Netlify deployment)
shared/           Schema, rules, and content shared between client and server
```

- **Frontend:** React with wouter routing, Radix UI components, Framer Motion
- **Backend:** Express 5 (local/Replit) or Netlify Functions (production)
- **Database:** PostgreSQL with Drizzle ORM
- **Styling:** TailwindCSS 4 with shadcn/ui component library

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── pages/           Home, PreQual, Admin
│   │   ├── components/
│   │   │   ├── sections/    Hero, LoanDetails, FAQ, etc.
│   │   │   ├── layout/      Header, Footer
│   │   │   └── ui/          shadcn components
│   │   └── lib/             API client, utils
│   ├── public/              Static assets, logos, photos
│   └── index.html
├── server/
│   ├── index.ts             Express server entry
│   ├── routes.ts            API route handlers
│   ├── storage.ts           Database operations (Drizzle)
│   ├── db.ts                PostgreSQL connection
│   └── services/
│       └── webhook.ts       Webhook delivery for new leads
├── netlify/
│   └── functions/
│       └── api.ts           Serverless API for Netlify
├── shared/
│   ├── schema.ts            Drizzle schema + Zod validation
│   ├── rules.ts             Loan parameters, scoring, eligibility
│   └── content.ts           FAQ content, UI copy
├── netlify.toml             Netlify build & redirect config
└── drizzle.config.ts        Drizzle Kit config
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_KEY` | Yes | Admin dashboard auth key |
| `WEBHOOK_URL` | No | URL for lead-created webhook notifications |
| `WEBHOOK_SECRET` | No | HMAC secret for webhook signature verification |

## Local Development

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start dev server (Express + Vite HMR)
npm run dev
```

The dev server runs on port 5000 with Vite HMR proxying through Express.

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npx vite build`
   - **Publish directory:** `dist/public`
   - **Functions directory:** `netlify/functions`
3. Set environment variables in Netlify dashboard:
   - `DATABASE_URL` — your PostgreSQL connection string (e.g., Neon, Supabase, Railway)
   - `ADMIN_KEY` — choose a secure admin key
   - `WEBHOOK_URL` and `WEBHOOK_SECRET` (optional)
4. Deploy

API routes (`/api/*`) are automatically proxied to Netlify Functions via redirect rules.

### Replit

The app runs as a full-stack Express server on Replit:

```bash
npm run build    # Builds client + server bundle
npm start        # Runs production server
```

## Key Configuration

### `shared/rules.ts`

Central configuration for loan parameters:

- `APPLICATIONS_OPEN` — set to `true` to enable applications (May 6, 2026)
- `CURRENT_RATE` — term loan interest rate (0.05 = 5%)
- `FUND_TARGET` — total fund size ($1M)
- Fund deployment and fundraising targets
- Eligibility rules (entity types, FICO thresholds, operating years)
- Risk scoring weights

### `shared/content.ts`

All user-facing copy including FAQ content (pre-launch and application-stage versions).

## Admin Dashboard

Access at `/admin` with the configured `ADMIN_KEY`. Features:

- Lead pipeline overview with stats
- Filter by status (qualified, flagged, ineligible)
- Claim leads for LoanOS handoff
- CSV export of all leads
- Waitlist management

## Contact

- **General:** help@lendinglab.org
- **Philanthropy:** aserafin@bhope.org (Allison Serafin, Building Hope Impact Fund)
