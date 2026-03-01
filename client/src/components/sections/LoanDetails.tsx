import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Clock, Percent } from "lucide-react";

export function LoanDetails() {
  return (
    <section id="loan-details" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Patient Capital for Your School</h3>
          <p className="text-lg text-muted-foreground">
            Our unprecedented loan product is designed to meet you where you are, with terms that traditional lenders simply can't offer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-secondary" />
                Loan Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Loan Range</h4>
                  <p className="text-muted-foreground">$10K–$50K (expanding to $150K as fund exceeds $1M)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Below-Market Rates</h4>
                  <p className="text-muted-foreground">3–6% fixed interest, enabled by philanthropic capital</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Phased Repayment</h4>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Year 1:</strong> Interest-only while enrollment stabilizes<br/>
                    <strong className="text-foreground">Year 2:</strong> Gentle ramp, graduated payments<br/>
                    <strong className="text-foreground">Years 3+:</strong> Full amortization
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Founder-Friendly Terms</h4>
                  <p className="text-muted-foreground">Unsecured. Zero origination fees. No prepayment penalties. Quarterly auto-payments remove friction.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-2xl text-primary font-display flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-secondary" />
                Clear Underwriting Rubric
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Enrollment Demand</h4>
                  <p className="text-muted-foreground">Evidence of family interest, waitlists, and clear community need for your school model.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Leadership & Character</h4>
                  <p className="text-muted-foreground">Founder background, references, and demonstrated commitment to the school's success.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Financial Capacity</h4>
                  <p className="text-muted-foreground">Plaid-verified deposits, financial model review, cash flow, and debt review.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">4</div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Mission Fit</h4>
                  <p className="text-muted-foreground">School model alignment with community need and Building Hope Impact Fund values.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* More Than A Loan Section */}
        <div id="more-than-a-loan" className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl font-display font-bold text-primary mb-4">More Than A Loan</h3>
            <p className="text-lg text-muted-foreground">
              We provide the infrastructure and support to ensure your long-term success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-muted/40 p-8 rounded-2xl border border-border">
              <h4 className="text-xl font-bold text-primary mb-3">Business Infrastructure</h4>
              <p className="text-muted-foreground">
                Every borrower will receive <a href="https://schoolstack.ai" className="text-secondary font-medium hover:underline">SchoolStack.ai</a>. The Lending Lab builds financial fluency alongside capital, helping you manage finances, operations, and enrollment.
              </p>
            </div>
            
            <div className="bg-muted/40 p-8 rounded-2xl border border-border">
              <h4 className="text-xl font-bold text-primary mb-3">The On-Ramp to Growth</h4>
              <p className="text-muted-foreground">
                Schools that stabilize through The Lending Lab build the credit history and operational track record to qualify for Evergreen Loan Fund capital ($150K+).
              </p>
            </div>
            
            <div className="bg-muted/40 p-8 rounded-2xl border border-border">
              <h4 className="text-xl font-bold text-primary mb-3">Revolving Impact</h4>
              <p className="text-muted-foreground">
                Every dollar repaid is redeployed to the next founder. Philanthropic investment becomes a permanent lending infrastructure that compounds over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
