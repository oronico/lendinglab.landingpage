import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowRight, Building2, Calculator, School } from "lucide-react";

// Schemas for multi-step form
const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

const businessSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  state: z.string().min(2, "State is required"),
  entityType: z.enum(["llc", "nonprofit", "scorp", "soleprop"], { 
    required_error: "Please select your entity type" 
  }),
  operatingYears: z.enum(["0", "1", "2", "3+"], {
    required_error: "Please select operating years"
  }),
  nonprofitGuarantee: z.enum(["yes", "no"]).optional(),
});

const financialSchema = z.object({
  annualRevenue: z.coerce.number().min(0, "Revenue cannot be negative"),
  existingDebt: z.coerce.number().min(0, "Debt cannot be negative"),
  monthlyBreakevenKnown: z.enum(["yes", "no"], { required_error: "Please select an option" }),
  loanAmount: z.coerce.number().min(5000).max(150000),
});

const operationsSchema = z.object({
  hasFacility: z.enum(["yes", "no"], { required_error: "Please select facility status" }),
  enrollmentSize: z.string().min(1, "Please select an option"),
  loanPurpose: z.string().min(10, "Please describe the purpose of the loan"),
});

type ContactValues = z.infer<typeof contactSchema>;
type BusinessValues = z.infer<typeof businessSchema>;
type FinancialValues = z.infer<typeof financialSchema>;
type OperationsValues = z.infer<typeof operationsSchema>;

type AllData = Partial<ContactValues & BusinessValues & FinancialValues & OperationsValues>;

