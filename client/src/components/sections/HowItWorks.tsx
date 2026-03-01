import { CONTENT } from "@shared/content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3" data-testid="text-how-it-works-label">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary" data-testid="text-how-it-works-title">
            From Screening to Funding
          </h2>
        </div>

        <div className="space-y-0">
          {CONTENT.howItWorks.map((step, idx) => (
            <div
              key={step.step}
              className="flex items-start gap-6 py-6"
              style={idx < CONTENT.howItWorks.length - 1 ? { borderBottom: '1px solid hsl(var(--border))' } : {}}
              data-testid={`card-step-${step.step}`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm">
                {step.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display font-bold text-primary text-lg" data-testid={`text-step-title-${step.step}`}>
                    {step.title}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full" data-testid={`text-step-time-${step.step}`}>
                    {step.time}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-1" data-testid={`text-step-desc-${step.step}`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
