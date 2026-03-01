import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTENT } from "@shared/content";
import { RULES } from "@shared/rules";

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">FAQ</p>
          <h2 data-testid="text-faq-title" className="text-3xl md:text-4xl font-display font-bold text-primary">
            Common Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {CONTENT.faq.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              data-testid={`faq-item-${idx}`}
              className="bg-background px-6 rounded-xl border border-border/60"
            >
              <AccordionTrigger className="text-left font-display font-bold text-base hover:no-underline py-4 text-primary hover:text-secondary transition-colors">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div data-testid="faq-contact-info" className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Still have questions? Contact{" "}
            <a href={`mailto:${RULES.CONTACT.email}`} className="text-secondary hover:underline font-medium" data-testid="link-contact-email">
              {RULES.CONTACT.name}
            </a>{" "}
            at{" "}
            <a href={`tel:${RULES.CONTACT.phone.replace(/[^\d]/g, '')}`} className="text-secondary hover:underline font-medium" data-testid="link-contact-phone">
              {RULES.CONTACT.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
