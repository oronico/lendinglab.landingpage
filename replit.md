# The Lending Lab - Building Hope Impact Fund

## Overview
Marketing website for Building Hope Impact Fund's "Lending Lab" microloan program ($10K-$150K) for microschool founders nationwide. Features a multi-step pre-qualification screener that captures leads and directs qualified applicants to a JotForm for full application.

## Architecture
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui components, wouter routing, TanStack Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)

## Data Model
- `leads` table: Stores all pre-qualification submissions (contact info, business details, financial data, operations, qualification status, rejection reasons)

## Key Files
- `shared/schema.ts` - Drizzle schema with `leads` table
- `server/routes.ts` - API routes (`POST /api/leads`, `GET /api/leads`, `GET /api/leads/:id`)
- `server/storage.ts` - Database storage interface using Drizzle
- `server/db.ts` - Database connection pool
- `client/src/components/sections/ScreeningFlow.tsx` - Multi-step pre-qualification wizard
- `client/src/components/sections/Hero.tsx` - Hero section with stats
- `client/src/components/sections/LoanDetails.tsx` - Loan terms and underwriting rubric
- `client/src/components/sections/FAQ.tsx` - FAQ accordion
- `client/src/components/sections/Opportunity.tsx` - Market opportunity section
- `client/src/index.css` - Theme variables (warm cream/navy/golden-orange palette)

## Design
- Warm color palette: cream background (`40 33% 98%`), warm navy primary (`215 50% 23%`), golden orange secondary (`32 90% 55%`)
- Rounded pill-shaped CTA buttons
- Newity-inspired professional fintech aesthetic

## Screening Logic
- Sole Props: Ineligible
- S-Corps: Allowed (Form 1120-S notice shown)
- Nonprofits: Require EIN verification + personal guarantee consent
- Year 0 schools: Capped at $10K
- Loan-to-revenue max: 50%
- Must know monthly breakeven

## Loan Terms (Cycle 2)
- $10K-$50K (expanding to $150K as fund exceeds $1M)
- 3-6% interest, 2% origination fee
- Personal guarantee + credit check required
- No prepayment fees
- Plaid autodebit quarterly payments
