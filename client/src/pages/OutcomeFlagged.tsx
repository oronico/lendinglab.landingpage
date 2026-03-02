import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, AlertCircle, Mail, Phone, CalendarClock } from "lucide-react";
import { RULES } from "@shared/rules";

export default function OutcomeFlagged() {
  const params = new URLSearchParams(window.location.search);
  const flagsParam = params.get("flags");
  const flags = flagsParam ? flagsParam.split("|") : [];
  const leadId = params.get("leadId") || "";

  const hasHandoffUrl = RULES.HANDOFF_URL_FLAGGED.length > 0;
  const applicationsOpen = RULES.APPLICATIONS_OPEN;

  function handleApply() {
    if (hasHandoffUrl) {
      const url = new URL(RULES.HANDOFF_URL_FLAGGED);
      if (leadId) url.searchParams.set("leadId", leadId);
      window.location.href = url.toString();
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="shadow-lg border-0" data-testid="screen-flagged">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold" data-testid="badge-flagged">
                Flagged for Review
              </div>
              <h1 className="text-2xl font-display font-bold text-primary">Additional information needed.</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your screening has been submitted. Some items need follow-up before your application can move forward.
              </p>

              {flags.length > 0 && (
                <div className="bg-amber-50 p-6 rounded-lg text-left max-w-lg mx-auto">
                  <h4 className="font-bold text-amber-800 mb-3">Items to address:</h4>
                  <ul className="space-y-2 text-sm text-amber-700">
                    {flags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 space-y-3">
                {applicationsOpen && hasHandoffUrl ? (
                  <>
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg" data-testid="button-apply-flagged" onClick={handleApply}>
                      Apply with Additional Info <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground">You may still apply. Addressing these items will strengthen your application.</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/10 text-secondary font-semibold">
                      <CalendarClock className="w-5 h-5" />
                      Applications open {RULES.APPLICATIONS_OPEN_DATE}
                    </div>
                    <p className="text-sm text-muted-foreground">Your screening has been saved. Address the flagged items above before applications open.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
                <a href={`mailto:${RULES.CONTACT.email}`} className="flex items-center gap-1 text-secondary hover:underline"><Mail className="w-4 h-4" />{RULES.CONTACT.email}</a>
                <span>|</span>
                <a href={`tel:${RULES.CONTACT.phone.replace(/[^\d]/g, '')}`} className="flex items-center gap-1 text-secondary hover:underline"><Phone className="w-4 h-4" />{RULES.CONTACT.phone}</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
