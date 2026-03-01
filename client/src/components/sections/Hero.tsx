import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { CONTENT } from "@shared/content";
import { RULES } from "@shared/rules";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 md:pt-28 lg:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-secondary/20 px-4 py-1.5 text-sm font-medium bg-secondary/5 text-secondary mb-8" data-testid="badge-fund">
            {CONTENT.hero.badge}
          </div>

          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-4" data-testid="text-hero-cycle">
            Cycle {RULES.CYCLE} Lending Lab
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-primary mb-6 leading-[1.1]" data-testid="text-hero-title">
            {CONTENT.hero.headline}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            {CONTENT.hero.subhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white h-14 px-8 text-base font-bold rounded-full shadow-lg transition-transform hover:-translate-y-0.5" asChild data-testid="button-check-eligibility">
              <Link href="/eligibility">
                {CONTENT.hero.cta1}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-border/80 bg-white hover:bg-muted/50 rounded-full" asChild data-testid="button-prequal">
              <Link href="/prequal">
                {CONTENT.hero.cta2}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-border/60">
            <div data-testid="stat-deployed">
              <p className="text-2xl font-bold font-display text-primary">${(RULES.CYCLE1_DEPLOYED / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground mt-1">Deployed in Cycle 1</p>
            </div>
            <div data-testid="stat-schools">
              <p className="text-2xl font-bold font-display text-primary">{RULES.CYCLE1_SCHOOLS}</p>
              <p className="text-sm text-muted-foreground mt-1">Schools funded</p>
            </div>
            <div data-testid="stat-states">
              <p className="text-2xl font-bold font-display text-primary">{RULES.CYCLE1_STATES}</p>
              <p className="text-sm text-muted-foreground mt-1">States</p>
            </div>
            <div data-testid="stat-repayment">
              <p className="text-2xl font-bold font-display text-primary">{RULES.CYCLE1_REPAYMENT_RATE}%</p>
              <p className="text-sm text-muted-foreground mt-1">On-time repayment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
