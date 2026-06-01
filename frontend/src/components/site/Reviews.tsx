import { SectionHeading } from "./SectionHeading";

const reviews = [
  { name: "Riya Sharma", city: "Mumbai", text: "Tastes exactly like my grandmother's — the mustard oil hits like a memory. Worth every rupee.", rating: 5, initial: "R" },
  { name: "Arjun Mehta", city: "Bangalore", text: "I've ordered 12 jars in the last six months. The garlic pickle is dangerously good with curd rice.", rating: 5, initial: "A" },
  { name: "Sneha Iyer", city: "Chennai", text: "Packaging arrived spotless, jar was warm with care. Fish pickle is the real Malabar deal.", rating: 5, initial: "S" },
  { name: "Vikram Rao", city: "Delhi", text: "Sent the heritage trio as a Diwali gift. My in-laws called twice to ask where I got it.", rating: 5, initial: "V" },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative scroll-mt-24 bg-accent/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Customer Stories"
          title={<>Loved in <em className="italic text-primary">10,000+</em> kitchens.</>}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-lg leading-snug text-foreground text-pretty">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-spice font-display text-base font-semibold text-primary-foreground">
                  {r.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city}</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-spice">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Verified
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
