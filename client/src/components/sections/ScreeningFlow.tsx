import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Building2, School, Loader2,
  AlertTriangle, XCircle, FileText, ExternalLink, Calculator, Users, Home, DollarSign
} from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const NETWORK_AFFILIATIONS = [
  "4.0","Acton","Agile Learning Centers","Ambleside Schools International","Apogee Strong",
  "ASU Microschool Fellowship","Black Microschools of Atlanta","Changemaker Microschools",
  "Chesterton Academies","Colossal Academy","The Drexel Fund","EdChoice","Embark Mississippi",
  "Excel","Fuel OKC","Getting Smart","Herzog Foundation","Indiana Microschool Network",
  "Iowa Association of Christian Schools","KaiPod Learning","Kennesaw (Hybrid Schools Society)",
  "Kind Academy","Liberated Learners","Microschool Solutions","National Microschooling Center",
  "Ohio Christian Education Network","Permissionless Education","Prenda","Primer",
  "Rebel Educator","Reform Alliance","Rock by Rock","San Juan Diego Institute",
  "Soaring Education","Spark Microschools","Transcend","VELA Founder Network",
  "Wildflower Schools","YASS","Not affiliated with a program","Other"
];

const USE_OF_FUNDS_OPTIONS = [
  "Facility Improvements","Furniture & Fixtures","Curriculum & Materials","Supplies",
  "Marketing & Outreach","Licensing & Permits","Rent","Salaries & Stipends",
  "Training & Professional Development","Other"
];

const LOAN_AMOUNTS = [5000,10000,15000,20000,25000,30000,35000,40000,45000,50000];

const PAYMENT_SCHEDULE: Record<number, { term: string; y1: string; y2: string; y3: string }> = {
  5000:  { term: "3 years", y1: "$37.50/qtr",  y2: "$341.89/qtr",   y3: "$959.90/qtr" },
  10000: { term: "3 years", y1: "$75.00/qtr",  y2: "$683.78/qtr",   y3: "$1,919.80/qtr" },
  15000: { term: "4 years", y1: "$112.50/qtr", y2: "$712.14/qtr",   y3: "$1,625.30/qtr" },
  20000: { term: "4 years", y1: "$150.00/qtr", y2: "$949.51/qtr",   y3: "$2,167.07/qtr" },
  25000: { term: "4 years", y1: "$187.50/qtr", y2: "$1,186.89/qtr", y3: "$2,708.84/qtr" },
  30000: { term: "5 years", y1: "$225.00/qtr", y2: "$1,110.88/qtr", y3: "$2,310.15/qtr" },
  35000: { term: "5 years", y1: "$262.50/qtr", y2: "$1,296.03/qtr", y3: "$2,695.18/qtr" },
  40000: { term: "5 years", y1: "$300.00/qtr", y2: "$1,481.18/qtr", y3: "$3,080.21/qtr" },
  45000: { term: "5 years", y1: "$337.50/qtr", y2: "$1,666.32/qtr", y3: "$3,465.23/qtr" },
  50000: { term: "5 years", y1: "$375.00/qtr", y2: "$1,851.47/qtr", y3: "$3,850.26/qtr" },
};

const step1Schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  schoolLegalName: z.string().min(2, "School legal name is required"),
  dba: z.string().optional(),
  schoolWebsite: z.string().url("Please enter a valid URL (include https://)"),
  state: z.string().min(2, "State is required"),
  entityType: z.enum(["llc", "corporation", "nonprofit"], { required_error: "Please select entity type" }),
  taxClassification: z.string().optional(),
  ein: z.string().regex(/^\d{2}-\d{7}$/, "EIN must be in XX-XXXXXXX format"),
  schoolYear: z.enum(["0", "1", "2", "3+"], { required_error: "Please select school year" }),
  schoolType: z.string().optional(),
  networkAffiliation: z.string().optional(),
  boardCoApplicantName: z.string().optional(),
  boardCoApplicantEmail: z.string().optional(),
  boardCoApplicantPhone: z.string().optional(),
  totalBoardMembers: z.coerce.number().optional(),
  independentBoardMembers: z.coerce.number().optional(),
});

const step2Schema = z.object({
  projectedEnrollment: z.coerce.number().min(10, "Minimum 10 students").max(100, "Maximum 100 students"),
  tuitionContracts: z.coerce.number().min(0, "Cannot be negative"),
  enrollmentDeposits: z.coerce.number().min(0).optional(),
  tuitionPerStudent: z.coerce.number().min(1, "Tuition amount is required"),
  revenueSources: z.string().optional(),
  waitlistCount: z.coerce.number().min(0).optional(),
  retentionRate: z.coerce.number().min(0).max(100).optional(),
  priorYearEnrollment: z.coerce.number().min(0).optional(),
  parentRefName: z.string().min(2, "Parent reference name is required"),
  parentRefEmail: z.string().email("Valid email required for parent reference"),
  parentRefPhone: z.string().min(10, "Valid phone required for parent reference"),
});

