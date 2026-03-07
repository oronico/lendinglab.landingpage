export const RULES = {
  CURRENT_RATE: 0.05,
  RATE_DISPLAY: "5–6%",
  ORIGINATION_FEE: 0.02,

  TERM_LOAN_MIN: 10000,
  TERM_LOAN_MAX: 50000,
  TERM_LOAN_INCREMENT: 10000,
  TERM_YEARS: [4, 5, 6] as const,

  LOC_MAX: 50000,
  LOC_MIN_MONTHS_OPERATING: 12,
  LOC_MIN_ANNUAL_REVENUE: 100000,

  FICO_PREFERRED: 650,

  EXCLUDED_STATES: ["CA", "HI", "ND"] as readonly string[],
  EXCLUDED_STATES_DISPLAY: { CA: "California", HI: "Hawaii", ND: "North Dakota" } as Record<string, string>,

  DSR_CAP_YEAR0: 0.10,
  DSR_CAP_OPERATING: 0.14,

  HOME_BASED_ALLOWED: true,
  QBO_HARD_STOP_LOC: true,
  QBO_HARD_STOP_OPERATING: true,
  QBO_YEAR0_ADOPT_BEFORE_CLOSING: true,

  YEAR0_REQUIRES_PG: true,
  YEAR0_MAX_LOAN: 50000,

  NONPROFIT_MIN_BOARD_SIZE: 4,
  NONPROFIT_BOARD_MUST_BE_INDEPENDENT: true,
  NONPROFIT_REQUIRES_BOARD_RESOLUTION: true,

  FUND_TARGET: 1000000,
  DEPLOY_AMOUNT: 450000,
  FUNDRAISE_GOAL: 650000,
  CYCLE: 2,
  CYCLE1_DEPLOYED: 410000,
  CYCLE1_SCHOOLS: 11,
  CYCLE1_STATES: 8,
  CYCLE1_REPAYMENT_RATE: 100,

  CONTACT: {
    name: "Allison Serafin",
    title: "Program Director",
    email: "help@lendinglab.org",
  },
  PHILANTHROPY: {
    fund: "Building Hope Impact Fund",
    partners: ["Stand Together Trust", "The Beth & Ravenel Curry Foundation"],
  },

  US_ONLY: true,

  APPLICATIONS_OPEN: false,
  APPLICATIONS_OPEN_DATE: "May 6, 2026",
  APPLICATIONS_CLOSE_DATE: "November 6, 2026",
  APPLICATIONS_CLOSE_NOTE: "or until Cycle 2 is 100% deployed",
  // ── LoanOS Handoff URLs ──────────────────────────────────────────────
  // When LoanOS is ready, set these to the LoanOS application intake URLs.
  // Expected format:
  //   HANDOFF_URL_QUALIFIED: "https://loanos.example.com/intake/qualified"
  //   HANDOFF_URL_FLAGGED:   "https://loanos.example.com/intake/flagged"
  //
  // The outcome pages (OutcomeQualified / OutcomeFlagged) will redirect to
  // these URLs with the following query parameters appended:
  //   ?leadId={leadId}&product={productType}
  //
  // Example full redirect URL:
  //   https://loanos.example.com/intake/qualified?leadId=abc123&product=term_loan
  //
  // While these remain empty strings, the outcome pages display a
  // "coming soon" message instead of redirecting — this is the correct
  // pre-launch behavior.
  // ─────────────────────────────────────────────────────────────────────
  HANDOFF_URL_QUALIFIED: "",
  HANDOFF_URL_FLAGGED: "",
} as const;

export function computeAnnualPayment(principal: number, rate: number, termYears: number): number {
  const n = termYears;
  if (rate === 0) return principal / n;
  const annualPayment = (principal * rate) / (1 - Math.pow(1 + rate, -n));
  return Math.round(annualPayment);
}

export function checkDSR(
  annualRevenue: number,
  loanAmount: number,
  termYears: number,
  isYear0: boolean
): { passes: boolean; dsr: number; cap: number; annualPayment: number; suggestedMax: number } {
  const rate = RULES.CURRENT_RATE;
  const totalPrincipal = loanAmount * (1 + RULES.ORIGINATION_FEE);
  const annualPayment = computeAnnualPayment(totalPrincipal, rate, termYears);
  const cap = isYear0 ? RULES.DSR_CAP_YEAR0 : RULES.DSR_CAP_OPERATING;
  const dsr = annualRevenue > 0 ? annualPayment / annualRevenue : 1;
  const maxAnnualPayment = annualRevenue * cap;
  const suggestedMax = maxAnnualPayment > 0
    ? Math.floor((maxAnnualPayment * (1 - Math.pow(1 + rate, -termYears))) / rate / RULES.TERM_LOAN_INCREMENT) * RULES.TERM_LOAN_INCREMENT
    : 0;

  return { passes: dsr <= cap, dsr, cap, annualPayment, suggestedMax: Math.min(suggestedMax, RULES.TERM_LOAN_MAX) };
}

export type EligibilityOutcome = "qualified" | "flagged" | "ineligible";

export interface EligibilityResult {
  outcome: EligibilityOutcome;
  hardStops: string[];
  flags: string[];
  riskScore: number;
}
