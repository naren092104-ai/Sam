import { SectionHeading } from "./SectionHeading";

const items = [
  { icon: "🏠", title: "Homemade Quality", body: "Every jar mixed by hand in our family kitchen — no factory shortcuts." },
  { icon: "🌿", title: "Fresh Ingredients", body: "Sourced weekly from named farms. We name the orchard on every label." },
  { icon: "📜", title: "Traditional Recipes", body: "Four generations of measurements, kept exactly as written in 1978." },
  { icon: "📦", title: "Secure Packaging", body: "Thermo-sealed glass jars, double-layered cartons, leak-tested." },
  { icon: "🚀", title: "Fast Delivery", body: "Dispatched in 24 hours. 2–4 day pan-India shipping." },
  { icon: "✨", title: "Premium Taste", body: "21-day cure minimum. Sun-aged. Cold-pressed mustard oil only." },
];

export function Trust() {
  return (
    <section className="relative bg-accent/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why Customers Trust Us"
          title={<>Six promises, sealed in <em className="italic text-primary">every</em> jar.</>}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-gold/40 text-3xl">
                {it.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-medium">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
              <div className="gold-divider mt-6 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
