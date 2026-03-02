# The Lending Lab — Building Hope Impact Fund

## Overview
Multi-page marketing and lead generation website for Building Hope Impact Fund's "Lending Lab" business loan program for microschool founders. Two products: Term Loans ($10K–$50K, 4–6yr, Prime–1%) and Revolving Lines of Credit (up to $100K). Features an eligibility checker, streamlined pre-qualification wizard with DSR-based ability-to-repay calculations, admin dashboard for lead management, webhook notifications, waitlist capture, and configurable handoff to the separate LoanOS backend. Designed for a one-person operator (Allison Serafin).

## Architecture
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, wouter routing, TanStack Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)
- **Palette**: Navy/teal finance-forward
- **LoanOS Integration**: Leads hand off to separate LoanOS backend via webhook + API

## Two Loan Products

### Term Loan
- $10K–$50K in $10K increments, 4–6 year terms, quarterly payments
- Rate: Prime – 1% (currently 5.75%), 2% origination fee, no prepayment penalty
- FICO 650+ preferred (575 min for Year 0), Year 0 requires personal guarantee

### Revolving Line of Credit
- Up to $100K, 12-month draw period, monthly interest-only payments
- Rate: Prime – 1% on drawn balance, requires 12+ months operating, $100K+ revenue, FICO 650+

## Page Structure
- `/` — Homepage: Hero, Products, Who This Is For, Hard Gates, How It Works, FAQ, CTA
- `/eligibility` — 4-step eligibility checker with hard gates / flags / qualified outcomes
- `/prequal` — 5-step pre-qualification wizard (under 3 min) with DSR check; shows waitlist when APPLICATIONS_OPEN=false
- `/outcome/qualified` — Apply now (or "coming soon" with date) + document checklist
- `/outcome/flagged` — Apply with additional info + flag details
- `/outcome/ineligible` — What needs to change + SchoolStack.ai link
- `/admin` — Password-gated admin dashboard (uses ADMIN_KEY)
- `/privacy` — Privacy policy
- `/terms` — Terms of use

## Lead Handoff Architecture
1. **Pre-Qual Wizard** → captures lead, evaluates eligibility, stores in DB
2. **Webhook** → fires POST to WEBHOOK_URL on lead creation (configurable, HMAC-signed)
3. **Outcome Pages** → redirects to HANDOFF_URL_QUALIFIED/FLAGGED if set, otherwise shows "coming soon"
4. **Admin Dashboard** → Allison reviews leads, marks as handed off, exports CSV
5. **LoanOS API** → GET /api/leads/qualified, POST /api/leads/:id/claim for external pull

## Nonprofit Requirements
- Independent board of at least 4 people unrelated to the organization and staff (hard stop if not met)
- Board resolution approved by entire board and documented in minutes authorizing loan for stated amount (hard stop if not met)
- Both enforced in Eligibility checker (with entity type detection) and PreQual wizard (attestation checkboxes)
- Board resolution appears in document checklists on landing page and qualified outcome page

## Centralized Configuration
- `shared/rules.ts` — All thresholds + handoff config:
  - APPLICATIONS_OPEN (boolean gate for wizard vs waitlist)
  - APPLICATIONS_OPEN_DATE (display string)
  - FUNDRAISE_GOAL ($650K Cycle 2 goal), DEPLOY_AMOUNT ($450K committed)
  - NONPROFIT_MIN_BOARD_SIZE (4), NONPROFIT_BOARD_MUST_BE_INDEPENDENT, NONPROFIT_REQUIRES_BOARD_RESOLUTION
  - HANDOFF_URL_QUALIFIED / HANDOFF_URL_FLAGGED (redirect targets)
- `shared/content.ts` — All UI copy, nonprofit requirements, nonprofit attestation labels

## Security
- Rate limiting on POST endpoints (3 per IP per hour)
- IP-based duplicate detection: IP stored with lead, repeat submissions from same IP flagged
- Admin auth: Bearer token or Basic Auth or X-Admin-Key header or ?key= param (ADMIN_KEY env var)
- Honeypot field for spam protection
- No PII in server logs; IP stripped from export endpoints
- Webhook HMAC-SHA256 signature (WEBHOOK_SECRET env var)

## Environment Variables
- `ADMIN_KEY` — Required for admin dashboard and API access
- `WEBHOOK_URL` — Optional, external endpoint for lead notifications
- `WEBHOOK_SECRET` — Optional, HMAC secret for webhook signatures
- `DATABASE_URL` — PostgreSQL connection string

## Data Model
- `leads` table: school info, product type, amount, attestations (8 booleans), revenue/credit range, contact, ipAddress, flags, hard stops, status, risk score, DSR result, suggested amount, handoffStatus (pending/handed_off/waitlisted), claimedAt, claimedBy, timestamps
- LOC blocked for Year 0 founders in both PreQual wizard (disabled option) and Eligibility checker (disabled radio); evaluation hard-stops Year 0 + LOC
- `waitlist` table: email, school name, product interest, honeypot, timestamps

## API Endpoints
- `POST /api/leads` — Submit lead (public, rate-limited, honeypot-checked)
- `GET /api/leads` — List leads (admin, filterable by status/handoffStatus)
- `GET /api/leads/stats` — Summary counts (admin)
- `GET /api/leads/qualified` — Unclaimed qualified leads (for LoanOS)
- `GET /api/leads/flagged` — Unclaimed flagged leads (for LoanOS)
- `GET /api/leads/export` — CSV download (admin)
- `GET /api/leads/:id` — Lead detail (admin)
- `GET /api/leads/:id/export` — Lead data for LoanOS import (admin)
- `POST /api/leads/:id/claim` — Mark lead as handed off (admin/LoanOS)
- `POST /api/leads/:id/handoff` — Update handoff status (admin)
- `POST /api/waitlist` — Join waitlist (public, rate-limited)
- `GET /api/waitlist` — List waitlist entries (admin)
- `POST /api/admin/verify` — Verify admin key (admin)

## Key Files
- `shared/rules.ts` — Eligibility thresholds, DSR functions, handoff config
- `shared/content.ts` — All UI copy
- `shared/schema.ts` — Drizzle schema (leads + waitlist tables)
- `server/routes.ts` — All API routes with auth
- `server/storage.ts` — Database storage layer
- `server/services/webhook.ts` — Webhook delivery service
- `client/src/pages/Admin.tsx` — Admin dashboard
- `client/src/pages/PreQual.tsx` — Pre-qual wizard + waitlist gate
- `client/src/pages/OutcomeQualified.tsx` — Qualified outcome with handoff
- `client/src/pages/OutcomeFlagged.tsx` — Flagged outcome with handoff

## Contact
- General questions: help@lendinglab.org
- Philanthropy inquiries: Allison Serafin, aserafin@bhope.org (Program Director)
