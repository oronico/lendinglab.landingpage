import { Link } from "wouter";
import { RULES } from "@shared/rules";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-2 text-primary">The Lending Lab</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Capital for schools that run like a business. A program of {RULES.PHILANTHROPY.fund}.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by {RULES.PHILANTHROPY.partners.join(" & ")}.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-3">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/eligibility" className="hover:text-secondary transition-colors">Eligibility</Link></li>
              <li><Link href="/prequal" className="hover:text-secondary transition-colors">Pre-Qualify</Link></li>
              <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-secondary transition-colors">Terms</Link></li>
              <li><Link href="/accessibility" className="hover:text-secondary transition-colors">Accessibility</Link></li>
              <li><a href="https://schoolstack.ai/?ref=lendinglab" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">SchoolStack.ai</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="font-medium text-primary">{RULES.CONTACT.name}</li>
              <li><a href={`mailto:${RULES.CONTACT.email}`} className="hover:text-secondary transition-colors">{RULES.CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} {RULES.PHILANTHROPY.fund}. Washington, DC.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-secondary">Privacy</Link>
            <Link href="/terms" className="hover:text-secondary">Terms</Link>
            <Link href="/accessibility" className="hover:text-secondary">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
