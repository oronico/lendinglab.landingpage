import { CONTENT } from "@shared/content";

export function LoanDetails() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3" data-testid="text-products-label">Products</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary" data-testid="text-products-title">
            Two Products, One Mission
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/60 bg-white shadow-sm p-8 flex flex-col" data-testid="card-term-loan">
            <h3 className="text-2xl font-display font-bold text-primary mb-6">{CONTENT.products.termLoan.title}</h3>
            <dl className="space-y-3">
              {CONTENT.products.termLoan.specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-sm text-muted-foreground font-medium">{label}</dt>
                  <dd className="text-sm text-primary font-semibold text-right" data-testid={`text-term-spec-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto text-sm text-muted-foreground border-t border-border/40 pt-4">
              <span className="font-medium text-primary">Typical use:</span> {CONTENT.products.termLoan.typicalUse}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white shadow-sm p-8 flex flex-col" data-testid="card-loc">
            <h3 className="text-2xl font-display font-bold text-primary mb-6">{CONTENT.products.loc.title}</h3>
            <dl className="space-y-3">
              {CONTENT.products.loc.specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-sm text-muted-foreground font-medium">{label}</dt>
                  <dd className="text-sm text-primary font-semibold text-right" data-testid={`text-loc-spec-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto text-sm text-muted-foreground border-t border-border/40 pt-4">
              <span className="font-medium text-primary">Typical use:</span> {CONTENT.products.loc.typicalUse}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
