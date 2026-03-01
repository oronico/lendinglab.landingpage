import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Clock, Percent, FileText, ShoppingBag } from "lucide-react";

const paymentSchedule = [
  { amount: "$5,000", term: "3 years", y1: "$37.50/qtr", y2: "$341.89/qtr", y3: "$959.90/qtr" },
  { amount: "$10,000", term: "3 years", y1: "$75.00/qtr", y2: "$683.78/qtr", y3: "$1,919.80/qtr" },
  { amount: "$15,000", term: "4 years", y1: "$112.50/qtr", y2: "$712.14/qtr", y3: "$1,625.30/qtr" },
  { amount: "$20,000", term: "4 years", y1: "$150.00/qtr", y2: "$949.51/qtr", y3: "$2,167.07/qtr" },
  { amount: "$25,000", term: "4 years", y1: "$187.50/qtr", y2: "$1,186.89/qtr", y3: "$2,708.84/qtr" },
  { amount: "$30,000", term: "5 years", y1: "$225.00/qtr", y2: "$1,110.88/qtr", y3: "$2,310.15/qtr" },
  { amount: "$35,000", term: "5 years", y1: "$262.50/qtr", y2: "$1,296.03/qtr", y3: "$2,695.18/qtr" },
  { amount: "$40,000", term: "5 years", y1: "$300.00/qtr", y2: "$1,481.18/qtr", y3: "$3,080.21/qtr" },
  { amount: "$45,000", term: "5 years", y1: "$337.50/qtr", y2: "$1,666.32/qtr", y3: "$3,465.23/qtr" },
  { amount: "$50,000", term: "5 years", y1: "$375.00/qtr", y2: "$1,851.47/qtr", y3: "$3,850.26/qtr" },
];

const usesOfFunds = [
  "Facility Improvements",
  "Furniture & Fixtures",
  "Curriculum & Materials",
  "Supplies",
  "Marketing & Outreach",
  "Licensing & Permits",
  "Rent",
  "Salaries & Stipends",
  "Training & Professional Development",
  "Other",
];

const documentRequirements = {
  all: [
    "Articles of incorporation / operating agreement",
    "Active EIN documentation",
    "General liability insurance (or proof of pursuit)",
    "Signed tuition contracts from enrolled families",
    "5-year financial model",
    "School website URL",
    "Parent reference (currently enrolled)",
    "Board member reference (unrelated)",
  ],
  year1Plus: [
    "Balance sheet",
    "Profit & Loss statement",
    "Cash flow forecast",
    "Year-to-date financials",
    "Most recent tax return",
  ],
  year0: [
    "Personal financial statement from founder",
    "$25+ enrollment deposits from at least 10 families",
  ],
  nonprofit: [
    "IRS 501(c)(3) determination letter",
    "Signed board resolution letter (full board)",
    "Board member co-applicant information",
  ],
};

export function LoanDetails() {
  return (
    <section id="loan-details" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-3" data-testid="text-loan-details-label">Loan Details</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6" data-testid="text-loan-details-title">Patient Capital for Your School</h3>
          <p className="text-lg text-muted-foreground" data-testid="text-loan-details-description">
            Our loan product is designed to meet you where you are, with terms that traditional lenders simply can't offer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6 border-b border-border/50">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                Loan Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8 bg-white/50">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-loan-range-title">Loan Range</h4>
                  <p className="text-muted-foreground" data-testid="text-loan-range-value">$5K–$50K in $5K increments (Year 0 schools capped at $25K)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-rate-title">3% Fixed Interest</h4>
                  <p className="text-muted-foreground" data-testid="text-rate-value">Enabled by philanthropic capital. Zero origination fees. No prepayment penalties.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-repayment-title">Graduated Repayment</h4>
                  <p className="text-muted-foreground" data-testid="text-repayment-value">
                    <strong className="text-foreground">Year 1:</strong> Interest-only while enrollment stabilizes<br/>
                    <strong className="text-foreground">Year 2:</strong> Partial payments, graduated ramp<br/>
                    <strong className="text-foreground">Years 3+:</strong> Full amortization
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-terms-title">Borrower-Friendly Terms</h4>
                  <p className="text-muted-foreground" data-testid="text-terms-value">No personal guarantee. No credit check. Loan terms scale by amount: $5–10K = 3 years, $15–25K = 4 years, $30–50K = 5 years. Quarterly ACH payments via Plaid.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6 border-b border-border/50">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                Underwriting Rubric
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8 bg-white/50">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-rubric-leadership">Leadership</h4>
                  <p className="text-muted-foreground">Founder background, character references, demonstrated commitment, and operational capacity to run the school.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-rubric-demand">Demand</h4>
                  <p className="text-muted-foreground">Evidence of family interest through signed tuition contracts, enrollment deposits, waitlists, and clear community need.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-rubric-financials">Financials</h4>
                  <p className="text-muted-foreground">Plaid-verified bank data, QuickBooks Online records, 5-year financial model, revenue projections, and cash flow analysis.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">4</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" data-testid="text-rubric-community">Community / Mission</h4>
                  <p className="text-muted-foreground">School model alignment with community need, mission clarity, and Building Hope Impact Fund values.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-primary text-center mb-8" data-testid="text-payment-schedule-title">Quarterly Payment Schedule</h3>
          <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-lg">
            <table className="w-full text-sm" data-testid="table-payment-schedule">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-semibold">Loan Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Term</th>
                  <th className="px-4 py-3 text-left font-semibold">Year 1 Payment</th>
                  <th className="px-4 py-3 text-left font-semibold">Year 2 Payment</th>
                  <th className="px-4 py-3 text-left font-semibold">Years 3+ Payment</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((row, index) => (
                  <tr
                    key={row.amount}
                    className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}
                    data-testid={`row-payment-${index}`}
                  >
                    <td className="px-4 py-3 font-semibold text-primary">{row.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.term}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.y1}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.y2}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.y3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4" data-testid="text-payment-note">
            All payments are quarterly. Year 1 is interest-only. Year 2 begins graduated principal repayment. Years 3+ are fully amortized.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6 border-b border-border/50">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                Approved Uses of Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 bg-white/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usesOfFunds.map((use) => (
                  <div key={use} className="flex items-center gap-2" data-testid={`text-use-${use.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{use}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6 border-b border-border/50">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                Document Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 bg-white/50 space-y-6">
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3" data-testid="text-docs-all-label">All Applicants</h4>
                <ul className="space-y-2">
                  {documentRequirements.all.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3" data-testid="text-docs-year1-label">Year 1+ Schools (Additional)</h4>
                <ul className="space-y-2">
                  {documentRequirements.year1Plus.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3" data-testid="text-docs-year0-label">Year 0 Schools (Additional)</h4>
                <ul className="space-y-2">
                  {documentRequirements.year0.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3" data-testid="text-docs-nonprofit-label">Nonprofits (Additional)</h4>
                <ul className="space-y-2">
                  {documentRequirements.nonprofit.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
