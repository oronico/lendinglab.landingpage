import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Opportunity } from "@/components/sections/Opportunity";
import { LoanDetails } from "@/components/sections/LoanDetails";
import { ScreeningFlow } from "@/components/sections/ScreeningFlow";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <Opportunity />
        <LoanDetails />
        <ScreeningFlow />
      </main>
      <Footer />
    </div>
  );
}
