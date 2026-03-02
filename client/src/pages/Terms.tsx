import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RULES } from "@shared/rules";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-primary mb-8" data-testid="text-terms-title">Terms of Use</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-base">Last updated: May 2025</p>

            <h2 className="text-lg font-bold text-primary mt-8">Pre-Qualification Screening</h2>
            <p>Completing this screening is not a loan approval or commitment. It is an initial assessment to determine if your school may be eligible for a {RULES.PHILANTHROPY.fund} Lending Lab loan.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Not a Loan Offer</h2>
            <p>Pre-qualification results are preliminary. Final underwriting includes documentation review, reference verification, financial analysis, and may result in different terms or a decline.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Revenue Calculations</h2>
            <p>We do not count philanthropic donations toward repayment capacity. Only earned revenue from tuition and fees is considered when evaluating ability to repay.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Accuracy of Information</h2>
            <p>You certify that all information provided is truthful and accurate. Misrepresentations discovered during underwriting will result in disqualification.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Eligibility Requirements</h2>
            <p>Eligibility requirements are determined by {RULES.PHILANTHROPY.fund} and may change between lending cycles. Meeting pre-qualification criteria does not guarantee loan approval.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Contact</h2>
            <p>Questions? Contact {RULES.CONTACT.name} at <a href={`mailto:${RULES.CONTACT.email}`} className="text-secondary hover:underline">{RULES.CONTACT.email}</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
