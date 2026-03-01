import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col">
          <span className="font-display font-bold text-xl tracking-tight text-primary" data-testid="text-logo">The Lending Lab</span>
          <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">by Building Hope Impact Fund</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          {isHome ? (
            <>
              <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Products</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How It Works</a>
              <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</a>
            </>
          ) : (
            <>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/eligibility" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Eligibility</Link>
            </>
          )}
        </nav>
        <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-sm rounded-full px-5 h-10 text-sm" data-testid="button-get-started">
          <Link href="/eligibility">Check Eligibility</Link>
        </Button>
      </div>
    </header>
  );
}
