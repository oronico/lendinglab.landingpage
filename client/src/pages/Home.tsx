import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { EligibilityChecklist } from "@/components/sections/EligibilityChecklist";
import { LoanDetails } from "@/components/sections/LoanDetails";
import { FAQ } from "@/components/sections/FAQ";
import { ScreeningFlow } from "@/components/sections/ScreeningFlow";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <EligibilityChecklist />
        <ScreeningFlow />
        <HowItWorks />
        <LoanDetails />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