const step3Schema = z.object({
  facilityType: z.string().min(1, "Facility type is required"),
  facilityStatus: z.string().min(1, "Facility status is required"),
  leaseExpiry: z.string().optional(),
  monthlyFacilityPayment: z.coerce.number().min(0).optional(),
  maxCapacity: z.coerce.number().min(0).optional(),
  fireInspection: z.enum(["yes", "no"], { required_error: "Please select" }),
  fireInspectionDate: z.string().optional(),
  certificateOfOccupancy: z.enum(["yes", "no"], { required_error: "Please select" }),
  insuranceStatus: z.enum(["yes", "pursuing", "no"], { required_error: "Please select" }),
  residentialDwelling: z.enum(["yes", "no"], { required_error: "Please select" }),
  stateRegistration: z.string().optional(),
  boardRefName: z.string().min(2, "Board member reference name is required"),
  boardRefEmail: z.string().email("Valid email required"),
  boardRefPhone: z.string().min(10, "Valid phone required"),
});

const step4Schema = z.object({
  bookkeepingTool: z.enum(["quickbooks_online", "other", "none"], { required_error: "Please select" }),
  hasBalanceSheet: z.boolean().optional(),
  hasPnL: z.boolean().optional(),
  hasCashForecast: z.boolean().optional(),
  hasYTD: z.boolean().optional(),
  hasTaxReturn: z.boolean().optional(),
  personalFinancialStatement: z.string().optional(),
  financialModel: z.enum(["yes", "no"], { required_error: "Please select" }),
  positiveNetIncome: z.enum(["yes", "no"], { required_error: "Please select" }),
  leaderReceivingSalary: z.string().optional(),
  rentUtilitiesCurrent: z.string().optional(),
  payrollMethod: z.enum(["payroll_system", "venmo_zelle_cash", "cash", "not_hiring"], { required_error: "Please select" }),
  fundsCommingled: z.enum(["yes", "no"], { required_error: "Please select" }),
  outstandingLoans: z.enum(["yes", "no"], { required_error: "Please select" }),
  debtCovenants: z.string().optional(),
  hasArticlesOfIncorp: z.string().optional(),
  hasDeterminationLetter: z.string().optional(),
});

const step5Schema = z.object({
  loanAmount: z.coerce.number().min(5000).max(50000),
  projectedRevenue: z.coerce.number().min(1, "Projected revenue is required"),
  useOfFunds: z.string().default(""),
});

type Step = "intro" | "step1" | "step2" | "step3" | "step4" | "step5" | "earlyStop" | "qualified" | "flagged" | "disqualified";

interface EarlyStopInfo {
  title: string;
  message: string;
  canRetry: boolean;
}

