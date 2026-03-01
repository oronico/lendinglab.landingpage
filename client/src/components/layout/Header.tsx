import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl tracking-tight text-primary">The Lending Lab</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#opportunity" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              The Opportunity
            </Link>
            <Link href="#loan-details" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Loan Details
            </Link>
            <Link href="#more-than-a-loan" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              More Than A Loan
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hidden md:flex">
            <a href="https://www.buildinghope.org/about-building-hope-impact-fund" target="_blank" rel="noreferrer">
              Building Hope Impact Fund
            </a>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
            <Link href="#apply">Apply Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
