# The Lending Lab — Building Hope Impact Fund

## Overview
Multi-page marketing website for Building Hope Impact Fund's "Lending Lab" business loan program for microschool founders nationwide. Two products: Term Loans ($10K–$50K, 4–6yr, Prime–1%) and Revolving Lines of Credit (up to $100K). Features an eligibility checker, streamlined 6–10 question pre-qualification wizard with DSR-based ability-to-repay calculations, and database-backed lead management. Designed for a one-person operator (Allison Serafin).

## Architecture
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, wouter routing, TanStack Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)
- **Palette**: Navy/teal finance-forward (no warm cream/orange)

## Two Loan Products

### Term Loan
- $10K–$50K in $10K increments
- 4–6 year terms, quarterly payments
- Rate: Prime – 1% (currently 5.75%)
- 2% origination fee (added to principal), no prepayment penalty
- FICO 650+ preferred (575 min for Year 0)
- Year 0 requires personal guarantee
- UCC-1 on revenues & assets

### Revolving Line of Credit
- Up to $100K commitment
- 12-month draw period, monthly interest-only payments
- Rate: Prime – 1% on drawn balance
- Requires 12+ months operating, $100K+ annual revenue, FICO 650+
- QBO + reconciled books + tuition contracts required

## Page Structure
- `/` — Homepage: Hero, Products, Who This Is For, Hard Gates, How It Works, FAQ, CTA
- `/eligibility` — 4-step eligibility checker with hard gates / flags / qualified outcomes
- `/prequal` — 5-step pre-qualification wizard (under 3 min) with DSR check
- `/outcome/qualified` — Apply now + document checklist
- `/outcome/flagged` — Apply with additional info + flag details
- `/outcome/ineligible` — What needs to change + SchoolStack.ai link
- `/privacy` — Privacy policy
- `/terms` — Terms of use

## Centralized Configuration
- `shared/rules.ts` — All thresholds (FICO, DSR caps, loan amounts, rates, etc.) + DSR calculation functions
- `shared/content.ts` — All UI copy (hero, products, FAQ, attestation labels, disclaimers)

## Security
- Rate limiting on POST /api/leads (5 per IP per hour)
- Basic Auth / admin key on GET /api/leads endpoints
- Honeypot field for spam protection
- No PII in server logs (method/path/status only)
- Duplicate detection on email + school name

## Data Model
- `leads` table: school info, product type, amount, attestations (8 booleans), revenue range, credit range, contact info, honeypot, flags, hard stops, status, risk score, DSR result, suggested amount, timestamps

## Key Files
- `shared/rules.ts` — Eligibility thresholds & DSR functions
- `shared/content.ts` — All UI copy
- `shared/schema.ts` — Drizzle schema
- `server/routes.ts` — API with security hardening
- `server/storage.ts` — Database storage
- `client/src/pages/Home.tsx` — Homepage
- `client/src/pages/Eligibility.tsx` — Eligibility checker
- `client/src/pages/PreQual.tsx` — Pre-qualification wizard
- `client/src/pages/OutcomeQualified.tsx` — Qualified result
- `client/src/pages/OutcomeFlagged.tsx` — Flagged result
- `client/src/pages/OutcomeIneligible.tsx` — Ineligible result
- `client/src/components/layout/Header.tsx` — Sticky nav
- `client/src/components/layout/Footer.tsx` — Footer with links
- `client/src/components/sections/Hero.tsx` — Hero section
- `client/src/components/sections/LoanDetails.tsx` — Product cards
- `client/src/components/sections/HowItWorks.tsx` — 5-step process
- `client/src/components/sections/FAQ.tsx` — Key questions

## Philanthropy
- Fund: Building Hope Impact Fund
- Partners: Stand Together Trust & The Beth & Ravenel Curry Foundation
- Cycle 2: $450K deploying (Cycle 1: $410K, 11 schools, 8 states, 100% on-time)

## Contact
- Allison Serafin: aserafin@bhope.org, (702) 539-9230 (Program Director)