export function ScreeningFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [allData, setAllData] = useState<Record<string, unknown>>({});
  const [earlyStop, setEarlyStop] = useState<EarlyStopInfo | null>(null);
  const [resultFlags, setResultFlags] = useState<string[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);

  const submitLead = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
  });

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      schoolLegalName: "", dba: "", schoolWebsite: "", state: "",
      entityType: undefined, ein: "", schoolYear: undefined, schoolType: "",
      networkAffiliation: "", boardCoApplicantName: "", boardCoApplicantEmail: "",
      boardCoApplicantPhone: "", totalBoardMembers: undefined, independentBoardMembers: undefined,
    }
  });

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      projectedEnrollment: undefined, tuitionContracts: undefined, enrollmentDeposits: undefined,
      tuitionPerStudent: undefined, waitlistCount: undefined, retentionRate: undefined,
      priorYearEnrollment: undefined, parentRefName: "", parentRefEmail: "", parentRefPhone: "",
    }
  });

  const step3Form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      facilityType: "", facilityStatus: "", leaseExpiry: "", monthlyFacilityPayment: undefined,
      maxCapacity: undefined, fireInspection: undefined, certificateOfOccupancy: undefined,
      insuranceStatus: undefined, residentialDwelling: undefined, stateRegistration: "",
      boardRefName: "", boardRefEmail: "", boardRefPhone: "",
    }
  });

  const step4Form = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      bookkeepingTool: undefined, hasBalanceSheet: false, hasPnL: false, hasCashForecast: false,
      hasYTD: false, hasTaxReturn: false, financialModel: undefined, positiveNetIncome: undefined,
      payrollMethod: undefined, fundsCommingled: undefined, outstandingLoans: undefined,
    }
  });

  const step5Form = useForm<z.infer<typeof step5Schema>>({
    resolver: zodResolver(step5Schema),
    defaultValues: { loanAmount: undefined, projectedRevenue: undefined, useOfFunds: "" }
  });

  const watchedEntityType = step1Form.watch("entityType");
  const watchedSchoolYear = step1Form.watch("schoolYear");
  const isYear0or1 = watchedSchoolYear === "0" || watchedSchoolYear === "1";
  const isYear1Plus = watchedSchoolYear === "1" || watchedSchoolYear === "2" || watchedSchoolYear === "3+";
  const isNonprofit = watchedEntityType === "nonprofit";

  const watchedContracts = step2Form.watch("tuitionContracts");
  const watchedTuition = step2Form.watch("tuitionPerStudent");
  const calculatedRevenue = useMemo(() => {
    const c = Number(watchedContracts) || 0;
    const t = Number(watchedTuition) || 0;
    return c * t;
  }, [watchedContracts, watchedTuition]);

  const watchedLoanAmount = step5Form.watch("loanAmount");
  const paymentInfo = watchedLoanAmount ? PAYMENT_SCHEDULE[watchedLoanAmount] : null;

  const maxLoanForYear = watchedSchoolYear === "0" ? 25000 : 50000;
  const availableLoanAmounts = LOAN_AMOUNTS.filter(a => a <= maxLoanForYear);

  function runAutomatedChecks(data: Record<string, unknown>): { flags: string[]; status: "qualified" | "flagged" | "disqualified" } {
    const flags: string[] = [];
    let disqualified = false;

    if (data.residentialDwelling === "yes") {
      flags.push("CRITICAL: Program operates in a residential dwelling — ineligible");
      disqualified = true;
    }

    if (data.fundsCommingled === "yes") {
      flags.push("CRITICAL: Personal and business funds are commingled");
    }

    if (data.payrollMethod === "venmo_zelle_cash" || data.payrollMethod === "cash") {
      flags.push("WARNING: Staff paid via informal methods (Venmo/Zelle/Cash) — formal payroll required");
    }

    const calcRev = Number(data.calculatedRevenue) || 0;
    const statedRev = Number(data.projectedRevenue) || 0;
    if (calcRev > 0 && statedRev > 0) {
      const diff = Math.abs(calcRev - statedRev) / Math.max(calcRev, statedRev);
      if (diff > 0.25) {
        flags.push(`WARNING: Revenue inconsistency — calculated $${calcRev.toLocaleString()} vs stated $${statedRev.toLocaleString()} (${Math.round(diff * 100)}% difference)`);
      }
    }

    const deposits = Number(data.enrollmentDeposits) || 0;
    const contracts = Number(data.tuitionContracts) || 0;
    if (contracts > 0 && deposits < contracts * 0.5) {
      flags.push(`WARNING: Deposit gap — ${deposits} deposits for ${contracts} contracts (${Math.round(deposits / contracts * 100)}% coverage)`);
    }

    const loanAmt = Number(data.loanAmount) || 0;
    if (statedRev > 0 && loanAmt > statedRev * 0.5) {
      flags.push(`WARNING: Loan-to-revenue ratio is ${Math.round(loanAmt / statedRev * 100)}% (threshold: 50%)`);
    }

    const email = String(data.email || "");
    const website = String(data.schoolWebsite || "");
    const genericDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (emailDomain && genericDomains.includes(emailDomain)) {
      try {
        const websiteDomain = new URL(website).hostname.replace("www.", "");
        if (websiteDomain && !genericDomains.some(g => websiteDomain.includes(g))) {
          flags.push(`INFO: Applicant uses generic email (${emailDomain}) but school has its own domain (${websiteDomain})`);
        }
      } catch {}
    }

    if (data.positiveNetIncome === "no") {
      flags.push("WARNING: Financial model does not show positive net income across all operating years");
    }

    if (data.fireInspection === "no") {
      flags.push("INFO: Facility has not passed fire inspection");
    }

    if (data.certificateOfOccupancy === "no") {
      flags.push("INFO: No certificate of occupancy for school use");
    }

    if (data.rentUtilitiesCurrent === "no") {
      flags.push("WARNING: Rent and/or utility payments are not current");
    }

    if (data.bookkeepingTool !== "quickbooks_online") {
      flags.push("INFO: Not currently using QuickBooks Online — must adopt before loan closing");
    }

    if (isNonprofit) {
      const total = Number(data.totalBoardMembers) || 0;
      const independent = Number(data.independentBoardMembers) || 0;
      if (total > 0 && independent < Math.ceil(total / 2)) {
        flags.push(`WARNING: Board independence — only ${independent} of ${total} members are independent (majority required)`);
      }
    }

    const leaseExpiry = data.leaseExpiry ? new Date(String(data.leaseExpiry)) : null;
    if (leaseExpiry) {
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      if (leaseExpiry < twoYearsFromNow) {
        flags.push("WARNING: Lease expires within first 2 years of potential loan term");
      }
    }

    if (data.schoolYear === "0" && loanAmt > 25000) {
      flags.push("CRITICAL: Year 0 school requesting more than $25K cap");
      disqualified = true;
    }

    if (data.outstandingLoans === "yes" && data.debtCovenants === "yes") {
      flags.push("WARNING: Existing debt covenants may prohibit additional borrowing");
    }

    const criticalCount = flags.filter(f => f.startsWith("CRITICAL")).length;
    const warningCount = flags.filter(f => f.startsWith("WARNING")).length;

    let status: "qualified" | "flagged" | "disqualified" = "qualified";
    if (disqualified || criticalCount > 0) status = "disqualified";
    else if (warningCount > 0) status = "flagged";

    return { flags, status };
  }

  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setAllData(prev => ({ ...prev, ...data }));
    setStep("step2");
  };

  const onStep2Submit = (data: z.infer<typeof step2Schema>) => {
    const schoolYear = allData.schoolYear || step1Form.getValues("schoolYear");
    if ((schoolYear === "0" || schoolYear === "1") && (data.enrollmentDeposits ?? 0) < 10) {
      setEarlyStop({
        title: "Enrollment Deposits Required",
        message: "Year 0 and Year 1 schools must collect at least $25 deposits from a minimum of 10 families before applying. This demonstrates real family commitment and is verified through Plaid during underwriting.",
        canRetry: true,
      });
      setStep("earlyStop");
      return;
    }
    setAllData(prev => ({ ...prev, ...data, calculatedRevenue }));
    setStep("step3");
  };

  const onStep3Submit = (data: z.infer<typeof step3Schema>) => {
    if (data.facilityStatus === "actively_searching") {
      setEarlyStop({
        title: "Facility Required",
        message: "You must have a secured facility (signed lease, owned property, or LOI with contractor budget) before applying for a Lending Lab loan. This is a fundamental requirement for underwriting.",
        canRetry: true,
      });
      setStep("earlyStop");
      return;
    }
    if (data.residentialDwelling === "yes") {
      setEarlyStop({
        title: "Home-Based Programs Are Not Eligible",
        message: "The Lending Lab does not fund programs operating in residential dwellings. Your school must operate in a dedicated commercial, institutional, or community facility.",
        canRetry: false,
      });
      setStep("earlyStop");
      return;
    }
    setAllData(prev => ({ ...prev, ...data }));
    setStep("step4");
  };

  const onStep4Submit = (data: z.infer<typeof step4Schema>) => {
    if (data.financialModel === "no") {
      setEarlyStop({
        title: "5-Year Financial Model Required",
        message: "A completed 5-year financial model is required to apply. Your model must show that your school can afford the full loan (not just interest) alongside all other expenses, with positive net income across all operating years.",
        canRetry: true,
      });
      setStep("earlyStop");
      return;
    }
    setAllData(prev => ({ ...prev, ...data }));
    setStep("step5");
  };

  const onStep5Submit = async (data: z.infer<typeof step5Schema>) => {
    if (selectedFunds.length === 0) {
      step5Form.setError("useOfFunds", { message: "Please select at least one use of funds" });
      return;
    }
    const fundsString = selectedFunds.join(", ");
    const finalData = { ...allData, ...data, useOfFunds: fundsString };
    const { flags, status } = runAutomatedChecks(finalData);

    const payload = {
      ...finalData,
      flags: flags.length > 0 ? flags : undefined,
      status,
      calculatedRevenue: calculatedRevenue,
    };

    try {
      await submitLead.mutateAsync(payload);
    } catch {}

    setResultFlags(flags);
    if (status === "disqualified") setStep("disqualified");
    else if (status === "flagged") setStep("flagged");
    else setStep("qualified");
  };

  const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center justify-center mb-8" data-testid="step-indicator">
      {[1, 2, 3, 4, 5].map((num, i) => (
        <div key={num} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-300 ${
            current >= num ? "bg-secondary text-white ring-4 ring-secondary/20" : "bg-muted text-muted-foreground border-2 border-border"
          }`}>
            {current > num ? <CheckCircle2 className="w-5 h-5" /> : num}
          </div>
          {i < 4 && (
            <div className={`w-8 sm:w-12 h-1.5 mx-1 rounded-full transition-colors duration-300 ${
              current > num ? "bg-secondary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section id="apply" className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {step === "intro" && (
          <div className="text-center space-y-8" data-testid="screening-intro">
            <div className="inline-flex items-center rounded-full border border-secondary/30 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white text-secondary shadow-sm mb-2">
              Pre-Qualification Screening
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary max-w-3xl mx-auto leading-tight">
              Pre-qualify for a Lending Lab microloan in 10-15 minutes.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This screening collects verifiable details about your school to determine if you're ready for a full application. No credit check. No personal guarantee required.
            </p>

            <div className="pt-6">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-full shadow-lg bg-secondary hover:bg-secondary/90 text-white transition-transform hover:-translate-y-0.5"
                onClick={() => setStep("step1")}
                data-testid="button-start-screening"
              >
                Start Pre-Qualification
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-border/50 text-left">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <School className="w-6 h-6 text-secondary" />
                </div>
                <div className="font-bold text-primary mb-1">K-12 Microschools</div>
                <p className="text-sm text-muted-foreground">Serving 10-100 students. Year 0 through Year 3+.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <div className="font-bold text-primary mb-1">LLCs, Corps & Nonprofits</div>
                <p className="text-sm text-muted-foreground">Formal business entities only. No sole proprietorships.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div className="font-bold text-primary mb-1">$5K - $50K Loans</div>
                <p className="text-sm text-muted-foreground">3% fixed. No fees. No personal guarantee. No credit check.</p>
              </div>
            </div>
          </div>
        )}

        {step === "step1" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={1} />
              <CardTitle className="text-2xl font-display text-primary text-center">Contact & School Information</CardTitle>
              <CardDescription className="text-center">Tell us about you and your school.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step1Form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input data-testid="input-first-name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step1Form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input data-testid="input-last-name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step1Form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" data-testid="input-email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step1Form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" data-testid="input-phone" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <School className="w-5 h-5" /> School Details
                    </h3>
                  </div>

                  <FormField control={step1Form.control} name="schoolLegalName" render={({ field }) => (
                    <FormItem><FormLabel>School Legal Name (as registered with the state)</FormLabel><FormControl><Input data-testid="input-school-name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step1Form.control} name="dba" render={({ field }) => (
                      <FormItem><FormLabel>DBA (if applicable)</FormLabel><FormControl><Input data-testid="input-dba" placeholder="Doing business as..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step1Form.control} name="schoolWebsite" render={({ field }) => (
                      <FormItem><FormLabel>School Website URL</FormLabel><FormControl><Input data-testid="input-website" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step1Form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel>State of Operation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-state"><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                          <SelectContent>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step1Form.control} name="ein" render={({ field }) => (
                      <FormItem>
                        <FormLabel>EIN</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-ein"
                            placeholder="XX-XXXXXXX"
                            maxLength={10}
                            {...field}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2, 9);
                              field.onChange(val);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={step1Form.control} name="entityType" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Entity Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3 gap-4">
                          {[
                            { value: "llc", label: "LLC" },
                            { value: "corporation", label: "Corporation" },
                            { value: "nonprofit", label: "Nonprofit (501c3)" },
                          ].map(opt => (
                            <div key={opt.value} className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value={opt.value} id={`entity-${opt.value}`} />
                              <label htmlFor={`entity-${opt.value}`} className="flex-1 cursor-pointer">{opt.label}</label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step1Form.control} name="schoolYear" render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-school-year"><SelectValue placeholder="Select school year" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Year 0 (Pre-Launch)</SelectItem>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3+">Year 3+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step1Form.control} name="schoolType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-school-type"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="private_school">Private School</SelectItem>
                            <SelectItem value="charter">Charter School</SelectItem>
                            <SelectItem value="homeschool_enrichment">Homeschool Enrichment</SelectItem>
                            <SelectItem value="learning_pod">Learning Pod</SelectItem>
                            <SelectItem value="tutoring_center">Tutoring Center</SelectItem>
                            <SelectItem value="supplemental">Supplemental Program</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={step1Form.control} name="networkAffiliation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Affiliation (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-network"><SelectValue placeholder="Select affiliation" /></SelectTrigger></FormControl>
                        <SelectContent>{NETWORK_AFFILIATIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {isNonprofit && (
                    <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-lg space-y-4">
                      <h4 className="font-semibold text-primary flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Nonprofit Requirements
                      </h4>
                      <p className="text-sm text-muted-foreground">Nonprofits require a board member co-applicant and must demonstrate board independence.</p>

                      <FormField control={step1Form.control} name="taxClassification" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Classification</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select classification" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="501c3_approved">501(c)(3) Approved</SelectItem>
                              <SelectItem value="501c3_pending">501(c)(3) Pending</SelectItem>
                              <SelectItem value="fiscal_sponsor">Through a Fiscal Sponsor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid sm:grid-cols-3 gap-4">
                        <FormField control={step1Form.control} name="boardCoApplicantName" render={({ field }) => (
                          <FormItem><FormLabel>Board Co-Applicant Name</FormLabel><FormControl><Input data-testid="input-board-co-name" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={step1Form.control} name="boardCoApplicantEmail" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" data-testid="input-board-co-email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={step1Form.control} name="boardCoApplicantPhone" render={({ field }) => (
                          <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" data-testid="input-board-co-phone" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={step1Form.control} name="totalBoardMembers" render={({ field }) => (
                          <FormItem><FormLabel>Total Board Members</FormLabel><FormControl><Input type="number" data-testid="input-total-board" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={step1Form.control} name="independentBoardMembers" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Independent Board Members</FormLabel>
                            <FormControl><Input type="number" data-testid="input-independent-board" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                            <FormDescription>Not spouses, employees, or vendors of the school leader</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" className="border-border/80 rounded-full px-6" onClick={() => setStep("intro")}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md transition-transform hover:-translate-y-0.5" data-testid="button-step1-next">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "step2" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={2} />
              <CardTitle className="text-2xl font-display text-primary text-center">Enrollment & Demand</CardTitle>
              <CardDescription className="text-center">Demonstrate real family commitment and enrollment strength.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step2Form.control} name="projectedEnrollment" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Projected Enrollment (Fall 2025)</FormLabel>
                        <FormControl><Input type="number" min={10} max={100} data-testid="input-projected-enrollment" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormDescription>10-100 students</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step2Form.control} name="tuitionContracts" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signed Tuition Contracts</FormLabel>
                        <FormControl><Input type="number" min={0} data-testid="input-tuition-contracts" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormDescription>How many families have signed contracts?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {isYear0or1 && (
                    <FormField control={step2Form.control} name="enrollmentDeposits" render={({ field }) => (
                      <FormItem>
                        <FormLabel>$25+ Enrollment Deposits Collected</FormLabel>
                        <FormControl><Input type="number" min={0} data-testid="input-deposits" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormDescription>Minimum 10 deposits required for Year 0/1 schools. Verified through Plaid.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <FormField control={step2Form.control} name="tuitionPerStudent" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Annual Tuition Per Student ($)</FormLabel>
                      <FormControl><Input type="number" min={0} data-testid="input-tuition" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {calculatedRevenue > 0 && (
                    <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg flex items-start gap-3" data-testid="revenue-calculator">
                      <Calculator className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-primary text-lg">
                          Projected Enrollment Revenue: ${calculatedRevenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {watchedContracts || 0} contracted students x ${(watchedTuition || 0).toLocaleString()} tuition
                        </p>
                      </div>
                    </div>
                  )}

                  <FormField control={step2Form.control} name="revenueSources" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Revenue Sources</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-revenue-sources"><SelectValue placeholder="Select primary source" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="tuition_families">Tuition paid directly by families</SelectItem>
                          <SelectItem value="public_funding">Public funding (ESA, vouchers, charter per-pupil)</SelectItem>
                          <SelectItem value="grants_donations">Grants or donations</SelectItem>
                          <SelectItem value="mixed">Mixed sources</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step2Form.control} name="waitlistCount" render={({ field }) => (
                      <FormItem><FormLabel>Students on Waitlist</FormLabel><FormControl><Input type="number" min={0} data-testid="input-waitlist" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {isYear1Plus && (
                      <FormField control={step2Form.control} name="retentionRate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retention Rate (%)</FormLabel>
                          <FormControl><Input type="number" min={0} max={100} data-testid="input-retention" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                          <FormDescription>% of students returning from prior year</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>

                  {isYear1Plus && (
                    <FormField control={step2Form.control} name="priorYearEnrollment" render={({ field }) => (
                      <FormItem>
                        <FormLabel>2024-25 Actual Enrollment</FormLabel>
                        <FormControl><Input type="number" min={0} data-testid="input-prior-enrollment" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Parent Reference
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Provide a reference from a currently enrolled parent who can speak to your school.</p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={step2Form.control} name="parentRefName" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-parent-ref-name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step2Form.control} name="parentRefEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" data-testid="input-parent-ref-email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step2Form.control} name="parentRefPhone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" data-testid="input-parent-ref-phone" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" className="border-border/80 rounded-full px-6" onClick={() => setStep("step1")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md transition-transform hover:-translate-y-0.5" data-testid="button-step2-next">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "step3" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={3} />
              <CardTitle className="text-2xl font-display text-primary text-center">Facility & Compliance</CardTitle>
              <CardDescription className="text-center">Your learning space and regulatory standing.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...step3Form}>
                <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step3Form.control} name="facilityType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-facility-type"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="church_religious">Church or Religious Facility</SelectItem>
                            <SelectItem value="commercial">Commercial Space (retail, office, coworking)</SelectItem>
                            <SelectItem value="community_center">Community Center or Nonprofit Facility</SelectItem>
                            <SelectItem value="existing_school">Existing School (shared use or sublease)</SelectItem>
                            <SelectItem value="dedicated">Dedicated Facility (exclusive use)</SelectItem>
                            <SelectItem value="public_building">Public Building (library, municipal)</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step3Form.control} name="facilityStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-facility-status"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="own">We own the facility</SelectItem>
                            <SelectItem value="signed_lease">Signed lease agreement</SelectItem>
                            <SelectItem value="loi_contractor">LOI + contractor budget</SelectItem>
                            <SelectItem value="actively_searching">Actively searching (not yet secured)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={step3Form.control} name="leaseExpiry" render={({ field }) => (
                      <FormItem><FormLabel>Lease Expiry Date</FormLabel><FormControl><Input type="date" data-testid="input-lease-expiry" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step3Form.control} name="monthlyFacilityPayment" render={({ field }) => (
                      <FormItem><FormLabel>Monthly Payment ($)</FormLabel><FormControl><Input type="number" min={0} data-testid="input-facility-payment" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step3Form.control} name="maxCapacity" render={({ field }) => (
                      <FormItem><FormLabel>Max Enrollment Capacity</FormLabel><FormControl><Input type="number" min={0} data-testid="input-capacity" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step3Form.control} name="fireInspection" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Has your facility passed a fire inspection?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step3Form.control} name="certificateOfOccupancy" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Certificate of occupancy for school use?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step3Form.control} name="insuranceStatus" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>General liability insurance?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="pursuing" /></FormControl><FormLabel className="font-normal">Pursuing</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step3Form.control} name="residentialDwelling" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Does your program operate in a residential dwelling?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={step3Form.control} name="stateRegistration" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is your school registered with the state as a private school?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-state-reg"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="not_required">Not required in my state</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Board Member Reference
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Provide a reference from an unrelated board member (not a spouse, employee, or vendor of the school leader).</p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={step3Form.control} name="boardRefName" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-board-ref-name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step3Form.control} name="boardRefEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" data-testid="input-board-ref-email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={step3Form.control} name="boardRefPhone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" data-testid="input-board-ref-phone" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" className="border-border/80 rounded-full px-6" onClick={() => setStep("step2")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md transition-transform hover:-translate-y-0.5" data-testid="button-step3-next">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "step4" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={4} />
              <CardTitle className="text-2xl font-display text-primary text-center">Financial Discipline & Operations</CardTitle>
              <CardDescription className="text-center">Demonstrate financial maturity and operational readiness.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...step4Form}>
                <form onSubmit={step4Form.handleSubmit(onStep4Submit)} className="space-y-6">
                  <FormField control={step4Form.control} name="bookkeepingTool" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">What bookkeeping tool do you use?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3 gap-4">
                          {[
                            { value: "quickbooks_online", label: "QuickBooks Online" },
                            { value: "other", label: "Other (Wave, Xero, etc.)" },
                            { value: "none", label: "None" },
                          ].map(opt => (
                            <div key={opt.value} className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value={opt.value} id={`bk-${opt.value}`} />
                              <label htmlFor={`bk-${opt.value}`} className="flex-1 cursor-pointer text-sm">{opt.label}</label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {step4Form.watch("bookkeepingTool") && step4Form.watch("bookkeepingTool") !== "quickbooks_online" && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <strong className="text-amber-800 block mb-1">QuickBooks Online Required</strong>
                        <span className="text-amber-700">All borrowers must use QuickBooks Online for bookkeeping. You may proceed with screening, but QBO must be set up before loan closing.</span>
                      </div>
                    </div>
                  )}

                  {isYear1Plus && (
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      <p className="font-semibold text-primary text-sm">Can you provide the following financial documents?</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { name: "hasBalanceSheet" as const, label: "Balance Sheet" },
                          { name: "hasPnL" as const, label: "Profit & Loss Statement" },
                          { name: "hasCashForecast" as const, label: "Cash Forecast" },
                          { name: "hasYTD" as const, label: "Year-to-Date Financials" },
                          { name: "hasTaxReturn" as const, label: "Most Recent Tax Return" },
                        ].map(doc => (
                          <FormField key={doc.name} control={step4Form.control} name={doc.name} render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="font-normal text-sm">{doc.label}</FormLabel>
                            </FormItem>
                          )} />
                        ))}
                      </div>
                    </div>
                  )}

                  {watchedSchoolYear === "0" && (
                    <FormField control={step4Form.control} name="personalFinancialStatement" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Are you willing to provide a personal financial statement?</FormLabel>
                        <FormDescription>Required for Year 0 schools (not a personal guarantee — for stability assessment only)</FormDescription>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step4Form.control} name="financialModel" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Do you have a completed 5-year financial model?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={step4Form.control} name="positiveNetIncome" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Does your model show positive net income across all operating years?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={step4Form.control} name="leaderReceivingSalary" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Is the school leader receiving a salary in 2025-26?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {isYear1Plus && (
                    <FormField control={step4Form.control} name="rentUtilitiesCurrent" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Are all rent and utility payments current with no delinquencies?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <FormField control={step4Form.control} name="payrollMethod" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">How do you pay your staff?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2 gap-4">
                          {[
                            { value: "payroll_system", label: "Payroll system (Gusto, ADP, etc.)" },
                            { value: "venmo_zelle_cash", label: "Venmo, Zelle, or Cash App" },
                            { value: "cash", label: "Cash" },
                            { value: "not_hiring", label: "Not yet hiring staff" },
                          ].map(opt => (
                            <div key={opt.value} className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value={opt.value} id={`pay-${opt.value}`} />
                              <label htmlFor={`pay-${opt.value}`} className="flex-1 cursor-pointer text-sm">{opt.label}</label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {(step4Form.watch("payrollMethod") === "venmo_zelle_cash" || step4Form.watch("payrollMethod") === "cash") && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <strong className="text-red-800 block mb-1">Formal Payroll Required</strong>
                        <span className="text-red-700">All borrowers must pay staff through a formal payroll system (e.g., Gusto). Informal payment methods are not acceptable.</span>
                      </div>
                    </div>
                  )}

                  <FormField control={step4Form.control} name="fundsCommingled" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Are personal and business finances completely separate?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">Yes, completely separate</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">No, some overlap</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={step4Form.control} name="outstandingLoans" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you have any outstanding business loans?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {step4Form.watch("outstandingLoans") === "yes" && (
                    <FormField control={step4Form.control} name="debtCovenants" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Do any existing loans contain covenants prohibiting additional debt?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="unsure" /></FormControl><FormLabel className="font-normal">Unsure</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={step4Form.control} name="hasArticlesOfIncorp" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Do you have articles of incorporation or operating agreement?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {isNonprofit && (
                      <FormField control={step4Form.control} name="hasDeterminationLetter" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you have your IRS determination letter?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                              <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" className="border-border/80 rounded-full px-6" onClick={() => setStep("step3")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md transition-transform hover:-translate-y-0.5" data-testid="button-step4-next">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "step5" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={5} />
              <CardTitle className="text-2xl font-display text-primary text-center">Loan Request</CardTitle>
              <CardDescription className="text-center">Select your loan amount and how you plan to use the funds.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...step5Form}>
                <form onSubmit={step5Form.handleSubmit(onStep5Submit)} className="space-y-6">
                  <FormField control={step5Form.control} name="loanAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Loan Amount</FormLabel>
                      {watchedSchoolYear === "0" && (
                        <FormDescription>Year 0 schools are capped at $25,000</FormDescription>
                      )}
                      <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-loan-amount" className="text-lg py-6">
                            <SelectValue placeholder="Select loan amount" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableLoanAmounts.map(amt => (
                            <SelectItem key={amt} value={amt.toString()}>
                              ${amt.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {paymentInfo && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg" data-testid="payment-schedule">
                      <p className="font-semibold text-primary mb-2">Payment Schedule — ${watchedLoanAmount?.toLocaleString()} ({paymentInfo.term})</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Year 1 (Interest Only)</p>
                          <p className="font-bold text-primary">{paymentInfo.y1}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Year 2 (Partial P+I)</p>
                          <p className="font-bold text-primary">{paymentInfo.y2}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Years 3+ (Full Amort.)</p>
                          <p className="font-bold text-primary">{paymentInfo.y3}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormField control={step5Form.control} name="projectedRevenue" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Projected Annual Revenue for 2025-26 ($)</FormLabel>
                      <FormControl><Input type="number" min={0} data-testid="input-projected-revenue" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                      {calculatedRevenue > 0 && (
                        <FormDescription>
                          Your enrollment calculator shows ${calculatedRevenue.toLocaleString()} from tuition alone
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div>
                    <FormLabel className="text-base font-bold mb-3 block">How do you plan to use the loan funds?</FormLabel>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {USE_OF_FUNDS_OPTIONS.map(fund => (
                        <div key={fund} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fund-${fund}`}
                            checked={selectedFunds.includes(fund)}
                            onCheckedChange={(checked) => {
                              setSelectedFunds(prev =>
                                checked ? [...prev, fund] : prev.filter(f => f !== fund)
                              );
                              step5Form.setValue("useOfFunds", checked ? [...selectedFunds, fund].join(", ") : selectedFunds.filter(f => f !== fund).join(", "));
                            }}
                          />
                          <label htmlFor={`fund-${fund}`} className="text-sm cursor-pointer">{fund}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" className="border-border/80 rounded-full px-6" onClick={() => setStep("step4")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 shadow-md transition-transform hover:-translate-y-0.5"
                      disabled={submitLead.isPending}
                      data-testid="button-submit-screening"
                    >
                      {submitLead.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Pre-Qualification <ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "earlyStop" && earlyStop && (
          <Card className="shadow-lg border-0" data-testid="screen-early-stop">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">{earlyStop.title}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{earlyStop.message}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {earlyStop.canRetry && (
                  <Button variant="outline" className="rounded-full px-6" onClick={() => setStep("step1")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
                  </Button>
                )}
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6">
                  <a href="https://schoolstack.ai" target="_blank" rel="noreferrer">
                    Visit SchoolStack.ai <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "qualified" && (
          <Card className="shadow-lg border-0" data-testid="screen-qualified">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">You Pre-Qualify for The Lending Lab!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Based on your responses, your school meets our initial screening criteria. The next step is to complete the full application.
              </p>

              <div className="bg-muted/30 p-6 rounded-lg text-left max-w-md mx-auto">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Documents You'll Need
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />5-year financial model (Excel)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Signed tuition contracts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Certificate of insurance</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Signed lease or facility agreement</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Articles of incorporation / operating agreement</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Two reference letters of support</li>
                  {isNonprofit && <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Board resolution letter with member emails</li>}
                  {isYear1Plus && <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />Most recent tax return</li>}
                </ul>
              </div>

              <div className="pt-4">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg" data-testid="button-apply-now" onClick={() => alert("JotForm URL will be configured — contact aserafin@bhope.org")}>
                  Proceed to Full Application <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground mt-3">Questions? Contact Allison Serafin at <a href="mailto:aserafin@bhope.org" className="text-secondary hover:underline">aserafin@bhope.org</a> or (702) 539-9230</p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "flagged" && (
          <Card className="shadow-lg border-0" data-testid="screen-flagged">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">Your Application Needs Attention</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your screening has been submitted, but some items may require follow-up before your application can move forward.
              </p>

              <div className="bg-amber-50 p-6 rounded-lg text-left max-w-lg mx-auto">
                <h4 className="font-bold text-amber-800 mb-3">Items to Address:</h4>
                <ul className="space-y-2 text-sm text-amber-700">
                  {resultFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {flag.replace(/^(CRITICAL|WARNING|INFO): /, "")}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg" onClick={() => alert("JotForm URL will be configured — contact aserafin@bhope.org")}>
                  Proceed to Full Application <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground">You may still apply, but addressing these items will strengthen your application.<br />Contact <a href="mailto:aserafin@bhope.org" className="text-secondary hover:underline">aserafin@bhope.org</a> with questions.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "disqualified" && (
          <Card className="shadow-lg border-0" data-testid="screen-disqualified">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">Not Eligible at This Time</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Based on your responses, your school does not currently meet The Lending Lab's eligibility requirements.
              </p>

              <div className="bg-red-50 p-6 rounded-lg text-left max-w-lg mx-auto">
                <h4 className="font-bold text-red-800 mb-3">Reasons:</h4>
                <ul className="space-y-2 text-sm text-red-700">
                  {resultFlags.filter(f => f.startsWith("CRITICAL")).map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {flag.replace(/^CRITICAL: /, "")}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8">
                  <a href="https://schoolstack.ai" target="_blank" rel="noreferrer">
                    Get Help with SchoolStack.ai <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">You may reapply when these requirements are met.<br />Contact <a href="mailto:aserafin@bhope.org" className="text-secondary hover:underline">aserafin@bhope.org</a> with questions.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
