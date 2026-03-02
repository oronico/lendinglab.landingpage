import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RULES } from "@shared/rules";

export default function Accessibility() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-primary mb-8" data-testid="text-accessibility-title">Accessibility Statement</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-base">Last updated: March 2026</p>

            <h2 className="text-lg font-bold text-primary mt-8">Our Commitment</h2>
            <p>The Lending Lab is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Standards</h2>
            <p>We aim to conform to WCAG 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Measures</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Semantic HTML</li>
              <li>Keyboard navigation</li>
              <li>Sufficient color contrast</li>
              <li>Descriptive link text</li>
              <li>Form labels and error messages</li>
              <li>Responsive design across devices</li>
            </ul>

            <h2 className="text-lg font-bold text-primary mt-8">Feedback</h2>
            <p>If you experience any accessibility barriers, contact {RULES.CONTACT.name} at <a href={`mailto:${RULES.CONTACT.email}`} className="text-secondary hover:underline">{RULES.CONTACT.email}</a>. We take accessibility feedback seriously and will respond within 5 business days.</p>

            <h2 className="text-lg font-bold text-primary mt-8">Third-Party Content</h2>
            <p>While we strive to ensure accessibility, some third-party content or tools linked from our site may not fully meet accessibility standards.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
