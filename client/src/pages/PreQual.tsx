import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Loader2, CalendarClock, CheckCircle2 } from "lucide-react";
import { RULES, checkDSR } from "@shared/rules";
import { CONTENT } from "@shared/content";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const ENTITY_TYPES = [
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "501c3", label: "501(c)(3) Nonprofit" },
];

const YEARS_OPTIONS = [
  { value: "0", label: "Year 0 (pre-launch)" },
  { value: "1", label: "Less than 1 year" },
  { value: "1-2", label: "1–2 years" },
  { value: "3+", label: "3+ years" },
];

const PRODUCT_OPTIONS = [
  { value: "term_loan", label: "Term Loan ($10K–$50K)" },
  { value: "loc", label: "Line of Credit (up to $100K)" },
  { value: "year0", label: "Year 0 Term Loan (pre-launch)" },
];

const REVENUE_RANGES = [
  { value: "under_50k", label: "Under $50,000", midpoint: 25000 },
  { value: "50k_100k", label: "$50,000 – $99,999", midpoint: 75000 },
  { value: "100k_250k", label: "$100,000 – $249,999", midpoint: 175000 },
  { value: "250k_500k", label: "$250,000 – $499,999", midpoint: 375000 },
  { value: "500k_plus", label: "$500,000+", midpoint: 500000 },
  { value: "pre_revenue", label: "Pre-revenue (Year 0)", midpoint: 0 },
];

const CREDIT_RANGES = [
  { value: "below_650", label: "Below 650" },
  { value: "650_699", label: "650 – 699" },
  { value: "700_749", label: "700 – 749" },
  { value: "750_plus", label: "750+" },
  { value: "unknown", label: "I don't know" },
];

const TERM_AMOUNTS = [10000, 20000, 30000, 40000, 50000];
const LOC_AMOUNTS = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

const TOTAL_STEPS = 5;

interface FormData {
  schoolName: string;
  state: string;
  yearsOperating: string;
  entityType: string;
  website: string;

  productType: string;
  amountRequested: number;
  termRequested: number;

  attQbo: boolean;
  attReconciled: boolean;
  attPayroll: boolean;
  attBankAccount: boolean;
  attNoCommingling: boolean;
  attBillsPaid: boolean;
  attContracts: boolean;
  attEnrollmentVerification: boolean;
  attBoardIndependence: boolean;
  attBoardResolution: boolean;

  revenueRange: string;
  creditRange: string;

  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;

  honeypot: string;
}

const initialFormData: FormData = {
  schoolName: "",
  state: "",
  yearsOperating: "",
  entityType: "",
  website: "",
  productType: "",
  amountRequested: 0,
  termRequested: 5,
  attQbo: false,
  attReconciled: false,
  attPayroll: false,
  attBankAccount: false,
  attNoCommingling: false,
  attBillsPaid: false,
  attContracts: false,
  attEnrollmentVerification: false,
  attBoardIndependence: false,
  attBoardResolution: false,
  revenueRange: "",
  creditRange: "",
  contactName: "",
  contactRole: "",
  contactEmail: "",
  contactPhone: "",
  honeypot: "",
};

function getRevenueMidpoint(range: string): number {
  return REVENUE_RANGES.find(r => r.value === range)?.midpoint ?? 0;
}

function getCreditMidpoint(range: string): number {
  const map: Record<string, number> = {
    below_650: 600,
    "650_699": 675,
    "700_749": 725,
    "750_plus": 775,
    unknown: 0,
  };
  return map[range] ?? 0;
}

