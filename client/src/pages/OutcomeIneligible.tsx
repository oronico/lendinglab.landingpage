import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ExternalLink, Mail } from "lucide-react";
import { RULES } from "@shared/rules";

export default function OutcomeIneligible() {
  const params = new URLSearchParams(window.location.search);
  const reasonsParam = params.get("reasons");
  const reasons = reasonsParam ? reasonsParam.split("|") : [];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="shadow-lg border-0" data-testid="screen-ineligible">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold" data-testid="badge-ineligible">
                Not Eligible
              </div>
              <h1 className="text-2xl font-display font-bold text-primary">Not eligible this cycle.</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Based on your responses, your school does not currently meet Lending Lab requirements. Here's what would need to change:
              </p>

              {reasons.length > 0 && (
                <div className="bg-red-50 p-6 rounded-lg text-left max-w-lg mx-auto">
                  <ul className="space-y-2 text-sm text-red-700">
                    {reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-5 max-w-lg mx-auto text-left">
                  <p className="text-sm text-muted-foreground mb-3">
                    Not ready yet? We're building SchoolStack.ai to help early-stage schools like yours build the foundation you need — coming soon.
                  </p>
                  <a
                    href="https://schoolstack.ai/?ref=lendinglab&outcome=ineligible"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                    data-testid="link-schoolstack-ineligible"
                  >
                    Learn more <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">Most schools can reapply after addressing these items.</p>
              </div>

              <div className="flex items-center justify-center text-sm text-muted-foreground pt-2">
                <a href={`mailto:${RULES.CONTACT.email}`} className="flex items-center gap-1 text-secondary hover:underline"><Mail className="w-4 h-4" />{RULES.CONTACT.email}</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
