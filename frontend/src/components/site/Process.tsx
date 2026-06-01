import { SectionHeading } from "./SectionHeading";

const steps = [
  { n: "01", title: "Fresh Ingredients", body: "Sourced weekly from named farms. Sorted by hand at sunrise." },
  { n: "02", title: "Traditional Preparation", body: "Stone-ground spices, sun-cured mangoes, hand-mixed in clay." },
  { n: "03", title: "Quality Packaging", body: "Food-grade glass, thermo-sealed lids, double-cartoned." },
  { n: "04", title: "Safe Delivery", body: "Dispatched in 24h. Tracked door-to-door across India." },
];

export function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading
        eyebrow="From Kitchen to Doorstep"
        title={<>The <em className="italic text-primary">21-day</em> ritual.</>}
      />
      <div className="relative mt-16">
        <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-gold to-transparent lg:block" />
        <div className="grid gap-10 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative text-center">
              <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-card font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] ring-1 ring-border">
                {s.n}
                {i < steps.length - 1 && (
                  <svg viewBox="0 0 24 24" className="absolute -right-6 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gold lg:block" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <h3 className="mt-6 font-display text-xl font-medium">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
