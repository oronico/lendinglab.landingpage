import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Clock, Percent, FileText, ShoppingBag, XCircle, CreditCard, RefreshCw } from "lucide-react";

const termLoanDetails = [
  { icon: DollarSign, title: "Loan Range", value: "$10K–$50K in $10K increments" },
  { icon: Percent, title: "Interest Rate", value: "3–6% (determined during underwriting)" },
  { icon: DollarSign, title: "Origination Fee", value: "2% of loan amount" },
  { icon: Clock, title: "Loan Term", value: "3–5 years" },
  { icon: CreditCard, title: "Payments", value: "Quarterly" },
  { icon: CheckCircle2, title: "Prepayment", value: "No prepayment penalty" },
  { icon: FileText, title: "Security", value: "UCC-1 filing on pledged revenues and assets" },
  { icon: CheckCircle2, title: "Personal Guarantee", value: "May be required, dependent on credit profile" },
  { icon: CheckCircle2, title: "Credit Check", value: "Credit check performed during underwriting" },
];

const locDetails = [
  { icon: DollarSign, title: "Commitment", value: "Up to $100,000" },
  { icon: Percent, title: "Interest Rate", value: "3–6% on drawn balance, accrued daily" },
  { icon: DollarSign, title: "Origination Fee", value: "2% of commitment amount" },
  { icon: Clock, title: "Draw Period", value: "12 months" },
  { icon: Clock, title: "Maturity", value: "18–24 months total (or 12 months with renewal option)" },
  { icon: CreditCard, title: "Payments", value: "Monthly interest-only via ACH auto-debit" },
  { icon: RefreshCw, title: "Principal Repayment", value: "Repay anytime via ACH" },
  { icon: CheckCircle2, title: "Prepayment", value: "No prepayment penalty" },
  { icon: RefreshCw, title: "Clean-Up Requirement", value: "Balance must pay down to ≤10% of line for 30 consecutive days at least once every 12 months" },
  { icon: DollarSign, title: "Draw Mechanics", value: "Simple written request, funds via ACH credit, same-day or next-day" },
  { icon: FileText, title: "Security", value: "UCC-1 filing on pledged revenues and assets" },
  { icon: CheckCircle2, title: "Personal Guarantee", value: "May be required, dependent on credit profile" },
  { icon: CheckCircle2, title: "Credit Check", value: "Credit check performed during underwriting" },
  { icon: FileText, title: "Ongoing Controls", value: "Plaid connection (continuous), quarterly financial reporting, no additional debt without approval" },
];

const locRestrictions = [
  "No payroll catch-up",
  "No past-due rent",
  "No debt refinance",
  "No international work",
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
    "$2M/$1M general liability insurance (or proof of pursuit)",
    "Signed tuition contracts from enrolled families (specifying enrollment deposit)",
    "Proof that all enrolled families have paid the enrollment deposit per their signed contract",
    "5-year financial model",
    "School website URL",
    "Parent reference (currently enrolled)",
    "Board member reference (unrelated)",
  ],
  year2Plus: [
    "Most recent tax filings",
    "End-of-year balance sheet",
    "Profit & Loss statement",
    "Cash flow statement",
  ],
  year0: [
    "Personal financial statement from founder",
  ],
  nonprofit: [
    "IRS 501(c)(3) determination letter",
    "Signed board resolution letter (full board)",
    "Independent board member co-applicant (cannot be an employee, contractor, or related to the school leader)",
  ],
};

export function LoanDetails() {
  const [activeTab, setActiveTab] = useState<"term" | "loc">("term");

  return (
    <section id="loan-details" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-3" data-testid="text-loan-details-label">Loan Details</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6" data-testid="text-loan-details-title">Two Products Designed for Microschools</h3>
          <p className="text-lg text-muted-foreground" data-testid="text-loan-details-description">
            Choose the financing option that fits your school's needs — a term loan for growth investments or a revolving line of credit for cash flow management.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-border/50 shadow-sm overflow-hidden" data-testid="tabs-product-type">
            <button
              onClick={() => setActiveTab("term")}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === "term" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted/30"}`}
              data-testid="tab-term-loan"
            >
              Term Loan
            </button>
            <button
              onClick={() => setActiveTab("loc")}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === "loc" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted/30"}`}
              data-testid="tab-loc"
            >
              Revolving Line of Credit
            </button>
          </div>
        </div>

        {activeTab === "term" ? (
          <div className="grid lg:grid-cols-2 gap-8 mb-16" data-testid="section-term-loan">
            <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-white pb-6 border-b border-border/50">
                <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  Term Loan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 bg-white/50">
                {termLoanDetails.map((item) => (
                  <div className="flex gap-4" key={item.title}>
                    <div className="mt-1 flex-shrink-0 text-secondary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1" data-testid={`text-term-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{item.title}</h4>
                      <p className="text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
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
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-16" data-testid="section-loc">
            <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-white pb-6 border-b border-border/50">
                <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  Revolving Line of Credit
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 bg-white/50">
                <div className="bg-muted/30 rounded-lg p-4 mb-2">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Purpose:</strong> Designed for timing gaps and predictable seasonality — not for structural deficits.
                  </p>
                </div>
                {locDetails.map((item, idx) => (
                  <div className="flex gap-4" key={`${item.title}-${idx}`}>
                    <div className="mt-1 flex-shrink-0 text-secondary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1" data-testid={`text-loc-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`}>{item.title}</h4>
                      <p className="text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-white pb-6 border-b border-border/50">
                  <CardTitle className="text-2xl text-primary font-display flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <XCircle className="h-6 w-6 text-primary" />
                    </div>
                    LOC Use-of-Funds Restrictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 bg-white/50">
                  <ul className="space-y-3">
                    {locRestrictions.map((restriction) => (
                      <li key={restriction} className="flex items-center gap-3" data-testid={`text-restriction-${restriction.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <span className="text-muted-foreground">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4 bg-muted/30 rounded-lg p-3">
                    Optional: A reserve requirement (minimum cash reserve in a segregated account) may apply.
                  </p>
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
                      <h4 className="font-semibold text-lg mb-1">Leadership</h4>
                      <p className="text-muted-foreground">Founder background, character references, demonstrated commitment, and operational capacity.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Demand</h4>
                      <p className="text-muted-foreground">Signed tuition contracts, enrollment deposits, and clear community need.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Financials</h4>
                      <p className="text-muted-foreground">Plaid-verified bank data, financial model, revenue projections, and cash flow analysis.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">4</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Community / Mission</h4>
                      <p className="text-muted-foreground">School model alignment with community need, mission clarity, and fund values.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

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
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3" data-testid="text-docs-year2-label">Year 2+ Schools (Additional)</h4>
                <ul className="space-y-2">
                  {documentRequirements.year2Plus.map((doc) => (
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