export function ScreeningFlow() {
  const [step, setStep] = useState<"intro" | "contact" | "business" | "financial" | "operations" | "qualified" | "unqualified">("intro");
  const [formData, setFormData] = useState<AllData>({});
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" }
  });

  const businessForm = useForm<BusinessValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: { schoolName: "", state: "", entityType: undefined, operatingYears: undefined }
  });

  const financialForm = useForm<FinancialValues>({
    resolver: zodResolver(financialSchema),
    defaultValues: { annualRevenue: 0, existingDebt: 0, monthlyBreakevenKnown: undefined, loanAmount: 25000 }
  });

  const operationsForm = useForm<OperationsValues>({
    resolver: zodResolver(operationsSchema),
    defaultValues: { hasFacility: undefined, enrollmentSize: "", loanPurpose: "" }
  });

  const onContactSubmit = (data: ContactValues) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep("business");
  };

  const onBusinessSubmit = (data: BusinessValues) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep("financial");
  };

  const onFinancialSubmit = (data: FinancialValues) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep("operations");
  };

  const onOperationsSubmit = (data: OperationsValues) => {
    const finalData = { ...formData, ...data } as Required<AllData>;
    setFormData(finalData);
    
    const reasons: string[] = [];

    // Evaluate Business Logic
    if (finalData.entityType === "soleprop") {
      reasons.push("We currently only lend to LLCs, Non-profits, and S-Corps. Sole Proprietorships are not eligible.");
    }
    
    if (finalData.entityType === "nonprofit" && finalData.nonprofitGuarantee === "no") {
      reasons.push("For non-profits, a personal guarantee from a founder, executive director, or board member is required.");
    }
    
    if (finalData.operatingYears === "0" && finalData.loanAmount > 10000) {
      reasons.push("Year 0 schools (not yet open) are limited to a maximum loan amount of $10,000.");
    }

    if (finalData.monthlyBreakevenKnown === "no") {
      reasons.push("Understanding your exact monthly breakeven is critical before applying.");
    }
    
    if (finalData.hasFacility === "no" && finalData.operatingYears === "0") {
      reasons.push("Securing an affordable facility is usually required before a loan can be approved for new schools.");
    }

    if (finalData.annualRevenue > 0 && finalData.loanAmount > finalData.annualRevenue * 0.5) {
      reasons.push("The requested loan amount exceeds our standard loan-to-revenue ratio thresholds.");
    }

    if (reasons.length > 0) {
      setRejectionReasons(reasons);
      setStep("unqualified");
    } else {
      setStep("qualified");
    }
  };

  const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((num, i) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            current >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {num}
          </div>
          {i < 3 && (
            <div className={`w-12 h-1 mx-2 rounded ${
              current > num ? "bg-primary" : "bg-muted"
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
          <div className="text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-primary mb-2 shadow-sm">
              10-Minute Pre-Qualification
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">
              See what you qualify for without impacting your credit score.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined screening process is inspired by top business lenders. Answer a few key questions to see if your school is ready for The Lending Lab.
            </p>
            
            <div className="pt-4">
              <Button size="lg" className="h-14 px-8 text-lg" onClick={() => setStep("contact")}>
                Start Pre-Qualification
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6 pt-12 mt-12 border-t text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <School className="w-8 h-8 text-secondary mb-3" />
                <div className="font-bold text-primary mb-1">Business Age</div>
                <p className="text-sm text-muted-foreground">Open to established and Year 0 schools.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Building2 className="w-8 h-8 text-secondary mb-3" />
                <div className="font-bold text-primary mb-1">Business Type</div>
                <p className="text-sm text-muted-foreground">LLCs, S-Corps, and 501(c)(3) Non-profits.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Calculator className="w-8 h-8 text-secondary mb-3" />
                <div className="font-bold text-primary mb-1">Loan Size</div>
                <p className="text-sm text-muted-foreground">$10K to $150K based on revenue capacity.</p>
              </div>
            </div>
          </div>
        )}

        {step === "contact" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={1} />
              <CardTitle className="text-2xl font-display text-primary text-center">Contact Information</CardTitle>
              <CardDescription className="text-center">How can we reach you regarding your application?</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={contactForm.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={contactForm.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={contactForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={contactForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("intro")}>Cancel</Button>
                    <Button type="submit">Continue to Business Info</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "business" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={2} />
              <CardTitle className="text-2xl font-display text-primary text-center">Business Information</CardTitle>
              <CardDescription className="text-center">Tell us about your school's structure.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={businessForm.control} name="schoolName" render={({ field }) => (
                      <FormItem><FormLabel>School/Program Legal Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={businessForm.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>State of Operation</FormLabel><FormControl><Input placeholder="e.g. TX, FL" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <FormField control={businessForm.control} name="entityType" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Business Structure (Exactly as on tax records)</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="llc" id="llc" />
                            <label htmlFor="llc" className="flex-1 cursor-pointer">LLC</label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="nonprofit" id="nonprofit" />
                            <label htmlFor="nonprofit" className="flex-1 cursor-pointer">Non-Profit (501c3)</label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="scorp" id="scorp" />
                            <label htmlFor="scorp" className="flex-1 cursor-pointer">S Corp</label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="soleprop" id="soleprop" />
                            <label htmlFor="soleprop" className="flex-1 cursor-pointer">Sole Proprietorship</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {businessForm.watch("entityType") === "nonprofit" && (
                    <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg space-y-4">
                      <h4 className="font-semibold text-primary flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Non-Profit Verification & Requirements
                      </h4>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <FormLabel className="text-sm font-medium mb-2 block">Employer Identification Number (EIN)</FormLabel>
                          <Input 
                            placeholder="XX-XXXXXXX" 
                            onChange={(e) => {
                              // Auto-format EIN with dash
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2, 9);
                              e.target.value = val;
                            }}
                            maxLength={10}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="secondary"
                          onClick={() => {
                            // Mock API lookup for prototype
                            const nameField = document.querySelector('input[name="schoolName"]') as HTMLInputElement;
                            if (nameField) {
                              businessForm.setValue("schoolName", "Verified Foundation for Education");
                              alert("EIN Verified: IRS database matched 'Verified Foundation for Education'");
                            }
                          }}
                        >
                          Verify EIN
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">Enter your 9-digit EIN to automatically verify your 501(c)(3) status and populate your legal name.</p>
                      
                      <div className="pt-4 border-t border-secondary/20">
                        <FormField control={businessForm.control} name="nonprofitGuarantee" render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-semibold">Personal Guarantee Requirement</FormLabel>
                            <FormDescription className="text-xs">
                              Because 501(c)(3)s do not have owners, our unsecured loans require a Founder, Executive Director, or Board Member to sign a Personal Guarantee to ensure alignment.
                            </FormDescription>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value="yes" /></FormControl>
                                  <FormLabel className="font-normal text-sm">I understand and agree to provide a PG</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value="no" /></FormControl>
                                  <FormLabel className="font-normal text-sm">We cannot provide a PG</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  {businessForm.watch("entityType") === "scorp" && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground block mb-1">S-Corp Documentation Required</strong>
                        For S-Corporations, your full application will require your most recent Business Tax Return (Form 1120-S) and Personal Tax Returns (Form 1040) for all owners with 20%+ equity.
                      </div>
                    </div>
                  )}

                  <FormField control={businessForm.control} name="operatingYears" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Business Inception / Operating History</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="0" /></FormControl><FormLabel className="font-normal">Not yet open (Year 0)</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="1" /></FormControl><FormLabel className="font-normal">1 Year</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="2" /></FormControl><FormLabel className="font-normal">2 Years</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="3+" /></FormControl><FormLabel className="font-normal">3+ Years</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("contact")}>Back</Button>
                    <Button type="submit">Continue to Financials</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "financial" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={3} />
              <CardTitle className="text-2xl font-display text-primary text-center">Financial Details</CardTitle>
              <CardDescription className="text-center">Provide your basic revenue and loan request details.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...financialForm}>
                <form onSubmit={financialForm.handleSubmit(onFinancialSubmit)} className="space-y-6">
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={financialForm.control} name="loanAmount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Requested Loan Amount ($)</FormLabel>
                        <FormControl><Input type="number" className="text-lg py-6" {...field} /></FormControl>
                        <FormDescription>$10K max for Year 0 schools.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={financialForm.control} name="existingDebt" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Existing Business Debt ($)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription>Total current outstanding loans/lines.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-lg mb-4">Revenue & Cash Flow</h4>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField control={financialForm.control} name="annualRevenue" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Annual Revenue ($)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormDescription>Gross tuition and funding.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={financialForm.control} name="monthlyBreakevenKnown" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you know your exact monthly breakeven?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 mt-2">
                              <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                              <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("business")}>Back</Button>
                    <Button type="submit">Continue to Operations</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "operations" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white pb-6 border-b">
              <StepIndicator current={4} />
              <CardTitle className="text-2xl font-display text-primary text-center">Operations & Purpose</CardTitle>
              <CardDescription className="text-center">Final details about your school's capacity.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...operationsForm}>
                <form onSubmit={operationsForm.handleSubmit(onOperationsSubmit)} className="space-y-6">
                  
                  <FormField control={operationsForm.control} name="hasFacility" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Do you have a finalized, secured facility?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes, we have a secured lease or own our space</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No, we are currently searching or negotiating</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={operationsForm.control} name="enrollmentSize" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current/Projected Enrollment</FormLabel>
                      <FormControl>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...field}>
                          <option value="" disabled>Select enrollment size</option>
                          <option value="1-15">1-15 students</option>
                          <option value="16-30">16-30 students</option>
                          <option value="31-60">31-60 students</option>
                          <option value="61+">61+ students</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={operationsForm.control} name="loanPurpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Purpose of Loan</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Payroll, facility buildout, curriculum, operating expenses..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p>By submitting, you agree to a soft credit pull that will not affect your credit score. This pre-qualification does not guarantee a loan offer.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("financial")}>Back</Button>
                    <Button type="submit" size="lg" className="px-8">View Results</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "qualified" && (
          <Card className="shadow-lg border-0 text-center overflow-hidden">
            <div className="bg-green-500 h-2 w-full"></div>
            <CardHeader className="pt-10 pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-display text-primary">Congratulations! You Prequalify.</CardTitle>
            </CardHeader>
            <CardContent className="pb-10 px-8">
              <p className="text-lg text-muted-foreground mb-8">
                Great news, {formData?.firstName}. Based on your answers, your school aligns with our core underwriting pillars for a microloan.
              </p>
              
              <div className="bg-muted/50 p-6 rounded-xl mb-8 text-left">
                <h4 className="font-semibold mb-2">Next Steps & Required Documents:</h4>
                <p className="text-sm text-muted-foreground mb-4">You will need to upload these in the full application.</p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-4">
                  <li>Articles of Organization/Incorporation</li>
                  <li>Detailed financial model showing monthly breakeven</li>
                  <li>Facility lease agreement (if applicable)</li>
                  <li>Bank statements for Plaid verification</li>
                  <li>Government-issued ID for 20%+ owners/directors</li>
                </ul>
              </div>

              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => {
                alert("Redirecting to JotForm application...");
              }}>
                Continue to Full Application
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "unqualified" && (
          <Card className="shadow-lg border-0 text-center overflow-hidden">
            <div className="bg-secondary h-2 w-full"></div>
            <CardHeader className="pt-10 pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-display text-primary">No Immediate Offer Available</CardTitle>
            </CardHeader>
            <CardContent className="pb-10 px-8">
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your interest, {formData?.firstName}. Based on the information provided, we are unable to provide a loan option at this time.
              </p>
              
              {rejectionReasons.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-xl mb-8 text-left">
                  <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Eligibility Requirements Not Met:
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground list-disc list-inside ml-2">
                    {rejectionReasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mb-8 font-medium text-muted-foreground">
                We'd love to help you build your operational readiness so you can reapply in the future. Sign up for SchoolStack.ai to build your financial fluency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-12" asChild>
                  <a href="https://schoolstack.ai" target="_blank" rel="noreferrer">Get SchoolStack.ai</a>
                </Button>
                <Button variant="outline" size="lg" className="h-12" onClick={() => {
                  setStep("intro");
                  setFormData({});
                }}>
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </section>
  );
}