import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-2xl mb-4 text-primary">The Lending Lab</h3>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Patient microloans for the school founders that banks typically won't serve. Backed by the Building Hope Impact Fund.
            </p>
            <div className="inline-block bg-primary/5 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/10">
              Goal: $3M | 2026-27 Fundraising Goal
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary tracking-wide uppercase text-sm">Resources</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><Link href="#opportunity" className="hover:text-secondary transition-colors">The Opportunity</Link></li>
              <li><Link href="#loan-details" className="hover:text-secondary transition-colors">How It Works</Link></li>
              <li><Link href="#faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><a href="https://schoolstack.ai" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">SchoolStack.ai</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary tracking-wide uppercase text-sm">Contact</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><a href="mailto:abevilacqua@bhope.org" className="hover:text-secondary transition-colors">Amy Bevilacqua, President</a></li>
              <li><a href="mailto:aserafin@bhope.org" className="hover:text-secondary transition-colors">Allison Serafin</a></li>
              <li><a href="https://buildinghopeimpactfund.org" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">buildinghopeimpactfund.org</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-foreground/70">
          <p>© {new Date().getFullYear()} Building Hope Impact Fund. A 501(c)(3) organization.</p>
          <p>Washington, DC</p>
        </div>
      </div>
    </footer>
  );
}
