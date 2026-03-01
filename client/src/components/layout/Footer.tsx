import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-xl mb-4 text-primary">The Lending Lab</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Patient microloans for the school founders that banks typically won't serve. Backed by the Building Hope Impact Fund.
            </p>
            <p className="text-sm text-muted-foreground">
              Goal: $3M | 2026-27 Fundraising Goal
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#opportunity" className="hover:text-primary transition-colors">The Opportunity</Link></li>
              <li><Link href="#loan-details" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><a href="https://schoolstack.ai" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">SchoolStack.ai</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:abevilacqua@bhope.org" className="hover:text-primary transition-colors">Amy Bevilacqua, President</a></li>
              <li><a href="mailto:aserafin@bhope.org" className="hover:text-primary transition-colors">Allison Serafin</a></li>
              <li><a href="https://buildinghopeimpactfund.org" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">buildinghopeimpactfund.org</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Building Hope Impact Fund. A 501(c)(3) organization.</p>
          <p>Washington, DC</p>
        </div>
      </div>
    </footer>
  );
}
