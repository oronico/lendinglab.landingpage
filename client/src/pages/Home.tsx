import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LoanDetails } from "@/components/sections/LoanDetails";
import { FAQ } from "@/components/sections/FAQ";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, Loader2, Mail, TrendingUp, GraduationCap, FileText, CalendarClock, Rocket, ExternalLink } from "lucide-react";
import { CONTENT } from "@shared/content";
import { RULES } from "@shared/rules";

function WhoThisIsFor() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Fit Check</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary" data-testid="text-fit-title">
            Is This Right for You?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border/60 bg-white p-8" data-testid="card-good-fit">
            <h3 className="font-display font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Good Fit
            </h3>
            <ul className="space-y-3">
              {CONTENT.goodFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground" data-testid={`text-good-fit-${idx}`}>
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-8" data-testid="card-not-fit">
            <h3 className="font-display font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Not a Fit
            </h3>
            <ul className="space-y-3">
              {CONTENT.notAFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground" data-testid={`text-not-fit-${idx}`}>
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HardGates() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Requirements</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary" data-testid="text-hard-gates-title">
            Non-Negotiables
          </h2>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-8">
          <ul className="space-y-4">
            {CONTENT.hardGates.map((gate, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm" data-testid={`text-hard-gate-${idx}`}>
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-primary font-medium">{gate}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-border/40 text-center">
            <Link href="/eligibility" className="text-secondary hover:text-secondary/80 text-sm font-semibold transition-colors" data-testid="link-full-eligibility">
              See full eligibility details →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" data-testid="text-final-cta-title">
          Ready to Get Started?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Check your eligibility in 2 minutes. No commitment, no credit check.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white h-14 px-8 text-base font-bold rounded-full shadow-lg" asChild data-testid="button-final-cta">
            <Link href="/eligibility">
              Check Eligibility
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="text-sm text-primary-foreground/70 space-y-1">
          <p>
            Contact: <a href={`mailto:${RULES.CONTACT.email}`} className="underline hover:text-white">{RULES.CONTACT.email}</a>
          </p>
          <p>{RULES.CONTACT.name}, {RULES.CONTACT.title}</p>
        </div>
      </div>
    </section>
  );
}

function PreLaunchLanding() {
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [productInterest, setProductInterest] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitWaitlist = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/waitlist", payload);
      return res.json();
    },
  });

  async function handleSubmit() {
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!schoolName.trim()) {
      setError("Please enter your school name");
      return;
    }
    try {
      await submitWaitlist.mutateAsync({
        email,
        schoolName,
        productInterest: productInterest || null,
        honeypot,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img src="/school-kids-group.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/65 to-primary/60" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg" data-testid="text-prelaunch-title">
              The Lending Lab
            </h1>
            <p className="text-xl md:text-2xl text-white mb-3 font-display drop-shadow-md">
              Loan capital for the schools banks overlook.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-10 drop-shadow-sm">
              Philanthropically fueled term loans and lines of credit for small schools across the United States enrolling 10–100 pK-12 students.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
              <div data-testid="stat-fund-target">
                <p className="text-2xl md:text-3xl font-display font-bold text-secondary drop-shadow-md">${(RULES.FUND_TARGET / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-white/70 drop-shadow-sm">Fund Target</p>
              </div>
              <div data-testid="stat-committed">
                <p className="text-2xl md:text-3xl font-display font-bold text-white drop-shadow-md">${(RULES.DEPLOY_AMOUNT / 1000).toFixed(0)}K</p>
                <p className="text-xs text-white/70 drop-shadow-sm">Committed</p>
              </div>
              <div data-testid="stat-raising">
                <p className="text-2xl md:text-3xl font-display font-bold text-white drop-shadow-md">${(RULES.FUNDRAISE_GOAL / 1000).toFixed(0)}K</p>
                <p className="text-xs text-white/70 drop-shadow-sm">Still Raising</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 bg-primary/5 border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold" data-testid="badge-active-fundraise">
              <TrendingUp className="w-4 h-4" />
              Cycle {RULES.CYCLE}: Active Fundraise
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Administered by</p>
                <img src="/bhif-logo.png" alt="Building Hope Impact Fund" className="h-16 md:h-20 object-contain" data-testid="logo-bhif" />
              </div>
              <div className="hidden md:block w-px h-20 bg-border" />
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Made possible by</p>
                <div className="flex items-center gap-8">
                  <img src="/stt-logo.webp" alt="Stand Together Trust" className="h-12 md:h-16 object-contain" data-testid="logo-stt" />
                  <img src="/curry-logo.png" alt="The Beth & Ravenel Curry Foundation" className="h-8 md:h-12 object-contain" data-testid="logo-curry" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary" data-testid="text-about-title">
              Why The Lending Lab Exists
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Small schools, the ones serving 10 to 100 students, are transforming education across the country. But traditional banks won't lend to them. They're too new, too small, or too unconventional to qualify for a standard business loan.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Lending Lab changes that. Administered by Building Hope Impact Fund and fueled by the generosity of Stand Together Trust and The Beth & Ravenel Curry Foundation, we offer below-market loans so these schools can open their doors, equip their classrooms, and grow with confidence.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-sm text-amber-800" data-testid="notice-excluded-states">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Not currently available in {Object.values(RULES.EXCLUDED_STATES_DISPLAY).join(", ")}. We hope to expand in future cycles.</span>
            </div>
          </div>
        </section>

        <section id="get-involved" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-10">
              <Card className="shadow-lg border-0 bg-muted/20" data-testid="card-philanthropists">
                <CardContent className="pt-8 pb-8 space-y-5">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary">For Philanthropists</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your support helps schools that traditional lenders won't touch get the capital they need to open their doors. We're raising ${(RULES.FUNDRAISE_GOAL / 1000).toFixed(0)}K more to reach our ${(RULES.FUND_TARGET / 1000000).toFixed(0)}M Cycle {RULES.CYCLE} goal.
                  </p>
                  <a
                    href="mailto:aserafin@bhope.org"
                    className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                    data-testid="link-philanthropy-email"
                  >
                    <Mail className="w-4 h-4" />
                    Email Allison Serafin
                  </a>
                  <p className="text-xs text-muted-foreground">aserafin@bhope.org</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-muted/20" data-testid="card-schools">
                <CardContent className="pt-8 pb-8 space-y-5">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary">For Schools</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Opening or growing a small school? We're building a loan fund designed for you. Join the waitlist and we'll let you know when applications open.
                  </p>

                  {submitted ? (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-4 rounded-lg" data-testid="text-waitlist-success">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold text-sm">You're on the list. We'll be in touch.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="pl-school" className="text-xs">School name *</Label>
                        <Input id="pl-school" data-testid="input-prelaunch-school" value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Your school's name" className="h-9" />
                      </div>
                      <div>
                        <Label htmlFor="pl-email" className="text-xs">Email *</Label>
                        <Input id="pl-email" data-testid="input-prelaunch-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.org" className="h-9" />
                      </div>
                      <div>
                        <Label htmlFor="pl-product" className="text-xs">Interested in</Label>
                        <Select value={productInterest} onValueChange={setProductInterest}>
                          <SelectTrigger data-testid="select-prelaunch-product" className="h-9"><SelectValue placeholder="Select product" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="term_loan">Term Loan</SelectItem>
                            <SelectItem value="loc">Line of Credit</SelectItem>
                            <SelectItem value="year0">Year 0 Term Loan</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sr-only" aria-hidden="true">
                        <Label htmlFor="pl-hp">Leave blank</Label>
                        <Input id="pl-hp" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                      </div>
                      {error && <p className="text-xs text-destructive">{error}</p>}
                      <Button
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-10"
                        data-testid="button-prelaunch-waitlist"
                        onClick={handleSubmit}
                        disabled={submitWaitlist.isPending}
                      >
                        {submitWaitlist.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Join Waitlist
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/20 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-3 gap-3">
              <img src="/school-outdoor.jpg" alt="Students learning outdoors" className="w-full h-40 md:h-48 object-cover rounded-xl" data-testid="photo-outdoor" />
              <img src="/school-classroom.jpg" alt="Students in classroom discussion" className="w-full h-40 md:h-48 object-cover rounded-xl" data-testid="photo-classroom" />
              <img src="/school-violin.jpeg" alt="Music lesson at a small school" className="w-full h-40 md:h-48 object-cover rounded-xl" data-testid="photo-violin" />
            </div>
          </div>
        </section>

        <LoanDetails />

        <section className="py-16 bg-orange-500/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="rounded-2xl border border-orange-500/20 bg-white p-8 md:p-10 text-center space-y-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary" data-testid="text-schoolstack-prelaunch-title">
                Coming Soon: <a href="https://schoolstack.ai/?ref=lendinglab" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-medium">SchoolStack.ai</a>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                A new mission-fueled platform to help small schools start strong and thrive. Budgeting tools, enrollment planning, and operational support built for schools like yours. From the same team behind the Lending Lab.
              </p>
              <div className="pt-2">
                <a
                  href="https://schoolstack.ai/?ref=lendinglab"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/10 text-orange-600 font-semibold hover:bg-orange-500/20 transition-colors"
                  data-testid="link-schoolstack-prelaunch"
                >
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary" data-testid="text-prelaunch-faq-title">
                Common Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {CONTENT.prelaunchFaq.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`prelaunch-faq-${idx}`}
                  data-testid={`prelaunch-faq-item-${idx}`}
                  className="bg-white px-6 rounded-xl border border-border/60"
                >
                  <AccordionTrigger className="text-left font-display font-bold text-base hover:no-underline py-4 text-primary hover:text-secondary transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>
                Have more questions? Email{" "}
                <a href={`mailto:${RULES.CONTACT.email}`} className="text-secondary hover:underline font-medium" data-testid="link-prelaunch-contact-email">
                  {RULES.CONTACT.email}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="documents" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 text-secondary font-semibold">
              <FileText className="w-5 h-5" />
              Use this time wisely
            </div>

            <div className="bg-white rounded-xl p-6 text-left max-w-md mx-auto shadow-sm border border-border/60">
              <h4 className="font-bold text-primary text-sm mb-3">Documents to prepare:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />2026-27 pro forma budget</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />5-year financial model</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Signed tuition contracts</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Certificate of insurance ($2M/$1M GL)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Signed lease or facility agreement</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Articles of incorporation / operating agreement</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Reconciled QuickBooks Online</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Board resolution authorizing loan <span className="text-xs italic">(nonprofits)</span></li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-full bg-primary text-white font-display font-bold text-lg" data-testid="badge-launch-date">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5" />
                  Applications: {RULES.APPLICATIONS_OPEN_DATE} – {RULES.APPLICATIONS_CLOSE_DATE}
                </div>
                <span className="text-xs font-normal text-primary-foreground/70">{RULES.APPLICATIONS_CLOSE_NOTE}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div data-testid="stat-cycle1-deployed">
                <p className="text-2xl font-display font-bold text-primary">${(RULES.CYCLE1_DEPLOYED / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Cycle 1 Deployed</p>
              </div>
              <div data-testid="stat-cycle1-schools">
                <p className="text-2xl font-display font-bold text-primary">{RULES.CYCLE1_SCHOOLS}</p>
                <p className="text-xs text-muted-foreground">Schools Funded</p>
              </div>
              <div data-testid="stat-cycle1-states">
                <p className="text-2xl font-display font-bold text-primary">{RULES.CYCLE1_STATES}</p>
                <p className="text-xs text-muted-foreground">States</p>
              </div>
              <div data-testid="stat-cycle1-repayment">
                <p className="text-2xl font-display font-bold text-primary">{RULES.CYCLE1_REPAYMENT_RATE}%</p>
                <p className="text-xs text-muted-foreground">On-Time Repayment</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Disclaimers() {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <ul className="space-y-2 text-center">
          {CONTENT.disclaimers.map((d, idx) => (
            <li key={idx} className="text-xs text-muted-foreground" data-testid={`text-disclaimer-${idx}`}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  if (!RULES.APPLICATIONS_OPEN) {
    return <PreLaunchLanding />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <LoanDetails />
        <WhoThisIsFor />
        <HardGates />
        <HowItWorks />
        <section className="py-16 bg-orange-500/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="rounded-2xl border border-orange-500/20 bg-white p-8 md:p-10 text-center space-y-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary" data-testid="text-schoolstack-title">
                Coming Soon: <a href="https://schoolstack.ai/?ref=lendinglab" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-medium">SchoolStack.ai</a>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                A new mission-fueled platform to help small schools start strong and thrive. Budgeting tools, enrollment planning, and operational support built for schools like yours. From the same team behind the Lending Lab.
              </p>
              <div className="pt-2">
                <a
                  href="https://schoolstack.ai/?ref=lendinglab"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/10 text-orange-600 font-semibold hover:bg-orange-500/20 transition-colors"
                  data-testid="link-schoolstack-home"
                >
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <FAQ />
        <FinalCTA />
        <Disclaimers />
      </main>
      <Footer />
    </div>
  );
}
