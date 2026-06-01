import { SectionHeading } from "./SectionHeading";

const items = [
  { icon: "🇮🇳", title: "Pan India Delivery", body: "Shipping to 19,000+ pincodes nationwide." },
  { icon: "⚡", title: "Fast Shipping", body: "Dispatched within 24 hours, every order." },
  { icon: "🧊", title: "Secure Packaging", body: "Leak-proof glass, thermo-sealed, double-boxed." },
  { icon: "📍", title: "Live Tracking", body: "Real-time updates from kitchen to doorstep." },
];

export function Delivery() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading
        eyebrow="The Delivery Experience"
        title={<>Handled like <em className="italic text-primary">heirloom.</em></>}
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="group rounded-3xl border border-border/70 bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40">
            <div className="text-4xl">{it.icon}</div>
            <h3 className="mt-5 font-display text-xl font-medium">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
