import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { track } from "@/lib/analytics";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RULES, type EligibilityResult } from "@shared/rules";
import { CONTENT } from "@shared/content";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

type YesNo = "yes" | "no" | null;

interface EligibilityAnswers {
  state: string | null;
  businessBankAccount: YesNo;
  noCommingling: YesNo;
  legalRegistration: YesNo;
  payrollFormal: YesNo;
  tuitionContracts: YesNo;
  schoolStage: "year0" | "operating" | null;
  productType: "term" | "loc" | null;
  qbo: YesNo;
  homeBased: YesNo;
  ficoRange: "above650" | "below650" | null;
  monthsOperating: "less12" | "12plus" | null;
  annualRevenue: "below100k" | "100kplus" | null;
  entityType: "llc" | "corp" | "501c3" | null;
  boardIndependence: "yes" | "unclear" | "no" | null;
  boardSize: "4plus" | "less4" | null;
  boardResolution: YesNo;
  billsCurrent: "yes" | "pastdue_now_current" | "pastdue" | null;
  reconciliationsCurrent: YesNo;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const initialAnswers: EligibilityAnswers = {
  state: null,
  businessBankAccount: null,
  noCommingling: null,
  legalRegistration: null,
  payrollFormal: null,
  tuitionContracts: null,
  schoolStage: null,
  productType: null,
  qbo: null,
  homeBased: null,
  ficoRange: null,
  monthsOperating: null,
  annualRevenue: null,
  entityType: null,
  boardIndependence: null,
  boardSize: null,
  boardResolution: null,
  billsCurrent: null,
  reconciliationsCurrent: null,
};

function evaluateEligibility(answers: EligibilityAnswers): EligibilityResult {
  const hardStops: string[] = [];
  const flags: string[] = [];

  if (answers.state && (RULES.EXCLUDED_STATES as readonly string[]).includes(answers.state)) {
    hardStops.push(`The Lending Lab is not currently available in ${RULES.EXCLUDED_STATES_DISPLAY[answers.state]} due to regulatory requirements.`);
  }

  if (answers.businessBankAccount === "no") {
    hardStops.push("A dedicated business bank account is required.");
  }

  if (answers.noCommingling === "no") {
    hardStops.push("Personal and business funds cannot be commingled.");
  }

  if (answers.legalRegistration === "no") {
    hardStops.push("A legal business registration is required.");
  }

  if (answers.payrollFormal === "no") {
    hardStops.push("Payroll must be processed through a formal provider, not Venmo, Zelle, Cash App, or cash.");
  }

  if (answers.tuitionContracts === "no") {
    hardStops.push("Signed tuition contracts are required for all enrolled students.");
  }

  if (!RULES.HOME_BASED_ALLOWED && answers.homeBased === "yes") {
    hardStops.push("Home-based schools are not eligible at this time.");
  }

  const isYear0 = answers.schoolStage === "year0";
  const isLOC = answers.productType === "loc";
  const isOperating = answers.schoolStage === "operating";

  if (answers.qbo === "no") {
    if (isLOC || isOperating) {
      if (RULES.QBO_HARD_STOP_LOC || RULES.QBO_HARD_STOP_OPERATING) {
        hardStops.push("QuickBooks Online is required for operating schools and line of credit applicants.");
      }
    } else if (isYear0 && !RULES.QBO_YEAR0_ADOPT_BEFORE_CLOSING) {
      hardStops.push("QuickBooks Online is required.");
    } else if (isYear0) {
      flags.push("Year 0 applicants must adopt QuickBooks Online before closing.");
    }
  }

  if (answers.ficoRange === "below650") {
    flags.push(`A FICO score of ${RULES.FICO_PREFERRED}+ is preferred. Scores below ${RULES.FICO_PREFERRED} may require additional review.`);
  }

  if (answers.monthsOperating === "less12" && !isYear0) {
    if (isLOC) {
      hardStops.push(`Line of credit requires at least ${RULES.LOC_MIN_MONTHS_OPERATING} months of operating history.`);
    } else {
      flags.push("Less than 12 months of operating history will require additional review.");
    }
  }

  if (isLOC && answers.annualRevenue === "below100k") {
    flags.push(`Line of credit requires $${(RULES.LOC_MIN_ANNUAL_REVENUE / 1000).toFixed(0)}K+ in annual revenue. Your application will be reviewed with this consideration.`);
  }

  const isNonprofit = answers.entityType === "501c3";

  if (isNonprofit) {
    if (answers.boardIndependence === "no") {
      hardStops.push(`Nonprofits must have an independent board of at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} members unrelated to the organization and staff.`);
    } else if (answers.boardIndependence === "unclear") {
      flags.push("Board independence is unclear. This will need to be clarified during review.");
    }

    if (answers.boardSize === "less4") {
      hardStops.push(`Nonprofits must have at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} independent board members.`);
    }

    if (answers.boardResolution === "no") {
      hardStops.push("Nonprofits must have a board resolution approved by the full board authorizing the school to pursue a loan for the stated amount.");
    }
  } else {
    if (answers.boardIndependence === "unclear") {
      flags.push("Board independence is unclear. This will need to be clarified during review.");
    }
  }

  if (answers.billsCurrent === "pastdue_now_current") {
    flags.push("Past-due bills that are now current will be noted for review.");
  }

  if (answers.billsCurrent === "pastdue") {
    hardStops.push("All bills must be current to be eligible.");
  }

  if (answers.reconciliationsCurrent === "no") {
    flags.push("Books must be reconciled through the last closed month. This will be flagged for review.");
  }

  let riskScore = 100;
  riskScore -= hardStops.length * 25;
  riskScore -= flags.length * 10;
  riskScore = Math.max(0, Math.min(100, riskScore));

  let outcome: EligibilityResult["outcome"];
  if (hardStops.length > 0) {
    outcome = "ineligible";
  } else if (flags.length > 0) {
    outcome = "flagged";
  } else {
    outcome = "qualified";
  }

  return { outcome, hardStops, flags, riskScore };
}

interface QuestionProps {
  question: string;
  children: React.ReactNode;
}

function Question({ question, children }: QuestionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold block">{question}</Label>
      {children}
    </div>
  );
}

