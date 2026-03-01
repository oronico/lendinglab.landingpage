import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LoanDetails } from "@/components/sections/LoanDetails";
import { FAQ } from "@/components/sections/FAQ";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
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
            Contact: <a href={`mailto:${RULES.CONTACT.email}`} className="underline hover:text-white">{RULES.CONTACT.email}</a> · <a href={`tel:${RULES.CONTACT.phone.replace(/[^\d]/g, '')}`} className="underline hover:text-white">{RULES.CONTACT.phone}</a>
          </p>
          <p>{RULES.CONTACT.name}, {RULES.CONTACT.title}</p>
        </div>
      </div>
    </section>
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
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <LoanDetails />
        <WhoThisIsFor />
        <HardGates />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
        <Disclaimers />
      </main>
      <Footer />
    </div>
  );
}
