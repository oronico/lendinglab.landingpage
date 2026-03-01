import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone } from "lucide-react";

const faqCategories = [
  {
    title: "Eligibility",
    items: [
      {
        q: "Can I apply if my school operates out of a home?",
        a: "No. Loans cannot be used for schools operating in residential dwellings. You must have a dedicated commercial, institutional, or otherwise non-residential facility with a signed lease, ownership, or an LOI plus a contractor budget.",
      },
      {
        q: "Is my school eligible if we're fully online with no physical location?",
        a: "The program is designed for schools with a physical facility serving K-12 students in person. Fully online programs without a physical site are not eligible at this time.",
      },
      {
        q: "We primarily serve children under age 5. Can we apply?",
        a: "No. This program is for K-12 schools serving students roughly ages 5-18. If your program primarily serves children under age 3 or operates as a daycare or childcare center, it is not eligible.",
      },
      {
        q: "Can I apply for loans for multiple schools in my network?",
        a: "Each school must apply separately with its own EIN, financials, and enrollment data. If you operate multiple schools, each location submits its own application and is underwritten independently.",
      },
      {
        q: "Is my religiously affiliated school eligible?",
        a: "Yes. Religiously affiliated schools are welcome to apply as long as they meet all other eligibility requirements — entity structure, enrollment, facility, and financial discipline standards.",
      },
      {
        q: "My school hasn't opened yet (Year 0). Can I still apply?",
        a: "Yes! Year 0 (pre-launch) schools are eligible, but loans are capped at $25,000. Since there's no operating history, we'll evaluate your signed tuition contracts, $25+ enrollment deposits (minimum 10 families), financial model, facility plan, and references. You'll also need to provide a personal financial statement from the founder.",
      },
    ],
  },
  {
    title: "Loan Terms",
    items: [
      {
        q: "How much can I borrow and what are the terms?",
        a: "Loans range from $5,000 to $50,000 in $5,000 increments at a fixed 3% annual interest rate. There are zero fees, no personal guarantee, and no credit check. Loan terms scale by amount: $5K-$10K = 3 years, $15K-$25K = 4 years, $30K-$50K = 5 years. Year 0 schools are capped at $25K.",
      },
      {
        q: "How does the graduated repayment schedule work?",
        a: "Payments are made quarterly and increase gradually. Year 1 is interest-only (e.g., $75/quarter on a $10K loan). Year 2 shifts to partial principal + interest. Years 3+ move to full amortization. This structure gives your school time to grow revenue before full payments begin.",
      },
      {
        q: "Can I pay off my loan early?",
        a: "Absolutely. There are zero prepayment fees or penalties. We celebrate when a school is able to pay off early — for example, after receiving an ESA disbursement or a large philanthropic grant.",
      },
    ],
  },
  {
    title: "Application & Documents",
    items: [
      {
        q: "What documents do I need to prepare before applying?",
        a: "For Year 1+ schools: balance sheet, P&L statement, cash forecast, YTD financials, most recent tax return, signed tuition contracts, a 5-year financial model, articles of incorporation or operating agreement, proof of insurance, and lease documentation. Nonprofits also need a signed board resolution letter and IRS determination letter. Year 0 schools substitute a personal financial statement and lean on contracts, deposits, and their financial model.",
      },
      {
        q: "How long does the application process take?",
        a: "The screening wizard takes about 10-15 minutes. If you pre-qualify, the full application takes approximately 60 minutes if you've prepared your documents in advance. Download our Preparation Guide before starting. Underwriting, reference checks, and Plaid/QBO verification follow your submission.",
      },
      {
        q: "How competitive is the process? How many schools get funded?",
        a: "In Cycle 1, we deployed $410K across 11 schools in 8 states with 100% on-time repayment. We're looking for schools that demonstrate strong demand, financial discipline, and mission alignment. Meeting all eligibility requirements and providing complete, accurate information gives you the best chance.",
      },
    ],
  },
  {
    title: "Deposits & Enrollment",
    items: [
      {
        q: "What counts as a $25 enrollment deposit?",
        a: "A minimum $25 deposit per family collected to confirm enrollment intent. These must be from at least 10 separate families for Year 0 and Year 1 schools. Deposits demonstrate real demand from real families and are verified during underwriting.",
      },
      {
        q: "What if we haven't collected deposits yet?",
        a: "Year 0 and Year 1 schools must have collected $25+ deposits from at least 10 families to proceed. If you haven't reached that threshold yet, focus on enrollment outreach first and apply when you have the deposits in hand.",
      },
    ],
  },
  {
    title: "Facility Requirements",
    items: [
      {
        q: "What if I don't have a signed lease yet?",
        a: "You need at minimum a Letter of Intent (LOI) plus a contractor budget showing your facility plan. If you're still actively searching for a facility with nothing secured, you cannot proceed with the application at this time.",
      },
      {
        q: "Do I need a fire inspection and certificate of occupancy?",
        a: "We ask about both during screening. Not having them isn't an automatic disqualification, but it will be flagged during underwriting. These are important safety and compliance indicators, and we strongly recommend having them in place before applying.",
      },
    ],
  },
  {
    title: "Financial Discipline",
    items: [
      {
        q: "Why do you require a formal payroll system like Gusto?",
        a: "Paying staff through Venmo, Zelle, Cash App, or cash is a red flag for financial discipline and creates legal and tax compliance risks. A formal payroll system (e.g., Gusto) ensures proper tax withholding, creates an audit trail, and demonstrates the operational maturity we look for in borrowers.",
      },
      {
        q: "Why can't I mix personal and business finances?",
        a: "Commingling personal and business funds is one of the most common signs of financial risk in small organizations. It makes it impossible to accurately assess the school's true financial position, creates liability issues, and was a lesson learned from Cycle 1. A dedicated business bank account is required.",
      },
    ],
  },
  {
    title: "Plaid & QuickBooks",
    items: [
      {
        q: "Why do you require both Plaid and QuickBooks Online?",
        a: "Plaid connects your business bank account for secure, automated quarterly loan payments via ACH — removing friction and reducing default risk. QuickBooks Online gives us (and you) real-time visibility into your school's financial health. Both are mandatory for all borrowers and help us support you proactively if issues arise.",
      },
    ],
  },
  {
    title: "Governance & Board (Nonprofits)",
    items: [
      {
        q: "What are the board independence and resolution requirements for nonprofits?",
        a: "Nonprofits must have a board where a majority of members are independent of the organization and school leader — meaning no spouses, employees, or vendors. You'll need a signed board resolution letter from the full board (with member emails) approving pursuit of the loan, and a board member must serve as co-applicant. These requirements ensure proper governance and accountability.",
      },
    ],
  },
  {
    title: "References",
    items: [
      {
        q: "Who qualifies as a reference, and what will you ask them?",
        a: "You must provide two references: one currently enrolled parent and one unrelated board member. These are strict requirements — we cannot substitute other reference types. We'll contact them to verify enrollment, assess school quality and leadership, and confirm the information in your application is accurate.",
      },
    ],
  },
  {
    title: "Repayment",
    items: [
      {
        q: "What happens if my school can't make a payment?",
        a: "Contact us immediately. Our goal is to support your school's success, not to penalize you. We'll work with you to understand the situation and explore options. That said, consistent on-time payment is expected — Cycle 1 achieved 100% on-time repayment across all 11 schools. Payments are collected automatically via Plaid-connected ACH on a quarterly schedule.",
      },
    ],
  },
];