export default function Eligibility() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<EligibilityAnswers>(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  useEffect(() => { track("eligibility_started"); }, []);

  function update<K extends keyof EligibilityAnswers>(key: K, value: EligibilityAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const steps = [
    {
      title: "School Profile",
      isComplete: () => answers.state !== null && answers.schoolStage !== null && answers.productType !== null && answers.homeBased !== null,
      content: (
        <div className="space-y-6">
          <Question question="What state is your school located in?">
            <Select value={answers.state ?? ""} onValueChange={(v) => update("state", v)}>
              <SelectTrigger data-testid="select-eligibility-state"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Question>

          <Question question="What stage is your school in?">
            <RadioGroup
              value={answers.schoolStage ?? ""}
              onValueChange={(v) => {
                update("schoolStage", v as "year0" | "operating");
                if (v === "year0" && answers.productType === "loc") {
                  update("productType", null);
                }
              }}
              className="flex flex-col gap-2"
              data-testid="radio-school-stage"
            >
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.schoolStage === "year0" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="stage-year0">
                <RadioGroupItem value="year0" id="stage-year0" data-testid="radio-stage-year0" />
                <div>
                  <span className="font-medium">Year 0 (Pre-Launch)</span>
                  <p className="text-xs text-muted-foreground">Haven't started serving students yet</p>
                </div>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.schoolStage === "operating" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="stage-operating">
                <RadioGroupItem value="operating" id="stage-operating" data-testid="radio-stage-operating" />
                <div>
                  <span className="font-medium">Operating (Year 1+)</span>
                  <p className="text-xs text-muted-foreground">Currently serving students</p>
                </div>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="What product are you interested in?">
            <RadioGroup
              value={answers.productType ?? ""}
              onValueChange={(v) => update("productType", v as "term" | "loc")}
              className="flex flex-col gap-2"
              data-testid="radio-product-type"
            >
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.productType === "term" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="product-term">
                <RadioGroupItem value="term" id="product-term" data-testid="radio-product-term" />
                <div>
                  <span className="font-medium">Term Loan ($10K–$50K)</span>
                  <p className="text-xs text-muted-foreground">Fixed amount, 4–6 year repayment</p>
                </div>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 transition-colors ${
                answers.schoolStage === "year0"
                  ? "opacity-60 cursor-not-allowed bg-muted/50 border-border"
                  : answers.productType === "loc"
                    ? "border-secondary bg-secondary/5 cursor-pointer"
                    : "border-border hover:bg-muted/50 cursor-pointer"
              }`} htmlFor="product-loc">
                <RadioGroupItem value="loc" id="product-loc" data-testid="radio-product-loc" disabled={answers.schoolStage === "year0"} />
                <div>
                  <span className="font-medium">Line of Credit (up to $100K)</span>
                  <p className="text-xs text-muted-foreground">
                    {answers.schoolStage === "year0"
                      ? "Requires 12+ months operating history"
                      : "Revolving credit, 12+ months operating required"}
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Is your school home-based?">
            <RadioGroup
              value={answers.homeBased ?? ""}
              onValueChange={(v) => update("homeBased", v as YesNo)}
              className="flex gap-3"
              data-testid="radio-home-based"
            >
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.homeBased === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="home-yes">
                <RadioGroupItem value="yes" id="home-yes" data-testid="radio-home-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.homeBased === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="home-no">
                <RadioGroupItem value="no" id="home-no" data-testid="radio-home-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>
        </div>
      ),
    },
    {
      title: "Financial Infrastructure",
      isComplete: () =>
        answers.businessBankAccount !== null &&
        answers.noCommingling !== null &&
        answers.payrollFormal !== null &&
        answers.qbo !== null &&
        answers.legalRegistration !== null &&
        (answers.legalRegistration !== "yes" || answers.entityType !== null),
      content: (
        <div className="space-y-6">
          <Question question="Do you have a dedicated business bank account?">
            <RadioGroup value={answers.businessBankAccount ?? ""} onValueChange={(v) => update("businessBankAccount", v as YesNo)} className="flex gap-3" data-testid="radio-bank-account">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.businessBankAccount === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="bank-yes">
                <RadioGroupItem value="yes" id="bank-yes" data-testid="radio-bank-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.businessBankAccount === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="bank-no">
                <RadioGroupItem value="no" id="bank-no" data-testid="radio-bank-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Are personal and business funds completely separate (no commingling)?">
            <RadioGroup value={answers.noCommingling ?? ""} onValueChange={(v) => update("noCommingling", v as YesNo)} className="flex gap-3" data-testid="radio-commingling">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.noCommingling === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="commingling-yes">
                <RadioGroupItem value="yes" id="commingling-yes" data-testid="radio-commingling-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.noCommingling === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="commingling-no">
                <RadioGroupItem value="no" id="commingling-no" data-testid="radio-commingling-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Do you use a formal payroll provider (not Venmo, Zelle, Cash App, or cash)?">
            <RadioGroup value={answers.payrollFormal ?? ""} onValueChange={(v) => update("payrollFormal", v as YesNo)} className="flex gap-3" data-testid="radio-payroll">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.payrollFormal === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="payroll-yes">
                <RadioGroupItem value="yes" id="payroll-yes" data-testid="radio-payroll-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.payrollFormal === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="payroll-no">
                <RadioGroupItem value="no" id="payroll-no" data-testid="radio-payroll-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Do you use QuickBooks Online (or are willing to adopt it)?">
            <RadioGroup value={answers.qbo ?? ""} onValueChange={(v) => update("qbo", v as YesNo)} className="flex gap-3" data-testid="radio-qbo">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.qbo === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="qbo-yes">
                <RadioGroupItem value="yes" id="qbo-yes" data-testid="radio-qbo-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.qbo === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="qbo-no">
                <RadioGroupItem value="no" id="qbo-no" data-testid="radio-qbo-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Is your school legally registered?">
            <RadioGroup value={answers.legalRegistration ?? ""} onValueChange={(v) => {
              update("legalRegistration", v as YesNo);
              if (v !== "yes") {
                update("entityType", null);
              }
            }} className="flex gap-3" data-testid="radio-legal">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.legalRegistration === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="legal-yes">
                <RadioGroupItem value="yes" id="legal-yes" data-testid="radio-legal-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.legalRegistration === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="legal-no">
                <RadioGroupItem value="no" id="legal-no" data-testid="radio-legal-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
            {answers.legalRegistration === "yes" && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Entity type:</p>
                <RadioGroup value={answers.entityType ?? ""} onValueChange={(v) => update("entityType", v as "llc" | "corp" | "501c3")} className="flex flex-col gap-2" data-testid="radio-entity-type">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.entityType === "llc" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="entity-llc">
                    <RadioGroupItem value="llc" id="entity-llc" data-testid="radio-entity-llc" />
                    <span className="font-medium">LLC</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.entityType === "corp" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="entity-corp">
                    <RadioGroupItem value="corp" id="entity-corp" data-testid="radio-entity-corp" />
                    <span className="font-medium">Corporation</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.entityType === "501c3" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="entity-501c3">
                    <RadioGroupItem value="501c3" id="entity-501c3" data-testid="radio-entity-501c3" />
                    <span className="font-medium">501(c)(3) Nonprofit</span>
                  </Label>
                </RadioGroup>
              </div>
            )}
          </Question>
        </div>
      ),
    },
    {
      title: "Enrollment & Contracts",
      isComplete: () =>
        answers.tuitionContracts !== null &&
        answers.billsCurrent !== null &&
        answers.reconciliationsCurrent !== null,
      content: (
        <div className="space-y-6">
          <Question question="Do you have signed tuition contracts for all enrolled students?">
            <RadioGroup value={answers.tuitionContracts ?? ""} onValueChange={(v) => update("tuitionContracts", v as YesNo)} className="flex gap-3" data-testid="radio-contracts">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.tuitionContracts === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="contracts-yes">
                <RadioGroupItem value="yes" id="contracts-yes" data-testid="radio-contracts-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.tuitionContracts === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="contracts-no">
                <RadioGroupItem value="no" id="contracts-no" data-testid="radio-contracts-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Are all bills, rent, and utilities paid on time?">
            <RadioGroup value={answers.billsCurrent ?? ""} onValueChange={(v) => update("billsCurrent", v as "yes" | "pastdue_now_current" | "pastdue")} className="flex flex-col gap-2" data-testid="radio-bills">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.billsCurrent === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="bills-yes">
                <RadioGroupItem value="yes" id="bills-yes" data-testid="radio-bills-yes" />
                <span className="font-medium">Yes, all current</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.billsCurrent === "pastdue_now_current" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="bills-pastdue-current">
                <RadioGroupItem value="pastdue_now_current" id="bills-pastdue-current" data-testid="radio-bills-pastdue-current" />
                <span className="font-medium">Were past due, but now current</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.billsCurrent === "pastdue" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="bills-pastdue">
                <RadioGroupItem value="pastdue" id="bills-pastdue" data-testid="radio-bills-pastdue" />
                <span className="font-medium">Currently past due</span>
              </Label>
            </RadioGroup>
          </Question>

          <Question question="Are your books reconciled through the last closed month?">
            <RadioGroup value={answers.reconciliationsCurrent ?? ""} onValueChange={(v) => update("reconciliationsCurrent", v as YesNo)} className="flex gap-3" data-testid="radio-reconciliations">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.reconciliationsCurrent === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="reconciled-yes">
                <RadioGroupItem value="yes" id="reconciled-yes" data-testid="radio-reconciled-yes" />
                <span className="font-medium">Yes</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.reconciliationsCurrent === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="reconciled-no">
                <RadioGroupItem value="no" id="reconciled-no" data-testid="radio-reconciled-no" />
                <span className="font-medium">No</span>
              </Label>
            </RadioGroup>
          </Question>
        </div>
      ),
    },
    {
      title: "Credit & Capacity",
      isComplete: () => {
        const baseComplete = answers.ficoRange !== null;
        const isNonprofit = answers.entityType === "501c3";
        if (answers.schoolStage === "operating") {
          let complete = baseComplete && answers.monthsOperating !== null && answers.annualRevenue !== null && answers.boardIndependence !== null;
          if (isNonprofit) {
            complete = complete && answers.boardSize !== null && answers.boardResolution !== null;
          }
          return complete;
        }
        if (answers.schoolStage === "year0" && isNonprofit) {
          return baseComplete && answers.boardIndependence !== null && answers.boardSize !== null && answers.boardResolution !== null;
        }
        return baseComplete;
      },
      content: (
        <div className="space-y-6">
          <Question question="What is your approximate FICO credit score range?">
            <RadioGroup value={answers.ficoRange ?? ""} onValueChange={(v) => update("ficoRange", v as "above650" | "below650")} className="flex flex-col gap-2" data-testid="radio-fico">
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.ficoRange === "above650" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="fico-above650">
                <RadioGroupItem value="above650" id="fico-above650" data-testid="radio-fico-above650" />
                <span className="font-medium">{RULES.FICO_PREFERRED}+ (Preferred)</span>
              </Label>
              <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.ficoRange === "below650" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="fico-below650">
                <RadioGroupItem value="below650" id="fico-below650" data-testid="radio-fico-below650" />
                <span className="font-medium">Below {RULES.FICO_PREFERRED}</span>
              </Label>
            </RadioGroup>
          </Question>

          {answers.schoolStage === "operating" && (
            <>
              <Question question="How long has your school been operating?">
                <RadioGroup value={answers.monthsOperating ?? ""} onValueChange={(v) => update("monthsOperating", v as "less12" | "12plus")} className="flex gap-3" data-testid="radio-months">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.monthsOperating === "12plus" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="months-12plus">
                    <RadioGroupItem value="12plus" id="months-12plus" data-testid="radio-months-12plus" />
                    <span className="font-medium">12+ months</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.monthsOperating === "less12" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="months-less12">
                    <RadioGroupItem value="less12" id="months-less12" data-testid="radio-months-less12" />
                    <span className="font-medium">Less than 12 months</span>
                  </Label>
                </RadioGroup>
              </Question>

              <Question question="What is your approximate annual business revenue?">
                <RadioGroup value={answers.annualRevenue ?? ""} onValueChange={(v) => update("annualRevenue", v as "below100k" | "100kplus")} className="flex gap-3" data-testid="radio-revenue">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.annualRevenue === "100kplus" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="revenue-100k">
                    <RadioGroupItem value="100kplus" id="revenue-100k" data-testid="radio-revenue-100kplus" />
                    <span className="font-medium">$100K+</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.annualRevenue === "below100k" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="revenue-below">
                    <RadioGroupItem value="below100k" id="revenue-below" data-testid="radio-revenue-below100k" />
                    <span className="font-medium">Below $100K</span>
                  </Label>
                </RadioGroup>
              </Question>

              <Question question="Does your board have a majority of independent members?">
                <RadioGroup value={answers.boardIndependence ?? ""} onValueChange={(v) => update("boardIndependence", v as "yes" | "unclear" | "no")} className="flex flex-col gap-2" data-testid="radio-board">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-yes">
                    <RadioGroupItem value="yes" id="board-yes" data-testid="radio-board-yes" />
                    <span className="font-medium">Yes</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "unclear" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-unclear">
                    <RadioGroupItem value="unclear" id="board-unclear" data-testid="radio-board-unclear" />
                    <span className="font-medium">Unclear / Not sure</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-no">
                    <RadioGroupItem value="no" id="board-no" data-testid="radio-board-no" />
                    <span className="font-medium">No</span>
                  </Label>
                </RadioGroup>
              </Question>

              {answers.entityType === "501c3" && (
                <>
                  <Question question={`Does your board have at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} independent members unrelated to the organization and staff?`}>
                    <RadioGroup value={answers.boardSize ?? ""} onValueChange={(v) => update("boardSize", v as "4plus" | "less4")} className="flex gap-3" data-testid="radio-board-size">
                      <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardSize === "4plus" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-size-4plus">
                        <RadioGroupItem value="4plus" id="board-size-4plus" data-testid="radio-board-size-4plus" />
                        <span className="font-medium">Yes, {RULES.NONPROFIT_MIN_BOARD_SIZE}+</span>
                      </Label>
                      <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardSize === "less4" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-size-less4">
                        <RadioGroupItem value="less4" id="board-size-less4" data-testid="radio-board-size-less4" />
                        <span className="font-medium">No, fewer than {RULES.NONPROFIT_MIN_BOARD_SIZE}</span>
                      </Label>
                    </RadioGroup>
                  </Question>

                  <Question question="Has your board approved a resolution authorizing the school to pursue a loan for the stated amount?">
                    <RadioGroup value={answers.boardResolution ?? ""} onValueChange={(v) => update("boardResolution", v as YesNo)} className="flex gap-3" data-testid="radio-board-resolution">
                      <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardResolution === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="resolution-yes">
                        <RadioGroupItem value="yes" id="resolution-yes" data-testid="radio-resolution-yes" />
                        <span className="font-medium">Yes</span>
                      </Label>
                      <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardResolution === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="resolution-no">
                        <RadioGroupItem value="no" id="resolution-no" data-testid="radio-resolution-no" />
                        <span className="font-medium">No</span>
                      </Label>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground mt-1">The resolution must be approved by the entire board and documented in meeting minutes.</p>
                  </Question>
                </>
              )}
            </>
          )}

          {answers.schoolStage === "year0" && answers.entityType === "501c3" && (
            <>
              <Question question="Does your board have a majority of independent members?">
                <RadioGroup value={answers.boardIndependence ?? ""} onValueChange={(v) => update("boardIndependence", v as "yes" | "unclear" | "no")} className="flex flex-col gap-2" data-testid="radio-board-y0">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-y0-yes">
                    <RadioGroupItem value="yes" id="board-y0-yes" data-testid="radio-board-y0-yes" />
                    <span className="font-medium">Yes</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "unclear" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-y0-unclear">
                    <RadioGroupItem value="unclear" id="board-y0-unclear" data-testid="radio-board-y0-unclear" />
                    <span className="font-medium">Unclear / Not sure</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardIndependence === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-y0-no">
                    <RadioGroupItem value="no" id="board-y0-no" data-testid="radio-board-y0-no" />
                    <span className="font-medium">No</span>
                  </Label>
                </RadioGroup>
              </Question>

              <Question question={`Does your board have at least ${RULES.NONPROFIT_MIN_BOARD_SIZE} independent members unrelated to the organization and staff?`}>
                <RadioGroup value={answers.boardSize ?? ""} onValueChange={(v) => update("boardSize", v as "4plus" | "less4")} className="flex gap-3" data-testid="radio-board-size-y0">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardSize === "4plus" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-size-y0-4plus">
                    <RadioGroupItem value="4plus" id="board-size-y0-4plus" data-testid="radio-board-size-y0-4plus" />
                    <span className="font-medium">Yes, {RULES.NONPROFIT_MIN_BOARD_SIZE}+</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardSize === "less4" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="board-size-y0-less4">
                    <RadioGroupItem value="less4" id="board-size-y0-less4" data-testid="radio-board-size-y0-less4" />
                    <span className="font-medium">No, fewer than {RULES.NONPROFIT_MIN_BOARD_SIZE}</span>
                  </Label>
                </RadioGroup>
              </Question>

              <Question question="Has your board approved a resolution authorizing the school to pursue a loan for the stated amount?">
                <RadioGroup value={answers.boardResolution ?? ""} onValueChange={(v) => update("boardResolution", v as YesNo)} className="flex gap-3" data-testid="radio-board-resolution-y0">
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardResolution === "yes" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="resolution-y0-yes">
                    <RadioGroupItem value="yes" id="resolution-y0-yes" data-testid="radio-resolution-y0-yes" />
                    <span className="font-medium">Yes</span>
                  </Label>
                  <Label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${answers.boardResolution === "no" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`} htmlFor="resolution-y0-no">
                    <RadioGroupItem value="no" id="resolution-y0-no" data-testid="radio-resolution-y0-no" />
                    <span className="font-medium">No</span>
                  </Label>
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-1">The resolution must be approved by the entire board and documented in meeting minutes.</p>
              </Question>
            </>
          )}
        </div>
      ),
    },
  ];

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  function handleNext() {
    if (isLastStep) {
      const eligResult = evaluateEligibility(answers);
      setResult(eligResult);
      track("eligibility_completed", { outcome: eligResult.outcome });
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleNavigateToOutcome() {
    if (!result) return;
    const params = new URLSearchParams();
    if (result.flags.length > 0) {
      params.set("flags", JSON.stringify(result.flags));
    }
    if (result.hardStops.length > 0) {
      params.set("hardStops", JSON.stringify(result.hardStops));
    }
    params.set("riskScore", String(result.riskScore));
    if (answers.productType) {
      params.set("product", answers.productType);
    }

    navigate(`/outcome/${result.outcome}?${params.toString()}`);
  }

  function handleStartOver() {
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setResult(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-3 py-1 text-sm font-semibold bg-white text-secondary shadow-sm mb-4">
              <ShieldCheck className="h-4 w-4" />
              Eligibility Check
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3" data-testid="text-eligibility-title">
              Are You Eligible?
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto" data-testid="text-eligibility-subtitle">
              Answer a few questions to see if your school meets our lending requirements. Takes about 2 minutes.
            </p>
          </div>

          {!result ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                  <span data-testid="text-step-label">Step {currentStep + 1} of {steps.length}: {step.title}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden" data-testid="progress-bar">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <Card className="border-border/60 shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>{step.content}</CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!step.isComplete()}
                  className="bg-secondary hover:bg-secondary/90 text-white font-bold"
                  data-testid="button-next"
                >
                  {isLastStep ? "Check Eligibility" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {result.outcome === "qualified" && (
                <Card className="border-green-200 bg-green-50/50 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-green-800 mb-2" data-testid="text-result-qualified">
                          You Appear Eligible
                        </h2>
                        <p className="text-sm text-green-700 mb-4">
                          Based on your responses, your school meets our basic eligibility requirements. The next step is to complete a short pre-qualification questionnaire.
                        </p>
                        <Button
                          onClick={() => navigate("/prequal")}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold"
                          data-testid="button-continue-prequal"
                        >
                          Continue to Pre-Qualification
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.outcome === "flagged" && (
                <Card className="border-amber-200 bg-amber-50/50 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-amber-100 p-3">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-amber-800 mb-2" data-testid="text-result-flagged">
                          Flagged for Review
                        </h2>
                        <p className="text-sm text-amber-700 mb-4">
                          You meet most requirements, but the following items need additional review:
                        </p>
                        <ul className="space-y-2 mb-4">
                          {result.flags.map((flag, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-700" data-testid={`text-flag-${i}`}>
                              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            onClick={handleNavigateToOutcome}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                            data-testid="button-view-details"
                          >
                            View Details & Next Steps
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate("/prequal")}
                            data-testid="button-proceed-prequal"
                          >
                            Proceed to Pre-Qualification
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.outcome === "ineligible" && (
                <Card className="border-red-200 bg-red-50/50 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-red-100 p-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-red-800 mb-2" data-testid="text-result-ineligible">
                          Not Eligible at This Time
                        </h2>
                        <p className="text-sm text-red-700 mb-4">
                          Based on your responses, your school does not currently meet the following requirements:
                        </p>
                        <ul className="space-y-2 mb-4">
                          {result.hardStops.map((stop, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-700" data-testid={`text-hardstop-${i}`}>
                              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                              {stop}
                            </li>
                          ))}
                        </ul>
                        {result.flags.length > 0 && (
                          <>
                            <p className="text-sm text-amber-700 mb-2 font-medium">Additionally flagged:</p>
                            <ul className="space-y-2 mb-4">
                              {result.flags.map((flag, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-amber-700" data-testid={`text-additional-flag-${i}`}>
                                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            onClick={handleNavigateToOutcome}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            data-testid="button-view-outcome"
                          >
                            View Full Details
                          </Button>
                          <a
                            href="https://schoolstack.ai/?ref=lendinglab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:underline py-2"
                            data-testid="link-schoolstack"
                          >
                            Learn about SchoolStack.ai - coming soon
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleStartOver}
                  className="text-muted-foreground"
                  data-testid="button-start-over"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>

              <div className="border-t pt-6 mt-6">
                <p className="text-xs text-muted-foreground text-center italic">
                  {CONTENT.disclaimers.join(" ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
