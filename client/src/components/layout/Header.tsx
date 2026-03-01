import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-2xl tracking-tight text-primary">The Lending Lab</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center ml-8">
            <Link href="#opportunity" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              The Opportunity
            </Link>
            <Link href="#loan-details" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              Loan Details
            </Link>
            <Link href="#faq" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hidden md:flex font-semibold">
            <a href="https://www.buildinghope.org/about-building-hope-impact-fund" target="_blank" rel="noreferrer">
              Building Hope Impact Fund
            </a>
          </Button>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-md rounded-full px-6 h-11">
            <Link href="#apply">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
