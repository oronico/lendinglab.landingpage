import { ClipboardCheck, Search, FolderOpen, FileText, Landmark, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Self-Screen",
    subtitle: "Eligibility Checklist",
    duration: "~5 min",
    icon: ClipboardCheck,
    description: "Complete an interactive checklist to confirm your school meets the basic eligibility requirements before investing time in the full application.",
    details: [
      "Entity type & legal structure",
      "Student enrollment & program basics",
      "Facility & compliance readiness",
    ],
  },
  {
    number: 2,
    title: "Pre-Qualify",
    subtitle: "Screening Wizard",
    duration: "~10–15 min",
    icon: Search,
    description: "Walk through our guided screening wizard that collects key details about your school, enrollment, facility, and finances — including an inline revenue calculator.",
    details: [
      "School info & enrollment data",
      "Revenue calculator & projections",
      "Facility & financial discipline checks",
    ],
  },
  {
    number: 3,
    title: "Prepare",
    subtitle: "Gather Documents",
    duration: "Varies",
    icon: FolderOpen,
    description: "Download the prep guide, gather required documents, reach out to your references, and finalize your 5-year financial model before starting the full application.",
    details: [
      "Download the Loan Prep Guide",
      "Collect signed tuition contracts",
      "Build or finalize your financial model",
      "Line up parent & board references",
    ],
  },
  {
    number: 4,
    title: "Apply",
    subtitle: "Full Application",
    duration: "~60 min with prep",
    icon: FileText,
    description: "Complete the full application with document uploads. If you've done steps 1–3, this should take about an hour.",
    details: [
      "Upload financials & contracts",
      "Provide reference contact info",
      "Select loan amount & use of funds",
      "Connect Plaid & QuickBooks Online",
    ],
  },
  {
    number: 5,
    title: "Underwriting & Funding",
    subtitle: "Review to Closing",
    duration: "2–4 weeks",
    icon: Landmark,
    description: "Our team reviews your application using a rubric across Leadership, Demand, Financials, and Mission. We verify references, review Plaid & QBO data, and schedule an interview.",
    details: [
      "Rubric review & reference checks",
      "Plaid + QBO verification",
      "Interview & term sheet",
      "Closing & ACH disbursement",
    ],
  },
];

const keyDates = [
  { label: "Screening Opens", date: "Now" },
  { label: "Applications Open", date: "Summer 2025" },
  { label: "Underwriting Begins", date: "Rolling" },
  { label: "First Disbursements", date: "Fall 2025" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-3" data-testid="text-how-it-works-label">
            How It Works
          </h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6" data-testid="text-how-it-works-title">
            From Screening to Funding in 5 Steps
          </h3>
          <p className="text-lg text-muted-foreground" data-testid="text-how-it-works-description">
            Our process is designed to be transparent and efficient. Know exactly where you stand at every stage.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.number}
                  className="relative"
                  data-testid={`card-step-${step.number}`}
                >
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 z-10 items-center justify-center w-12 h-12 rounded-full bg-secondary text-white font-bold text-lg shadow-lg border-4 border-white">
                    {step.number}
                  </div>

                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-start ${isEven ? "" : "lg:direction-rtl"}`}>
                    <div className={`${isEven ? "lg:text-right lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}>
                      <div className={`bg-white rounded-2xl shadow-md border border-border/50 p-6 md:p-8 ${isEven ? "" : ""}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm shadow">
                            {step.number}
                          </div>
                          <div className="p-2 bg-primary/5 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xl font-display font-bold text-primary" data-testid={`text-step-title-${step.number}`}>
                              {step.title}
                            </h4>
                            <p className="text-sm text-secondary font-semibold">{step.subtitle}</p>
                          </div>
                          <span className="ml-auto text-xs font-medium bg-muted px-3 py-1 rounded-full text-muted-foreground whitespace-nowrap" data-testid={`text-step-duration-${step.number}`}>
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4 text-left" data-testid={`text-step-description-${step.number}`}>
                          {step.description}
                        </p>
                        <ul className="space-y-2 text-left">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={`hidden lg:block ${isEven ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-md border border-border/50 p-8 max-w-3xl mx-auto">
          <h4 className="text-xl font-display font-bold text-primary text-center mb-6" data-testid="text-key-dates-title">
            Key Program Dates
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyDates.map((item, index) => (
              <div key={index} className="text-center" data-testid={`card-key-date-${index}`}>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-lg font-bold text-secondary" data-testid={`text-key-date-${index}`}>{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
