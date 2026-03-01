import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Users,
  DollarSign,
  Scale,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";

type SchoolStage = "year0" | "year1" | "year2plus" | null;
type EntityType = "llc" | "corporation" | "nonprofit" | null;

interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  conditions?: {
    stage?: SchoolStage[];
    entity?: EntityType[];
  };
}

const checklistItems: ChecklistItem[] = [
  {
    id: "registered-entity",
    label: "Registered as an LLC, Corporation, or 501(c)(3) (not sole proprietorship or DBA-only)",
    category: "Entity & Legal",
  },
  {
    id: "active-ein",
    label: "Active EIN on file",
    category: "Entity & Legal",
  },
  {
    id: "business-bank",
    label: "Dedicated business bank account (separate from personal)",
    category: "Entity & Legal",
  },
  {
    id: "no-commingling",
    label: "No commingling of personal and business funds",
    category: "Entity & Legal",
  },
  {
    id: "school-website",
    label: "Has a functioning school website",
    category: "Entity & Legal",
  },
  {
    id: "student-count",
    label: "Serves or will serve 10–100 students in grades K–12",
    category: "Students & Program",
  },
  {
    id: "not-daycare",
    label: "Does NOT primarily serve children under age 3 (not a daycare)",
    category: "Students & Program",
  },
  {
    id: "tuition-contracts",
    label: "Has signed tuition contracts from enrolled families specifying the required enrollment deposit (not handbooks)",
    category: "Students & Program",
  },
  {
    id: "enrollment-deposits",
    label: "All enrolled families have paid the enrollment deposit specified in their signed tuition contract",
    category: "Students & Program",
  },
  {
    id: "parent-reference",
    label: "Can provide a reference from a currently enrolled parent",
    category: "Students & Program",
  },
  {
    id: "facility-secured",
    label: "Has a signed lease, owns facility, or has LOI + contractor budget",
    category: "Facility",
  },
  {
    id: "residential-dwelling",
    label: "If operating from a residential dwelling, you own the home and can provide the deed",
    category: "Facility",
  },
  {
    id: "quickbooks",
    label: "Uses or is willing to adopt QuickBooks Online for bookkeeping",
    category: "Financial Discipline",
  },
  {
    id: "financial-model",
    label: "Has a completed 5-year financial model",
    category: "Financial Discipline",
  },
  {
    id: "rent-utilities-current",
    label: "All rent and utilities paid on time (applies to all applicants with a lease)",
    category: "Financial Discipline",
  },
  {
    id: "formal-payroll",
    label: "All staff paid through formal payroll (e.g., Gusto) — not Venmo/Zelle/Cash App/cash",
    category: "Financial Discipline",
  },
  {
    id: "financial-docs",
    label: "Can provide: Tax filings, EOY balance sheet, P&L, and Cash flow statement",
    category: "Financial Discipline",
    conditions: { stage: ["year2plus"] },
  },
  {
    id: "tax-return",
    label: "Can provide most recent tax return",
    category: "Financial Discipline",
    conditions: { stage: ["year2plus"] },
  },
  {
    id: "personal-financial-stmt",
    label: "Willing to provide a personal financial statement",
    category: "Financial Discipline",
    conditions: { stage: ["year0"] },
  },
  {
    id: "board-reference",
    label: "Can provide a reference from an unrelated board member",
    category: "Governance",
  },
  {
    id: "board-independence",
    label: "Board has a majority of members independent of org and school leader",
    category: "Governance",
    conditions: { entity: ["nonprofit"] },
  },
  {
    id: "board-resolution",
    label: "Has a signed board resolution letter from full board approving pursuit of this loan",
    category: "Governance",
    conditions: { entity: ["nonprofit"] },
  },
  {
    id: "board-coapplicant",
    label: "An independent board member will serve as co-applicant (cannot be an employee, contractor, or related to the school leader)",
    category: "Governance",
    conditions: { entity: ["nonprofit"] },
  },
  {
    id: "liability-insurance",
    label: "Has or will obtain at least $2M/$1M general liability insurance",
    category: "Compliance & Verification",
  },
  {
    id: "plaid-consent",
    label: "Willing to connect business bank account via Plaid",
    category: "Compliance & Verification",
  },
  {
    id: "background-check",
    label: "Willing to consent to a criminal background check",
    category: "Compliance & Verification",
  },
  {
    id: "credit-check",
    label: "Willing to consent to a credit check",
    category: "Compliance & Verification",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Entity & Legal": <Building2 className="h-5 w-5 text-primary" />,
  "Students & Program": <Users className="h-5 w-5 text-primary" />,
  Facility: <Building2 className="h-5 w-5 text-primary" />,
  "Financial Discipline": <DollarSign className="h-5 w-5 text-primary" />,
  Governance: <Scale className="h-5 w-5 text-primary" />,
  "Compliance & Verification": <ClipboardCheck className="h-5 w-5 text-primary" />,
};

export function EligibilityChecklist() {
  const [stage, setStage] = useState<SchoolStage>(null);
  const [entityType, setEntityType] = useState<EntityType>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [attested, setAttested] = useState(false);

  const applicableItems = useMemo(() => {
    if (!stage || !entityType) return [];
    return checklistItems.filter((item) => {
      if (item.conditions?.stage && !item.conditions.stage.includes(stage)) return false;
      if (item.conditions?.entity && !item.conditions.entity.includes(entityType)) return false;
      return true;
    });
  }, [stage, entityType]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {};
    for (const item of applicableItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [applicableItems]);

  const allChecked = applicableItems.length > 0 && applicableItems.every((item) => checked.has(item.id));
  const someChecked = checked.size > 0;
  const canProceed = allChecked && attested;

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="eligibility" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-3 py-1 text-sm font-semibold bg-white text-secondary shadow-sm mb-4">
            <ShieldCheck className="h-4 w-4" />
            Step 1 of 2
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4" data-testid="text-eligibility-title">
            Eligibility Self-Screen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Before starting the pre-qualification wizard, confirm that your school meets our basic requirements. This takes about 2 minutes.
          </p>
        </div>

        <Card className="mb-8 border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Tell us about your school</CardTitle>
            <CardDescription>These two questions determine which requirements apply to you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block" data-testid="label-school-stage">
                How long has your school been operating?
              </Label>
              <RadioGroup
                value={stage ?? ""}
                onValueChange={(val) => {
                  setStage(val as SchoolStage);
                  setChecked(new Set());
                  setAttested(false);
                }}
                className="flex flex-col sm:flex-row gap-3"
                data-testid="radio-school-stage"
              >
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${stage === "year0" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="stage-year0"
                >
                  <RadioGroupItem value="year0" id="stage-year0" data-testid="radio-stage-year0" />
                  <div>
                    <span className="font-medium">Year 0 (Pre-Launch)</span>
                    <p className="text-xs text-muted-foreground">Haven't started serving students yet</p>
                  </div>
                </Label>
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${stage === "year1" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="stage-year1"
                >
                  <RadioGroupItem value="year1" id="stage-year1" data-testid="radio-stage-year1" />
                  <div>
                    <span className="font-medium">Year 1</span>
                    <p className="text-xs text-muted-foreground">First year serving students</p>
                  </div>
                </Label>
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${stage === "year2plus" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="stage-year2plus"
                >
                  <RadioGroupItem value="year2plus" id="stage-year2plus" data-testid="radio-stage-year2plus" />
                  <div>
                    <span className="font-medium">Year 2+</span>
                    <p className="text-xs text-muted-foreground">Operating for 2 or more years</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 block" data-testid="label-entity-type">
                What is your entity type?
              </Label>
              <RadioGroup
                value={entityType ?? ""}
                onValueChange={(val) => {
                  setEntityType(val as EntityType);
                  setChecked(new Set());
                  setAttested(false);
                }}
                className="flex flex-col sm:flex-row gap-3"
                data-testid="radio-entity-type"
              >
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${entityType === "llc" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="entity-llc"
                >
                  <RadioGroupItem value="llc" id="entity-llc" data-testid="radio-entity-llc" />
                  <span className="font-medium">LLC</span>
                </Label>
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${entityType === "corporation" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="entity-corporation"
                >
                  <RadioGroupItem value="corporation" id="entity-corporation" data-testid="radio-entity-corporation" />
                  <span className="font-medium">Corporation</span>
                </Label>
                <Label
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${entityType === "nonprofit" ? "border-secondary bg-secondary/5" : "border-border hover:bg-muted/50"}`}
                  htmlFor="entity-nonprofit"
                >
                  <RadioGroupItem value="nonprofit" id="entity-nonprofit" data-testid="radio-entity-nonprofit" />
                  <span className="font-medium">501(c)(3) Nonprofit</span>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {stage && entityType && (
          <>
            <div className="space-y-6 mb-8">
              {Object.entries(groupedItems).map(([category, items]) => (
                <Card key={category} className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {categoryIcons[category]}
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${checked.has(item.id) ? "bg-green-50 border border-green-200" : "bg-white border border-border/40 hover:bg-muted/30"}`}
                        >
                          <Checkbox
                            id={item.id}
                            checked={checked.has(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-0.5"
                            data-testid={`checkbox-${item.id}`}
                          />
                          <Label
                            htmlFor={item.id}
                            className="text-sm leading-relaxed cursor-pointer font-normal"
                            data-testid={`label-${item.id}`}
                          >
                            {item.label}
                            {item.conditions?.stage?.[0] === "year0" && (
                              <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Year 0 only</span>
                            )}
                            {item.conditions?.stage?.[0] === "year2plus" && (
                              <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Year 2+ only</span>
                            )}
                            {item.conditions?.entity?.[0] === "nonprofit" && (
                              <span className="ml-2 text-xs font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Nonprofit only</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {allChecked && (
              <Card className="mb-6 border-green-200 bg-green-50/50 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="attestation"
                      checked={attested}
                      onCheckedChange={(val) => setAttested(val === true)}
                      className="mt-0.5"
                      data-testid="checkbox-attestation"
                    />
                    <Label
                      htmlFor="attestation"
                      className="text-sm font-medium leading-relaxed cursor-pointer"
                      data-testid="label-attestation"
                    >
                      I confirm the above is truthful and accurate. I understand that misrepresentations discovered during underwriting will result in disqualification.
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              {canProceed ? (
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white h-14 px-10 text-base font-bold rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
                  asChild
                  data-testid="button-start-wizard"
                >
                  <a href="#apply">
                    Continue to Pre-Qualification
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              ) : someChecked && !allChecked ? (
                <Card className="border-amber-200 bg-amber-50/50 shadow-sm max-w-lg mx-auto">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-amber-800 mb-1" data-testid="text-not-eligible">
                          You may not be eligible at this time
                        </p>
                        <p className="text-sm text-amber-700 mb-3">
                          All items must be checked to proceed. If you're not quite ready, we recommend building your foundation first.
                        </p>
                        <a
                          href="https://schoolstack.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                          data-testid="link-schoolstack"
                        >
                          Visit SchoolStack.ai for startup resources
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
