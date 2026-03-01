export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-2xl mb-4 text-primary">The Lending Lab</h3>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Patient microloans for the school founders that banks typically won't serve. $5K-$50K at 3% fixed. No fees. No personal guarantee. No credit check.
            </p>
            <p className="text-sm text-muted-foreground">
              Backed by the <a href="https://www.buildinghope.org/about-building-hope-impact-fund" target="_blank" rel="noreferrer" className="text-secondary hover:underline font-medium">Building Hope Impact Fund</a>, a 501(c)(3) organization.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary tracking-wide uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><a href="#eligibility" className="hover:text-secondary transition-colors">Eligibility Checklist</a></li>
              <li><a href="#apply" className="hover:text-secondary transition-colors">Pre-Qualify</a></li>
              <li><a href="#how-it-works" className="hover:text-secondary transition-colors">How It Works</a></li>
              <li><a href="#loan-details" className="hover:text-secondary transition-colors">Loan Details</a></li>
              <li><a href="#faq" className="hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="https://schoolstack.ai" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">SchoolStack.ai</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary tracking-wide uppercase text-sm">Contact</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li>
                <span className="block text-primary font-semibold">Allison Serafin</span>
                <span className="text-sm">Lending Lab Program Manager</span>
              </li>
              <li><a href="mailto:aserafin@bhope.org" className="hover:text-secondary transition-colors" data-testid="link-email-allison">aserafin@bhope.org</a></li>
              <li><a href="tel:7025399230" className="hover:text-secondary transition-colors" data-testid="link-phone-allison">(702) 539-9230</a></li>
              <li className="pt-2 border-t border-border/30">
                <span className="block text-primary font-semibold">Amy Bevilacqua</span>
                <span className="text-sm">President, Building Hope Impact Fund</span>
              </li>
              <li><a href="mailto:abevilacqua@bhope.org" className="hover:text-secondary transition-colors">abevilacqua@bhope.org</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-foreground/70">
          <p>&copy; {new Date().getFullYear()} Building Hope Impact Fund. A 501(c)(3) organization.</p>
          <p>Washington, DC</p>
        </div>
      </div>
    </footer>
  );
}