export function FAQ() {
  let itemIndex = 0;

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-secondary/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-secondary" />
          </div>
          <h2 data-testid="text-faq-title" className="text-3xl md:text-5xl font-display font-bold text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detailed answers about eligibility, loan terms, requirements, and the application process.
          </p>
        </div>

        {faqCategories.map((category) => (
          <div key={category.title} className="mb-10">
            <h3 data-testid={`text-faq-category-${category.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`} className="text-xl font-display font-bold text-primary mb-4 pl-2 border-l-4 border-secondary">
              {category.title}
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {category.items.map((item) => {
                itemIndex++;
                const value = `item-${itemIndex}`;
                return (
                  <AccordionItem
                    key={value}
                    value={value}
                    data-testid={`faq-item-${itemIndex}`}
                    className="bg-background px-8 rounded-2xl border border-border/60 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-display font-bold text-lg hover:no-underline py-5 text-primary hover:text-secondary transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}

        <div data-testid="faq-contact-info" className="mt-16 text-center bg-primary/5 rounded-2xl p-10 border border-primary/10">
          <h3 className="text-2xl font-display font-bold text-primary mb-4">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Reach out to Allison Serafin, Program Director, for personalized guidance on your application.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:aserafin@bhope.org"
              data-testid="link-contact-email"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              aserafin@bhope.org
            </a>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <a
              href="tel:+17025399230"
              data-testid="link-contact-phone"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              (702) 539-9230
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
