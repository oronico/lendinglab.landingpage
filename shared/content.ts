import { RULES } from "./rules";

export const CONTENT = {
  meta: {
    title: "The Lending Lab | Cycle 2",
    description: "Capital for schools that run like a business. Term loans up to $50K and lines of credit up to $100K for microschool founders.",
  },
  hero: {
    badge: `Powered by ${RULES.PHILANTHROPY.partners.join(" & ")}`,
    headline: "Capital for schools that run like a business.",
    subhead: `Cycle 2: Building a $${(RULES.FUND_TARGET / 1000000).toFixed(0)}M fund. Term loans and revolving lines of credit for microschool founders who demonstrate financial discipline.`,
    cta1: "Check Eligibility",
    cta2: "Pre-qualify in 3 minutes",
  },
  products: {
    termLoan: {
      title: "Term Loan",
      specs: [
        ["Amount", "$10,000 – $50,000"],
        ["Term", "4 – 6 years"],
        ["Rate", `Prime – 1% (currently ${(RULES.CURRENT_RATE * 100).toFixed(2)}%)`],
        ["Payments", "Quarterly"],
        ["Origination", "2% (added to principal)"],
        ["Security", "UCC-1 on revenues & assets"],
        ["Credit", "FICO 650+ preferred (575 min for Year 0)"],
      ],
      typicalUse: "Facility build-out, furniture, curriculum, marketing, licensing",
    },
    loc: {
      title: "Line of Credit",
      specs: [
        ["Commitment", "Up to $100,000"],
        ["Draw period", "12 months"],
        ["Payments", "Monthly interest-only"],
        ["Rate", `Prime – 1% on drawn balance`],
        ["Origination", "2%"],
        ["Security", "UCC-1 on revenues & assets"],
        ["Requires", "12+ months operating, $100K+ revenue, FICO 650+"],
      ],
      typicalUse: "Seasonal cash flow gaps, bridge timing between tuition collections",
    },
  },
  goodFit: [
    "You run your school like a business — separate bank account, formal payroll, reconciled books.",
    "You have signed tuition contracts and can prove real enrollment demand.",
    "You use (or will adopt) QuickBooks Online and are ready to connect Plaid.",
  ],
  notAFit: [
    "You mix personal and school money or pay staff through Venmo / Cash App.",
    "You don't have tuition contracts or can't verify enrollment.",
    "You're looking for a grant — this is a loan with underwriting and repayment.",
  ],
  hardGates: [
    "Dedicated business bank account (no commingling)",
    "QuickBooks Online (or adopt before closing for Year 0)",
    "Formal payroll system (no Venmo / Zelle / cash)",
    "Signed tuition contracts for all enrolled students",
    "Legal business registration in good standing",
    "Bills and rent paid on time",
  ],
  nonprofitRequirements: [
    `Independent board of at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} people unrelated to the organization and staff`,
    "Board resolution approved by the entire board and documented in minutes authorizing the school to pursue a loan for the stated amount",
  ],
  howItWorks: [
    { step: 1, title: "Eligibility Screen", desc: "Confirm your school meets basic requirements.", time: "2 min" },
    { step: 2, title: "Pre-Qualification", desc: "Answer a short questionnaire to get an initial decision.", time: "3 min" },
    { step: 3, title: "Full Application", desc: "Complete the application on JotForm with document uploads.", time: "~60 min" },
    { step: 4, title: "Underwriting", desc: "We verify references, review financials, and schedule an interview.", time: "2–4 weeks" },
    { step: 5, title: "Closing & Funding", desc: "Sign your loan agreement and receive funds via ACH.", time: "1 week" },
  ],
  faq: [
    {
      q: "Do you fund Year 0 schools?",
      a: "Yes. Year 0 schools are eligible for term loans with a personal guarantee. Loan size is limited by your ability-to-repay based on projected revenue.",
    },
    {
      q: "Do you count donations as revenue?",
      a: "No. We only count earned revenue from tuition and fees. Philanthropic donations are excluded from repayment capacity calculations.",
    },
    {
      q: "What counts as 'enrolled'?",
      a: "A student is enrolled when a family has signed a tuition contract. We do not count handbooks, verbal commitments, or waitlists.",
    },
    {
      q: "What happens if I'm not eligible?",
      a: "You'll see exactly what needs to change. Most schools can reapply after addressing the gap — often within one enrollment cycle.",
    },
    {
      q: "How long does underwriting take?",
      a: "Typically 2–4 weeks from complete application submission, depending on reference and document verification timelines.",
    },
  ],
  disclaimers: [
    "Completing this screening is not a loan approval or commitment.",
    "Final underwriting includes documentation review and verification.",
    "We do not count philanthropic donations toward repayment capacity.",
  ],
  attestationLabels: {
    qbo: "We use QuickBooks Online (or will adopt before closing)",
    reconciled: "Our books are reconciled through the last closed month",
    payroll: "We use a formal payroll provider (not Venmo / Zelle / cash)",
    bankAccount: "We have a dedicated business bank account",
    noCommingling: "Personal and business funds are completely separate",
    billsPaid: "All bills, rent, and utilities are paid on time",
    contracts: "We have signed tuition contracts for every enrolled student",
    enrollmentVerification: "We can provide enrollment verification documentation",
  },
  nonprofitAttestationLabels: {
    boardIndependence: `Our board has at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} independent members unrelated to the organization and staff`,
    boardResolution: "Our board has approved a resolution authorizing the school to pursue this loan, documented in meeting minutes",
  },
} as const;
