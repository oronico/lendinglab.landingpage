# The Lending Lab - Building Hope Impact Fund

## Overview
Professional marketing website for Building Hope Impact Fund's "Lending Lab" business loan program for microschool founders nationwide. Two products: Term Loans ($10K-$50K) and Revolving Lines of Credit (up to $100K). Features a rigorous multi-step eligibility checklist, verification-oriented pre-qualification screener with automated consistency checks, and database-backed lead management. Designed to minimize wasted work for the one-person operator (Allison Serafin).

## Architecture
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui components, wouter routing, TanStack Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)

## Two Loan Products

### Term Loan
- $10K-$50K in $10K increments (Year 0 cap: $25K)
- 3-6% interest (determined during underwriting)
- 2% origination fee, no prepayment penalty
- 3-5 year terms, quarterly payments
- UCC-1 filing on pledged revenues and assets
- Personal guarantee may be required (credit-dependent)
- Credit check performed

### Revolving Line of Credit
- Up to $100K commitment
- 12-month draw period, 18-24 month maturity
- 3-6% interest on drawn balance only (accrued daily)
- 2% origination fee, no prepayment penalty
- Monthly interest-only payments via ACH auto-debit
- Clean-up: balance ≤10% for 30 consecutive days once per year
- UCC-1, PG may be required, Plaid continuous monitoring
- Restrictions: no payroll catch-up, past-due rent, debt refinance, international work

## Page Structure
1. **Hero** - Two product cards, stats ($410K deployed, 11 schools, 8 states, 100% on-time)
2. **Eligibility Checklist** - Interactive self-screen gate with Year 0/1/2+ and nonprofit toggles
3. **Screening Flow** - 5-step wizard with product selection (Contact → Enrollment → Facility → Financial → Loan)
4. **How It Works** - Visual 5-step timeline
5. **Loan Details** - Tabbed interface: Term Loan and LOC with full terms
6. **FAQ** - Comprehensive Q&A including LOC-specific section

## Data Model
- `leads` table with fields for: contact, school info, product type, enrollment, facility, financial discipline, loan request, LOC-specific fields, references, automated flags, and qualification status

## Key Requirements
- Two products: Term Loan + Revolving Line of Credit
- 3-6% interest, 2% origination fee, no prepayment penalty
- All borrowers: signed tuition contracts with enrollment deposits (per-contract amount)
- All borrowers: $2M/$1M general liability insurance
- Residential dwelling: allowed if applicant owns home and can submit deed
- Rent on time: applies to all with a lease (including Year 0)
- Year 2+: tax filings, EOY balance sheet, P&L, cash flow
- Nonprofits: independent board member co-applicant (not employee/contractor/related)
- Operating schools: 2024-25 Retention AND 2025-26 Projected Attrition as separate fields
- QuickBooks Online required, Plaid mandatory, formal payroll required
- No commingling of personal/business funds

## Screening Logic
- **Eligibility Checklist**: ~20 items, conditionally shown by Year 0/1/2+ and entity type
- **Product Selection**: Step 1 includes Term Loan vs LOC choice
- **Revenue Calculator**: Inline tuition × contracts = calculated revenue
- **Automated Flags**: Revenue math, deposit gap, loan-to-revenue ratio, email mismatch, duplicates, payroll, commingling, lease expiry, board independence, residential ownership
- **Early Stops**: No facility, residential without ownership/deed, no financial model
- **Result Screens**: Qualified → JotForm, Flagged → proceed with issues, Disqualified → SchoolStack.ai

## Key Files
- `shared/schema.ts` - Drizzle schema with `leads` table
- `server/routes.ts` - API routes with duplicate detection
- `server/storage.ts` - Database storage interface
- `client/src/components/sections/ScreeningFlow.tsx` - 5-step wizard
- `client/src/components/sections/EligibilityChecklist.tsx` - Interactive gate
- `client/src/components/sections/HowItWorks.tsx` - Visual timeline
- `client/src/components/sections/Hero.tsx` - Hero with two product cards
- `client/src/components/sections/LoanDetails.tsx` - Tabbed product details
- `client/src/components/sections/FAQ.tsx` - Comprehensive Q&A
- `client/src/index.css` - Theme variables

## Design
- Warm color palette: cream background, warm navy primary, golden orange secondary
- Rounded pill-shaped CTA buttons
- Professional fintech aesthetic

## Contact
- Allison Serafin: aserafin@bhope.org, (702) 539-9230 (Program Manager)
- Amy Bevilacqua: abevilacqua@bhope.org (President)
