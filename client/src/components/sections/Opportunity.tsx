import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Target, Users, MapPin, Building, ShieldCheck } from "lucide-react";
import founderImage from "@/assets/images/founder.jpg";

export function Opportunity() {
  return (
    <section id="opportunity" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-3">The Opportunity</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Bridging the Capital Desert</h3>
          <p className="text-lg text-muted-foreground">
            Microschools are among the fastest-growing segments in K-12 education, yet their founders face systemic barriers to traditional funding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">Female-Led Innovation</h4>
                  <p className="text-muted-foreground">
                    Founders are typically women: moms and former teachers building schools from scratch because their communities need better options.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <Building className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">Denied by Traditional Lenders</h4>
                  <p className="text-muted-foreground">
                    Without established credit history or significant collateral, traditional banks and even SBA programs will not serve them, forcing reliance on risky personal debt.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">The Solution: The Lending Lab</h4>
                  <p className="text-muted-foreground">
                    The first dedicated microloan program designed specifically for small schools and early-stage education entrepreneurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={founderImage} 
                alt="Confident microschool founder" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <p className="text-xl font-display font-medium leading-snug mb-2">
                  "Only 20% of schools could meet lending standards without support, highlighting a significant access gap."
                </p>
                <p className="text-sm opacity-80">— Microloan Pilot Results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-display font-bold text-center text-primary mb-10">Our Four Pillars of School Readiness</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">1. Affordable Facility</h4>
                <p className="text-sm text-muted-foreground">Safe, affordable, accessible, well-maintained buildings.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">2. Financial Health</h4>
                <p className="text-sm text-muted-foreground">Sustainable budgets, funding stability, on-time rent, and cash flow management.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">3. Operational Health</h4>
                <p className="text-sm text-muted-foreground">Clear systems for banking, tuition, payroll, insurance, and compliance.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">4. Demand</h4>
                <p className="text-sm text-muted-foreground">Student recruitment, retention, and capacity utilization driving revenue.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
