import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Common Questions</h2>
          <p className="text-lg text-muted-foreground">
            Clear answers about our underwriting process and requirements.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
              I run a 501(c)(3) nonprofit. Why do I need a Personal Guarantee?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              <p className="mb-4">
                This is a common friction point, but it's standard practice for unsecured alternative lending. Because a 501(c)(3) is "owned by the public" rather than individuals, and our loans are often unsecured (meaning we don't take a lien on your building), we require an Executive Director, Founder, or Board Member to sign a Personal Guarantee (PG).
              </p>
              <p>
                The goal of the PG isn't necessarily that you have the personal net worth to pay off the loan in full. Instead, it ensures "skin in the game" and absolute alignment—meaning the leadership won't simply walk away if the school faces challenges. Alternatively, a high-net-worth board member can act as a philanthropic backer and sign a limited guarantee.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
              What if my school is brand new (Year 0)?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              Yes, we lend to Year 0 schools! However, because there is no operational history or existing cash flow, loans for Year 0 schools are capped at $10,000. You must still demonstrate strong family demand (waitlists), a finalized facility plan, and a clear path to breaking even.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
              Are there prepayment penalties?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              No. We celebrate when a school is able to pay off their loan early (for example, if you receive an ESA disbursement or a large philanthropic grant). There are zero prepayment fees or penalties.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
              How are payments collected?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              To remove friction and reduce the risk of defaults, our loans utilize a Plaid integration to support autodebit quarterly payments. This ensures payments are handled automatically as your school grows.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
