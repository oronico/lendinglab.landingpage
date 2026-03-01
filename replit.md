# The Lending Lab - Building Hope Impact Fund

## Overview
Professional marketing website for Building Hope Impact Fund's "Lending Lab" microloan program ($5K-$50K) for microschool founders nationwide. Features a rigorous multi-step eligibility checklist, verification-oriented pre-qualification screener with automated consistency checks, and database-backed lead management. Designed to minimize wasted work for the one-person operator (Allison Serafin).

## Architecture
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui components, wouter routing, TanStack Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Outfit (display) + Plus Jakarta Sans (body)

## Page Structure (in order)
1. **Hero** - Stats, value prop ($5K-$50K, 3% fixed, no fees, no PG, no credit check)
2. **Eligibility Checklist** - Interactive self-screen gate with Year 0/1+ and nonprofit toggles; blocks wizard entry
3. **Screening Flow** - 5-step verification wizard (Contact → Enrollment → Facility → Financial Discipline → Loan Request)
4. **How It Works** - Visual 5-step timeline (Self-Screen → Pre-Qualify → Prepare → Apply → Underwriting & Funding)
5. **Loan Details** - Corrected terms, full payment schedule table (all 10 amounts), underwriting rubric, approved uses of funds
6. **FAQ** - 20 real Q&A across 10 categories

## Data Model
- `leads` table: Comprehensive lead storage with 60+ fields covering contact, school info, enrollment, facility, financial discipline, loan request, references, automated flags, and qualification status

## Screening Logic
- **Eligibility Checklist**: ~20 items, conditionally shown based on Year 0/1+ and entity type. Must confirm all to proceed.
- **Screener Wizard**: 5 steps collecting verifiable specifics (numbers, dates, names — not yes/no)
- **Revenue Calculator**: Inline tuition × contracts = calculated revenue, auto-compared to stated revenue
- **Automated Flags**: Revenue math, deposit gap, loan-to-revenue ratio, email/website mismatch, duplicate detection, payroll red flag, commingled funds, lease expiry, board independence
- **Year 0 Track**: Max $25K, personal financial statement required, no tax return/P&L/YTD required
- **Early Stops**: <10 deposits (Year 0/1), no facility, residential dwelling, no financial model
- **Result Screens**: Qualified (document checklist + JotForm link), Flagged (issues shown, can proceed), Disqualified (reasons + SchoolStack.ai link)

## Key Requirements (Cycle 2)
- 3% fixed interest, zero fees, no personal guarantee, no credit check
- $5K-$50K in $5K increments (Year 0 cap: $25K)
- QuickBooks Online required for all borrowers
- Plaid mandatory
- All staff paid via formal payroll (no Venmo/Zelle/Cash)
- No commingling of personal/business funds
- Nonprofits: board resolution + co-applicant + majority independence
- References: one enrolled parent + one unrelated board member
- Year 1+ must provide: Balance sheet, P&L, Cash forecast, YTD, Tax return

## Loan Terms
- $5-10K = 3 year term, $15-25K = 4 year term, $30-50K = 5 year term
- Year 1: Interest-only, Year 2: Partial P+I, Years 3+: Full amortization
- Quarterly payments via ACH (first payment Oct 1)

## Key Files
- `shared/schema.ts` - Drizzle schema with `leads` table (60+ fields)
- `server/routes.ts` - API routes with duplicate detection
- `server/storage.ts` - Database storage interface with findDuplicates
- `client/src/components/sections/ScreeningFlow.tsx` - 5-step verification wizard with automated checks
- `client/src/components/sections/EligibilityChecklist.tsx` - Interactive gate checklist
- `client/src/components/sections/HowItWorks.tsx` - Visual timeline
- `client/src/components/sections/Hero.tsx` - Hero with accurate stats
- `client/src/components/sections/LoanDetails.tsx` - Corrected terms + payment table
- `client/src/components/sections/FAQ.tsx` - 20 Q&A
- `client/src/index.css` - Theme variables

## Design
- Warm color palette: cream background, warm navy primary, golden orange secondary
- Rounded pill-shaped CTA buttons
- Professional fintech aesthetic

## Contact
- Allison Serafin: aserafin@bhope.org, (702) 539-9230 (Program Manager)
- Amy Bevilacqua: abevilacqua@bhope.org (President)
