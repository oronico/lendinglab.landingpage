import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import heroImage from "@/assets/images/hero-classroom.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20 mb-6">
              Building Hope Impact Fund
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-primary mb-6 leading-[1.1]">
              Patient microloans for the school founders that banks typically won't serve.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              We provide below-market capital paired with business infrastructure to help microschools and early-stage education entrepreneurs launch, stabilize, and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-medium" asChild>
                <a href="#apply">
                  Check Eligibility & Apply
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium border-border hover:bg-muted/50" asChild>
                <a href="#loan-details">
                  View Loan Terms
                </a>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t">
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <GraduationCap className="h-5 w-5" />
                  <h3 className="font-bold text-2xl font-display">$410K</h3>
                </div>
                <p className="text-sm text-muted-foreground">Deployed in Cycle 1</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-bold text-2xl font-display">$450K</h3>
                </div>
                <p className="text-sm text-muted-foreground">Available in Cycle 2</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="font-bold text-2xl font-display">100%</h3>
                </div>
                <p className="text-sm text-muted-foreground">On-time repayment</p>
              </div>
            </div>
          </div>
          
          <div className="relative lg:ml-auto w-full max-w-[600px]">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
              <img 
                src={heroImage} 
                alt="Modern diverse microschool classroom" 
                className="object-cover w-full h-full"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute inset-0 bg-secondary/10 translate-x-4 translate-y-4 rounded-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-20 max-w-[240px] border border-border/50">
              <p className="text-sm font-medium text-primary mb-1">Permanent Infrastructure</p>
              <p className="text-xs text-muted-foreground">This is not a pilot. It is a permanent lending program that scales with the fund.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
