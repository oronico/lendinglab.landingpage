import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, FileText, Mail, CalendarClock } from "lucide-react";
import { RULES } from "@shared/rules";

export default function OutcomeQualified() {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product") || "term_loan";
  const leadId = params.get("leadId") || "";

  const hasHandoffUrl = RULES.HANDOFF_URL_QUALIFIED.length > 0;
  const applicationsOpen = RULES.APPLICATIONS_OPEN;

  function handleApply() {
    if (hasHandoffUrl) {
      const url = new URL(RULES.HANDOFF_URL_QUALIFIED);
      if (leadId) url.searchParams.set("leadId", leadId);
      url.searchParams.set("product", product);
      window.location.href = url.toString();
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="shadow-lg border-0" data-testid="screen-qualified">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold" data-testid="badge-qualified">
                Qualified
              </div>
              <h1 className="text-2xl font-display font-bold text-primary">You pre-qualify for the Lending Lab.</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Based on your responses, your school meets our initial criteria for a {product === "loc" ? "line of credit" : "term loan"}. Next step: complete the full application.
              </p>

              <div className="bg-muted/40 p-6 rounded-lg text-left max-w-md mx-auto">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Documents to prepare
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />5-year financial model</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Signed tuition contracts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Certificate of insurance ($2M/$1M GL)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Signed lease or facility agreement</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Articles of incorporation / operating agreement</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Parent and board member references</li>
                </ul>
              </div>

              <div className="pt-4">
                {applicationsOpen && hasHandoffUrl ? (
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg" data-testid="button-apply-now" onClick={handleApply}>
                    Proceed to Full Application <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/10 text-secondary font-semibold">
                      <CalendarClock className="w-5 h-5" />
                      Applications open {RULES.APPLICATIONS_OPEN_DATE}
                    </div>
                    <p className="text-sm text-muted-foreground">Your pre-qualification has been saved. We'll notify you when applications open.</p>
                  </div>
                )}
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