export default function PreQual() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => new Date().toISOString());

  const submitLead = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", payload);
      return res.json();
    },
  });

  const update = useCallback((field: keyof FormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.schoolName.trim()) errs.schoolName = "School name is required";
      if (!form.state) errs.state = "State is required";
      if (!form.yearsOperating) errs.yearsOperating = "Please select years operating";
      if (!form.entityType) errs.entityType = "Entity type is required";
    } else if (s === 2) {
      if (!form.productType) errs.productType = "Please select a product";
      if (!form.amountRequested || form.amountRequested <= 0) errs.amountRequested = "Please select an amount";
      if ((form.productType === "term_loan" || form.productType === "year0") && !form.termRequested) errs.termRequested = "Please select a term";
    } else if (s === 3) {
      // no hard validation - all booleans default to false
    } else if (s === 4) {
      if (!form.revenueRange) errs.revenueRange = "Please select a revenue range";
      if (!form.creditRange) errs.creditRange = "Please select a credit score range";
    } else if (s === 5) {
      if (!form.contactName.trim()) errs.contactName = "Name is required";
      if (!form.contactEmail.trim()) errs.contactEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) errs.contactEmail = "Valid email is required";
      if (!form.contactPhone.trim()) errs.contactPhone = "Phone is required";
      else if (form.contactPhone.replace(/\D/g, "").length < 10) errs.contactPhone = "Valid phone number is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  }

  function back() {
    setStep(prev => Math.max(prev - 1, 1));
  }

  function runEvaluation(): { status: string; hardStops: string[]; flags: string[]; riskScore: number; dsrResult: string; suggestedAmount: number | null } {
    const hardStops: string[] = [];
    const flags: string[] = [];
    let riskScore = 100;

    if (!form.attBankAccount) {
      hardStops.push("No dedicated business bank account");
      riskScore -= 30;
    }
    if (!form.attNoCommingling) {
      hardStops.push("Personal and business funds are commingled");
      riskScore -= 25;
    }
    if (!form.attPayroll) {
      hardStops.push("No formal payroll system");
      riskScore -= 20;
    }
    if (!form.attContracts) {
      hardStops.push("No signed tuition contracts for all enrolled students");
      riskScore -= 20;
    }

    const isYear0 = form.productType === "year0" || form.yearsOperating === "0";
    const isLOC = form.productType === "loc";

    if (isLOC || (!isYear0 && form.yearsOperating !== "0")) {
      if (!form.attQbo) {
        hardStops.push("QuickBooks Online is required for operating schools and LOC applicants");
        riskScore -= 20;
      }
    }

    if (form.state && (RULES.EXCLUDED_STATES as readonly string[]).includes(form.state)) {
      hardStops.push(`The Lending Lab is not currently available in ${RULES.EXCLUDED_STATES_DISPLAY[form.state]} due to regulatory requirements`);
    }

    const creditScore = getCreditMidpoint(form.creditRange);
    if (creditScore > 0 && creditScore < RULES.FICO_PREFERRED) {
      flags.push("Credit score below 650 — additional review required");
      riskScore -= 10;
    }
    if (form.creditRange === "unknown") {
      flags.push("Credit score unknown — will be verified during underwriting");
      riskScore -= 5;
    }

    const revenueMidpoint = getRevenueMidpoint(form.revenueRange);

    if (isLOC && revenueMidpoint < RULES.LOC_MIN_ANNUAL_REVENUE && form.revenueRange !== "pre_revenue") {
      flags.push(`Revenue below $${(RULES.LOC_MIN_ANNUAL_REVENUE / 1000).toFixed(0)}K minimum for Line of Credit`);
      riskScore -= 10;
    }

    if (isLOC && form.yearsOperating === "0") {
      hardStops.push("Line of credit requires at least 12 months of operating history");
      riskScore -= 25;
    } else if (isLOC && form.yearsOperating === "1") {
      flags.push(`Less than ${RULES.LOC_MIN_MONTHS_OPERATING} months operating — LOC requires 12+ months`);
      riskScore -= 10;
    }

    if (!form.attReconciled) {
      flags.push("Books not reconciled through last closed month");
      riskScore -= 5;
    }
    if (!form.attBillsPaid) {
      flags.push("Past-due bills reported — review needed");
      riskScore -= 5;
    }
    if (!form.attEnrollmentVerification) {
      flags.push("Enrollment verification documentation not ready");
      riskScore -= 5;
    }
    if (isYear0 && !form.attQbo) {
      flags.push("Year 0: must adopt QuickBooks Online before closing");
    }

    const isNonprofit = form.entityType === "501c3";
    if (isNonprofit) {
      if (!form.attBoardIndependence) {
        hardStops.push(`Nonprofits must have an independent board of at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} members unrelated to the organization and staff`);
        riskScore -= 25;
      }
      if (!form.attBoardResolution) {
        hardStops.push("Nonprofits must have a board resolution approved by the full board authorizing the loan");
        riskScore -= 20;
      }
    }

    let dsrResult = "";
    let suggestedAmount: number | null = null;

    if (form.amountRequested > 0 && (form.productType === "term_loan" || form.productType === "year0")) {
      const termYears = form.termRequested || 5;
      const dsr = checkDSR(revenueMidpoint, form.amountRequested, termYears, isYear0);
      dsrResult = `DSR: ${(dsr.dsr * 100).toFixed(1)}% (cap: ${(dsr.cap * 100).toFixed(0)}%)`;

      if (!dsr.passes && revenueMidpoint > 0) {
        const maxSafe = dsr.suggestedMax;
        if (maxSafe < form.amountRequested) {
          flags.push(`Debt-service ratio exceeds ${(dsr.cap * 100).toFixed(0)}% cap. Your estimated annual payment would consume ${(dsr.dsr * 100).toFixed(1)}% of revenue. Consider requesting $${maxSafe.toLocaleString()} or less.`);
          suggestedAmount = maxSafe;
          riskScore -= 10;
        }
      }
    }

    riskScore = Math.max(0, Math.min(100, riskScore));

    let status = "qualified";
    if (hardStops.length > 0) status = "ineligible";
    else if (flags.length > 0) status = "flagged";

    return { status, hardStops, flags, riskScore, dsrResult, suggestedAmount };
  }

  async function handleSubmit() {
    if (!validateStep(5)) return;

    const { status, hardStops, flags, riskScore, dsrResult, suggestedAmount } = runEvaluation();

    const payload = {
      schoolName: form.schoolName,
      state: form.state,
      yearsOperating: form.yearsOperating,
      entityType: form.entityType,
      website: form.website || null,
      productType: form.productType,
      amountRequested: form.amountRequested,
      termRequested: (form.productType === "term_loan" || form.productType === "year0") ? form.termRequested : null,
      attQbo: form.attQbo,
      attReconciled: form.attReconciled,
      attPayroll: form.attPayroll,
      attBankAccount: form.attBankAccount,
      attNoCommingling: form.attNoCommingling,
      attBillsPaid: form.attBillsPaid,
      attContracts: form.attContracts,
      attEnrollmentVerification: form.attEnrollmentVerification,
      revenueRange: form.revenueRange,
      creditRange: form.creditRange,
      contactName: form.contactName,
      contactRole: form.contactRole || null,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      honeypot: form.honeypot,
      flags: flags.length > 0 ? flags : null,
      hardStops: hardStops.length > 0 ? hardStops : null,
      status,
      riskScore,
      dsrResult: dsrResult || null,
      suggestedAmount,
      applicationStartedAt: startedAt,
    };

    let leadId = "";
    try {
      const result = await submitLead.mutateAsync(payload);
      leadId = result.id || "";
    } catch {
      // submission may fail but still route to outcome
    }

    if (status === "ineligible") {
      navigate(`/outcome/ineligible?reasons=${encodeURIComponent(hardStops.join("|"))}`);
    } else if (status === "flagged") {
      navigate(`/outcome/flagged?flags=${encodeURIComponent(flags.join("|"))}&leadId=${leadId}`);
    } else {
      navigate(`/outcome/qualified?product=${form.productType}&leadId=${leadId}`);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;
  const isTermOrYear0 = form.productType === "term_loan" || form.productType === "year0";
  const amounts = form.productType === "loc" ? LOC_AMOUNTS : TERM_AMOUNTS;

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSchool, setWaitlistSchool] = useState("");
  const [waitlistProduct, setWaitlistProduct] = useState("");
  const [waitlistHoneypot, setWaitlistHoneypot] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");

  const submitWaitlist = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/waitlist", payload);
      return res.json();
    },
  });

  async function handleWaitlistSubmit() {
    setWaitlistError("");
    if (!waitlistEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail)) {
      setWaitlistError("Please enter a valid email address");
      return;
    }
    if (!waitlistSchool.trim()) {
      setWaitlistError("Please enter your school name");
      return;
    }
    try {
      await submitWaitlist.mutateAsync({
        email: waitlistEmail,
        schoolName: waitlistSchool,
        productInterest: waitlistProduct || null,
        honeypot: waitlistHoneypot,
      });
      setWaitlistSubmitted(true);
    } catch {
      setWaitlistError("Something went wrong. Please try again.");
    }
  }

  if (!RULES.APPLICATIONS_OPEN) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
            <Card className="shadow-lg border-0" data-testid="screen-waitlist">
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <CalendarClock className="w-8 h-8 text-secondary" />
                </div>
                <h1 className="text-2xl font-display font-bold text-primary">Applications Open {RULES.APPLICATIONS_OPEN_DATE}</h1>
                <p className="text-muted-foreground">
                  Cycle {RULES.CYCLE} applications are not yet open. Join the waitlist and we'll notify you when you can apply.
                </p>

                {waitlistSubmitted ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">You're on the list. We'll be in touch.</span>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div>
                      <Label htmlFor="wl-school">School name *</Label>
                      <Input id="wl-school" data-testid="input-waitlist-school" value={waitlistSchool} onChange={e => setWaitlistSchool(e.target.value)} placeholder="Your school's name" />
                    </div>
                    <div>
                      <Label htmlFor="wl-email">Email *</Label>
                      <Input id="wl-email" data-testid="input-waitlist-email" type="email" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} placeholder="you@school.org" />
                    </div>
                    <div>
                      <Label htmlFor="wl-product">Interested in</Label>
                      <Select value={waitlistProduct} onValueChange={setWaitlistProduct}>
                        <SelectTrigger data-testid="select-waitlist-product"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="term_loan">Term Loan</SelectItem>
                          <SelectItem value="loc">Line of Credit</SelectItem>
                          <SelectItem value="year0">Year 0 Term Loan</SelectItem>
                          <SelectItem value="unsure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sr-only" aria-hidden="true">
                      <Label htmlFor="wl-hp">Leave blank</Label>
                      <Input id="wl-hp" value={waitlistHoneypot} onChange={e => setWaitlistHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                    </div>
                    {waitlistError && <p className="text-xs text-destructive">{waitlistError}</p>}
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-12" data-testid="button-join-waitlist" onClick={handleWaitlistSubmit} disabled={submitWaitlist.isPending}>
                      {submitWaitlist.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Join Waitlist
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {step} of {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden" data-testid="progress-bar">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-8 pb-8 space-y-6">
              {step === 1 && (
                <div className="space-y-6" data-testid="step-school">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">About Your School</h2>
                    <p className="text-sm text-muted-foreground mt-1">Basic information about your school.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">School name *</Label>
                      <Input
                        id="schoolName"
                        data-testid="input-school-name"
                        value={form.schoolName}
                        onChange={e => update("schoolName", e.target.value)}
                        placeholder="Your school's legal name"
                      />
                      {errors.schoolName && <p className="text-xs text-destructive mt-1">{errors.schoolName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={form.state} onValueChange={v => update("state", v)}>
                          <SelectTrigger data-testid="select-state"><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>
                            {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <Label htmlFor="yearsOperating">Years operating *</Label>
                        <Select value={form.yearsOperating} onValueChange={v => {
                          update("yearsOperating", v);
                          if (v === "0" && form.productType === "loc") {
                            update("productType", "");
                            update("amountRequested", 0);
                          }
                        }}>
                          <SelectTrigger data-testid="select-years"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {YEARS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.yearsOperating && <p className="text-xs text-destructive mt-1">{errors.yearsOperating}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="entityType">Legal entity type *</Label>
                      <Select value={form.entityType} onValueChange={v => update("entityType", v)}>
                        <SelectTrigger data-testid="select-entity"><SelectValue placeholder="Select entity type" /></SelectTrigger>
                        <SelectContent>
                          {ENTITY_TYPES.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.entityType && <p className="text-xs text-destructive mt-1">{errors.entityType}</p>}
                    </div>

                    <div>
                      <Label htmlFor="website">Website (optional)</Label>
                      <Input
                        id="website"
                        data-testid="input-website"
                        value={form.website}
                        onChange={e => update("website", e.target.value)}
                        placeholder="https://yourschool.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6" data-testid="step-product">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">Product Selection</h2>
                    <p className="text-sm text-muted-foreground mt-1">What type of financing are you looking for?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Product type *</Label>
                      <div className="grid gap-3 mt-2">
                        {PRODUCT_OPTIONS.map(opt => {
                          const isLocDisabled = opt.value === "loc" && form.yearsOperating === "0";
                          return (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                              isLocDisabled
                                ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
                                : form.productType === opt.value
                                  ? "border-secondary bg-secondary/5 cursor-pointer"
                                  : "border-border hover:border-secondary/30 cursor-pointer"
                            }`}
                            data-testid={`option-product-${opt.value}`}
                          >
                            <input
                              type="radio"
                              name="productType"
                              value={opt.value}
                              checked={form.productType === opt.value}
                              disabled={isLocDisabled}
                              onChange={() => {
                                if (!isLocDisabled) {
                                  update("productType", opt.value);
                                  update("amountRequested", 0);
                                }
                              }}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              form.productType === opt.value ? "border-secondary" : "border-muted-foreground"
                            }`}>
                              {form.productType === opt.value && <div className="w-2 h-2 rounded-full bg-secondary" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{opt.label}</span>
                              {isLocDisabled && (
                                <span className="text-xs text-muted-foreground">Requires 12+ months operating history</span>
                              )}
                            </div>
                          </label>
                          );
                        })}
                      </div>
                      {errors.productType && <p className="text-xs text-destructive mt-1">{errors.productType}</p>}
                    </div>

                    {form.productType && (
                      <div>
                        <Label>Amount requested *</Label>
                        <Select value={form.amountRequested ? String(form.amountRequested) : ""} onValueChange={v => update("amountRequested", Number(v))}>
                          <SelectTrigger data-testid="select-amount"><SelectValue placeholder="Select amount" /></SelectTrigger>
                          <SelectContent>
                            {amounts.map(a => (
                              <SelectItem key={a} value={String(a)}>${a.toLocaleString()}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.amountRequested && <p className="text-xs text-destructive mt-1">{errors.amountRequested}</p>}
                      </div>
                    )}

                    {isTermOrYear0 && (
                      <div>
                        <Label>Loan term *</Label>
                        <Select value={String(form.termRequested)} onValueChange={v => update("termRequested", Number(v))}>
                          <SelectTrigger data-testid="select-term"><SelectValue placeholder="Select term" /></SelectTrigger>
                          <SelectContent>
                            {RULES.TERM_YEARS.map(y => (
                              <SelectItem key={y} value={String(y)}>{y} years</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.termRequested && <p className="text-xs text-destructive mt-1">{errors.termRequested}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6" data-testid="step-attestations">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">Attestations</h2>
                    <p className="text-sm text-muted-foreground mt-1">Confirm the following about your school. Check all that apply.</p>
                  </div>

                  <div className="space-y-3">
                    {(Object.keys(CONTENT.attestationLabels) as Array<keyof typeof CONTENT.attestationLabels>).map(key => {
                      const fieldMap: Record<string, keyof FormData> = {
                        qbo: "attQbo",
                        reconciled: "attReconciled",
                        payroll: "attPayroll",
                        bankAccount: "attBankAccount",
                        noCommingling: "attNoCommingling",
                        billsPaid: "attBillsPaid",
                        contracts: "attContracts",
                        enrollmentVerification: "attEnrollmentVerification",
                      };
                      const field = fieldMap[key];
                      return (
                        <label
                          key={key}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-secondary/30 cursor-pointer transition-colors"
                          data-testid={`attestation-${key}`}
                        >
                          <Checkbox
                            checked={form[field] as boolean}
                            onCheckedChange={v => update(field, !!v)}
                            className="mt-0.5"
                          />
                          <span className="text-sm">{CONTENT.attestationLabels[key]}</span>
                        </label>
                      );
                    })}

                    {form.entityType === "501c3" && (
                      <>
                        <div className="pt-2 pb-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nonprofit Requirements</p>
                        </div>
                        {(Object.keys(CONTENT.nonprofitAttestationLabels) as Array<keyof typeof CONTENT.nonprofitAttestationLabels>).map(key => {
                          const fieldMap: Record<string, keyof FormData> = {
                            boardIndependence: "attBoardIndependence",
                            boardResolution: "attBoardResolution",
                          };
                          const field = fieldMap[key];
                          return (
                            <label
                              key={key}
                              className="flex items-start gap-3 p-3 rounded-lg border border-secondary/30 bg-secondary/5 hover:border-secondary/50 cursor-pointer transition-colors"
                              data-testid={`attestation-nonprofit-${key}`}
                            >
                              <Checkbox
                                checked={form[field] as boolean}
                                onCheckedChange={v => update(field, !!v)}
                                className="mt-0.5"
                              />
                              <span className="text-sm">{CONTENT.nonprofitAttestationLabels[key]}</span>
                            </label>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6" data-testid="step-capacity">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">Financial Capacity</h2>
                    <p className="text-sm text-muted-foreground mt-1">We use ranges — we do not collect your SSN or exact figures.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Annual business revenue (tuition + fees) *</Label>
                      <Select value={form.revenueRange} onValueChange={v => update("revenueRange", v)}>
                        <SelectTrigger data-testid="select-revenue"><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent>
                          {REVENUE_RANGES.map(r => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.revenueRange && <p className="text-xs text-destructive mt-1">{errors.revenueRange}</p>}
                    </div>

                    <div>
                      <Label>Personal credit score range *</Label>
                      <Select value={form.creditRange} onValueChange={v => update("creditRange", v)}>
                        <SelectTrigger data-testid="select-credit"><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent>
                          {CREDIT_RANGES.map(c => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">We do NOT pull your credit or collect your SSN.</p>
                      {errors.creditRange && <p className="text-xs text-destructive mt-1">{errors.creditRange}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6" data-testid="step-contact">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">Contact Information</h2>
                    <p className="text-sm text-muted-foreground mt-1">How can we reach you about your application?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contactName">Full name *</Label>
                      <Input
                        id="contactName"
                        data-testid="input-contact-name"
                        value={form.contactName}
                        onChange={e => update("contactName", e.target.value)}
                        placeholder="First and last name"
                      />
                      {errors.contactName && <p className="text-xs text-destructive mt-1">{errors.contactName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contactRole">Role (optional)</Label>
                      <Input
                        id="contactRole"
                        data-testid="input-contact-role"
                        value={form.contactRole}
                        onChange={e => update("contactRole", e.target.value)}
                        placeholder="e.g. Founder, Executive Director"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        data-testid="input-contact-email"
                        type="email"
                        value={form.contactEmail}
                        onChange={e => update("contactEmail", e.target.value)}
                        placeholder="you@yourschool.com"
                      />
                      {errors.contactEmail && <p className="text-xs text-destructive mt-1">{errors.contactEmail}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Phone *</Label>
                      <Input
                        id="contactPhone"
                        data-testid="input-contact-phone"
                        type="tel"
                        value={form.contactPhone}
                        onChange={e => update("contactPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                      {errors.contactPhone && <p className="text-xs text-destructive mt-1">{errors.contactPhone}</p>}
                    </div>

                    <div className="sr-only" aria-hidden="true">
                      <Label htmlFor="honeypot">Leave this blank</Label>
                      <Input
                        id="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.honeypot}
                        onChange={e => update("honeypot", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold">One pre-qualification per school. Duplicate submissions will be flagged for review.</p>
                    {CONTENT.disclaimers.map((d, i) => (
                      <p key={i}>• {d}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                {step > 1 ? (
                  <Button variant="outline" onClick={back} className="rounded-full" data-testid="button-back">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < TOTAL_STEPS ? (
                  <Button onClick={next} className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 font-bold" data-testid="button-next">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitLead.isPending}
                    className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 font-bold"
                    data-testid="button-submit"
                  >
                    {submitLead.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      <>Submit <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
