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
        a: "Yes, if you own the home. Schools operating from a residential dwelling are eligible provided the applicant owns the property and can submit the deed as part of the application. All applicants must also carry at least $2M/$1M general liability insurance.",
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
        a: "Yes! Year 0 (pre-launch) schools are eligible. Since there's no operating history, we'll evaluate your signed tuition contracts, enrollment deposits (all enrolled families must have paid the deposit specified in their contract), financial model, facility plan, and references. You'll also need to provide a personal financial statement from the founder.",
      },
    ],
  },
  {
    title: "Loan Products",
    items: [
      {
        q: "What loan products are available?",
        a: "We offer two products: (1) Term Loans ranging from $10,000 to $50,000 in $10,000 increments with 3–5 year terms and quarterly payments, and (2) a Working Capital Revolving Line of Credit (Revolver) with commitments up to $100,000, a 12-month draw period, and 18–24 month total maturity. Both products carry 3–6% interest (determined during underwriting), a 2% origination fee, and no prepayment penalty.",
      },
      {
        q: "How much can I borrow with a Term Loan?",
        a: "Term Loans range from $10,000 to $50,000 in $10,000 increments. Interest is 3–6% (rate determined during underwriting) with a 2% origination fee. Terms are 3–5 years with quarterly payments. A UCC-1 filing is placed on pledged revenues and assets. Personal guarantees may be required depending on your credit profile, and a credit check is performed.",
      },
      {
        q: "Can I pay off my loan early?",
        a: "Absolutely. There is no prepayment penalty on either product. We celebrate when a school is able to pay off early — for example, after receiving an ESA disbursement or a large philanthropic grant.",
      },
      {
        q: "Is a personal guarantee required?",
        a: "Personal guarantees may be required, dependent on your credit profile. This is determined during underwriting. A credit check is performed for all applicants.",
      },
    ],
  },
  {
    title: "Revolving Line of Credit",
    items: [
      {
        q: "What is the revolving line of credit?",
        a: "The Working Capital Revolving Line of Credit (Revolver) is designed to address timing gaps and predictable seasonality in your school's cash flow. It is not intended for structural deficits. Commitments are available up to $100,000 with a 12-month draw period and 18–24 month total maturity (or 12 months with a renewal option).",
      },
      {
        q: "How do draws work?",
        a: "Draws are initiated by a simple written request. Funds are delivered via ACH credit, typically same-day or next-day. You can draw any amount up to your available commitment during the 12-month draw period.",
      },
      {
        q: "What is the clean-up requirement?",
        a: "Your outstanding balance must pay down to 10% or less of your total line for at least 30 consecutive days, at least once every 12 months. This ensures the line is being used for short-term working capital needs rather than as permanent financing.",
      },
      {
        q: "What are the LOC restrictions?",
        a: "Funds from the revolving line of credit cannot be used for payroll catch-up, past-due rent, debt refinance, or international work. These use-of-funds limitations ensure the line supports healthy cash flow management.",
      },
      {
        q: "How is LOC interest calculated?",
        a: "Interest at 3–6% is charged only on the drawn balance and accrued daily. Payments are monthly interest-only via ACH auto-debit. You can repay principal at any time via ACH with no prepayment penalty. A 2% origination fee also applies.",
      },
      {
        q: "What ongoing controls apply to the LOC?",
        a: "LOC borrowers must maintain a Plaid connection (continuous monitoring), provide quarterly financial reporting, and may not take on additional debt without prior approval. An optional reserve requirement (minimum cash reserve in a segregated account) may also apply.",
      },
    ],
  },
  {
    title: "Application & Documents",
    items: [
      {
        q: "What documents do I need to prepare before applying?",
        a: "For Year 2+ schools: tax filings, end-of-year balance sheet, P&L statement, and cash flow statement, along with YTD financials, signed tuition contracts, a 5-year financial model, articles of incorporation or operating agreement, proof of $2M/$1M general liability insurance, and lease documentation. Nonprofits also need a signed board resolution letter, IRS determination letter, and an independent board member as co-applicant. Year 0 schools substitute a personal financial statement and lean on contracts, deposits, and their financial model.",
      },
      {
        q: "How long does the application process take?",
        a: "The screening wizard takes about 10-15 minutes. If you pre-qualify, the full application takes approximately 60 minutes if you've prepared your documents in advance. Download our Preparation Guide before starting. Underwriting, reference checks, credit check, and Plaid/QBO verification follow your submission.",
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
        q: "What counts as an enrollment deposit?",
        a: "All enrolled families must have paid the enrollment deposit specified in their signed tuition contract. The deposit amount is defined in each family's contract — there is no fixed dollar minimum. Deposits demonstrate real demand from real families and are verified during underwriting.",
      },
      {
        q: "What if we haven't collected deposits yet?",
        a: "All borrowers must have signed tuition contracts with enrolled families, and all enrolled families must have paid the enrollment deposit specified in their contract. If you haven't reached that point yet, focus on enrollment outreach and securing signed contracts before applying.",
      },
      {
        q: "What qualifies as a tuition contract?",
        a: "Actual signed tuition contracts — not handbooks or general enrollment forms. The contract must specify the required enrollment deposit. These contracts are verified during underwriting.",
      },
    ],
  },
  {
    title: "Insurance & Facility Requirements",
    items: [
      {
        q: "What insurance coverage is required?",
        a: "All applicants must carry at least $2,000,000/$1,000,000 general liability insurance. If you don't currently have this coverage, you can indicate that you will obtain it before closing.",
      },
      {
        q: "What if I don't have a signed lease yet?",
        a: "You need at minimum a Letter of Intent (LOI) plus a contractor budget showing your facility plan. If you're still actively searching for a facility with nothing secured, you cannot proceed with the application at this time. All applicants with a signed lease must demonstrate on-time rent payments.",
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
        a: "Paying staff through Venmo, Zelle, Cash App, or cash is a red flag for financial discipline and creates legal and tax compliance risks. A formal payroll system (e.g., Gusto) ensures proper tax withholding, creates an audit trail, and demonstrates the operational maturity we look for in borrowers. This applies to all applicants with staff.",
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
        a: "Plaid connects your business bank account for secure, automated loan payments via ACH — removing friction and reducing default risk. For LOC borrowers, Plaid provides continuous monitoring. QuickBooks Online gives us (and you) real-time visibility into your school's financial health. Both are mandatory for all borrowers and help us support you proactively if issues arise.",
      },
    ],
  },
  {
    title: "Governance & Board (Nonprofits)",
    items: [
      {
        q: "What are the board independence and resolution requirements for nonprofits?",
        a: "Nonprofits must have a board where a majority of members are independent of the organization and school leader — meaning no spouses, employees, or vendors. You'll need a signed board resolution letter from the full board (with member emails) approving pursuit of the loan. An independent board member must serve as co-applicant — this person cannot be an employee, contractor, or related to the school leader. These requirements ensure proper governance and accountability.",
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
        a: "Contact us immediately. Our goal is to support your school's success, not to penalize you. We'll work with you to understand the situation and explore options. That said, consistent on-time payment is expected — Cycle 1 achieved 100% on-time repayment across all 11 schools. Term loan payments are collected quarterly via ACH, and LOC interest payments are collected monthly via ACH auto-debit.",
      },
    ],
  },
  {
    title: "Retention & Attrition",
    items: [
      {
        q: "What retention and attrition data do I need to provide?",
        a: "Operating schools (Year 1+) must provide two data points: your 2024-25 Retention Rate (%) and your 2025-26 Projected Attrition (%). These are separate fields that help us understand enrollment stability and forecast your school's financial health.",
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
