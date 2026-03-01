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
import { CheckCircle2, AlertCircle } from "lucide-react";

// Form schemas
const leadSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  schoolName: z.string().min(2, "School name is required"),
  state: z.string().min(2, "State is required"),
});

const screeningSchema = z.object({
  hasFacility: z.enum(["yes", "no"]),
  enrollmentSize: z.string().min(1, "Please select an option"),
  operatingYears: z.enum(["0", "1", "2", "3+"]),
  monthlyBreakevenKnown: z.enum(["yes", "no"]),
  loanAmount: z.coerce.number().min(5000).max(150000),
  loanPurpose: z.string().min(10, "Please describe the purpose of the loan"),
});

type LeadFormValues = z.infer<typeof leadSchema>;
type ScreeningFormValues = z.infer<typeof screeningSchema>;

export function ScreeningFlow() {
  const [step, setStep] = useState<"intro" | "lead" | "screening" | "qualified" | "unqualified">("intro");
  const [userData, setUserData] = useState<LeadFormValues | null>(null);

  const leadForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      schoolName: "",
      state: "",
    }
  });

  const screeningForm = useForm<ScreeningFormValues>({
    resolver: zodResolver(screeningSchema),
    defaultValues: {
      hasFacility: undefined,
      enrollmentSize: "",
      operatingYears: undefined,
      monthlyBreakevenKnown: undefined,
      loanAmount: 25000,
      loanPurpose: "",
    }
  });

  const onLeadSubmit = (data: LeadFormValues) => {
    setUserData(data);
    setStep("screening");
  };

  const onScreeningSubmit = (data: ScreeningFormValues) => {
    // Simple mock qualification logic based on the 4 pillars
    // Must know breakeven and either have a facility or operating history
    const isQualified = 
      data.monthlyBreakevenKnown === "yes" && 
      (data.hasFacility === "yes" || data.operatingYears !== "0");
      
    if (isQualified) {
      setStep("qualified");
    } else {
      setStep("unqualified");
    }
  };

  return (
    <section id="apply" className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {step === "intro" && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">
              Ready to grow your school?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The Lending Lab application process starts with a brief screening to ensure our loan products are the right fit for your school's current stage.
            </p>
            <div className="pt-4">
              <Button size="lg" className="h-14 px-8 text-lg" onClick={() => setStep("lead")}>
                Start Eligibility Check
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6 pt-12 mt-12 border-t text-left">
              <div>
                <div className="font-bold text-primary mb-1">1. Pre-Screen</div>
                <p className="text-sm text-muted-foreground">2-minute questionnaire to check basic eligibility.</p>
              </div>
              <div>
                <div className="font-bold text-primary mb-1">2. Full Application</div>
                <p className="text-sm text-muted-foreground">If eligible, complete our detailed JotForm application.</p>
              </div>
              <div>
                <div className="font-bold text-primary mb-1">3. Decision</div>
                <p className="text-sm text-muted-foreground">Receive a decision within 1-4 weeks.</p>
              </div>
            </div>
          </div>
        )}

        {step === "lead" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary/5 pb-6 border-b">
              <CardTitle className="text-2xl font-display text-primary">Tell us about yourself</CardTitle>
              <CardDescription>We'll use this to keep in touch about your application status.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...leadForm}>
                <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={leadForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input placeholder="Jane" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={leadForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="jane@myschool.org" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={leadForm.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/Program Name</FormLabel>
                          <FormControl><Input placeholder="Academy of Excellence" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl><Input placeholder="e.g. TX, FL, AZ" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("intro")}>Back</Button>
                    <Button type="submit">Continue to Eligibility</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "screening" && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary/5 pb-6 border-b">
              <CardTitle className="text-2xl font-display text-primary">Eligibility Screening</CardTitle>
              <CardDescription>Checking your alignment with our 4 Pillars of School Readiness.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...screeningForm}>
                <form onSubmit={screeningForm.handleSubmit(onScreeningSubmit)} className="space-y-8">
                  
                  <FormField
                    control={screeningForm.control}
                    name="operatingYears"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">How long has your school been operating?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="0" /></FormControl>
                              <FormLabel className="font-normal">Not yet open (Year 0)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="1" /></FormControl>
                              <FormLabel className="font-normal">1 Year</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="2" /></FormControl>
                              <FormLabel className="font-normal">2 Years</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="3+" /></FormControl>
                              <FormLabel className="font-normal">3+ Years</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={screeningForm.control}
                    name="hasFacility"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Do you have a finalized, secured facility for your school?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="yes" /></FormControl>
                              <FormLabel className="font-normal">Yes, we have a secured lease or own our space</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="no" /></FormControl>
                              <FormLabel className="font-normal">No, we are currently searching or negotiating</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={screeningForm.control}
                    name="monthlyBreakevenKnown"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Do you know your exact monthly breakeven number?</FormLabel>
                        <FormDescription>The exact revenue needed to cover all operational costs.</FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="yes" /></FormControl>
                              <FormLabel className="font-normal">Yes, we have a detailed financial model</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="no" /></FormControl>
                              <FormLabel className="font-normal">No / Not sure yet</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={screeningForm.control}
                      name="enrollmentSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current/Projected Enrollment</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="" disabled>Select enrollment size</option>
                              <option value="1-15">1-15 students</option>
                              <option value="16-30">16-30 students</option>
                              <option value="31-60">31-60 students</option>
                              <option value="61+">61+ students</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={screeningForm.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requested Loan Amount ($)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormDescription>$10K to $150K range</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={screeningForm.control}
                    name="loanPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Purpose of Loan</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. Facility buildout, curriculum purchase, operational runway for Year 1..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setStep("lead")}>Back</Button>
                    <Button type="submit" size="lg">Submit Eligibility Check</Button>
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
              <CardTitle className="text-3xl font-display text-primary">You're Eligible to Apply!</CardTitle>
            </CardHeader>
            <CardContent className="pb-10 px-8">
              <p className="text-lg text-muted-foreground mb-8">
                Great news, {userData?.firstName}. Based on your answers, your school aligns with our core underwriting pillars. You are invited to complete the full application.
              </p>
              
              <div className="bg-muted/50 p-6 rounded-xl mb-8 text-left">
                <h4 className="font-semibold mb-2">What you'll need for the full application:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-4">
                  <li>Detailed financial model showing monthly breakeven</li>
                  <li>Facility lease agreement (if applicable)</li>
                  <li>Evidence of family demand/waitlists</li>
                  <li>Board of Directors information (if non-profit)</li>
                  <li>Banking information for Plaid verification</li>
                </ul>
              </div>

              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => {
                // In a real app, this would redirect to the JotForm
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
              <CardTitle className="text-3xl font-display text-primary">Let's Build Your Readiness</CardTitle>
            </CardHeader>
            <CardContent className="pb-10 px-8">
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your interest, {userData?.firstName}. Based on your answers, it looks like your school needs a bit more preparation before applying for a loan.
              </p>
              
              <div className="bg-muted/50 p-6 rounded-xl mb-8 text-left">
                <h4 className="font-semibold mb-3">Our Microloan Pilot learned that readiness is key. We recommend focusing on:</h4>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <div className="font-bold text-primary whitespace-nowrap">Facility:</div>
                    <div>Securing an affordable e-occupancy facility is often the biggest hurdle. Traditional NNN commercial leases are challenging for schools &lt;60 students.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="font-bold text-primary whitespace-nowrap">Financials:</div>
                    <div>Understanding your exact monthly breakeven is critical. You must know the exact revenue needed to cover all costs.</div>
                  </div>
                </div>
              </div>

              <p className="mb-8 font-medium">
                We'd love to help you get ready. Sign up for SchoolStack.ai to build your financial fluency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-12" asChild>
                  <a href="https://schoolstack.ai" target="_blank" rel="noreferrer">Get SchoolStack.ai</a>
                </Button>
                <Button variant="outline" size="lg" className="h-12" onClick={() => setStep("intro")}>
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
