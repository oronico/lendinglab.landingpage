import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RULES } from "@shared/rules";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-primary mb-8" data-testid="text-privacy-title">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-base">Last updated: May 2025</p>

            <h2 className="text-lg font-bold text-primary mt-8">What We Collect</h2>
            <p>When you complete our pre-qualification screening, we collect: school name, state, years operating, entity type, product preference, loan amount, attestations about financial practices, revenue range, credit score range, and your contact information (name, role, email, phone).</p>

            <h2 className="text-lg font-bold text-primary mt-8">What We Do Not Collect</h2>
            <p>We do not collect Social Security numbers, bank login credentials, student names, or reference personal contact information during pre-qualification.</p>

            <h2 className="text-lg font-bold text-primary mt-8">How We Use Your Information</h2>
            <p>Your information is used solely to evaluate your pre-qualification for a Lending Lab loan and to contact you about your application. We store submissions in a secure database with timestamps.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Data Sharing</h2>
            <p>We do not sell your personal information. Your application data is accessible only to {RULES.PHILANTHROPY.fund} program staff for underwriting purposes.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Analytics</h2>
            <p>We use PostHog, a product analytics service, to understand how visitors interact with our site. This helps us improve the application process. Analytics data includes page views, funnel step completion, and submission outcomes. We do not track personally identifiable information through analytics. You can block analytics using standard browser privacy tools or ad blockers.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Data Security</h2>
            <p>All data is transmitted over encrypted connections. Database access is restricted to authorized personnel. We do not log personally identifiable information in application logs.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Contact</h2>
            <p>Questions about this policy? Contact {RULES.CONTACT.name} at <a href={`mailto:${RULES.CONTACT.email}`} className="text-secondary hover:underline">{RULES.CONTACT.email}</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
