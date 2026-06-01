import { useState } from "react";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  { q: "How long do your pickles stay fresh?", a: "Unopened, 12 months at room temperature. Once opened, refrigerate and use within 3 months. Always use a dry spoon." },
  { q: "Do you use any preservatives?", a: "Never. Our 21-day sun-cure and cold-pressed mustard oil are the only preservation — exactly how it was done in 1978." },
  { q: "How long does delivery take?", a: "Dispatched within 24 hours. 2–3 days for metros, 3–5 days for the rest of India. Live tracking included." },
  { q: "Can I gift these pickles?", a: "Yes — our Heritage Trio comes in a hand-tied gift box with a personalised note card. Perfect for festivals and weddings." },
  { q: "What if a jar arrives damaged?", a: "We replace it free, no questions asked. Just send a photo within 48 hours of delivery." },
  { q: "Are your pickles spicy?", a: "Each product page lists a heat scale from 1–5. Our Andhra chicken is a proud 5; the sun-dried lemon is a gentle 2." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading eyebrow="Frequently Asked" title={<>The <em className="italic text-primary">small print</em>, plainly.</>} />
      <div className="mt-12 divide-y divide-border rounded-3xl border border-border/70 bg-card">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <button
              key={f.q}
              onClick={() => setOpen(isOpen ? null : i)}
              className="block w-full text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-6 px-6 py-5 lg:px-8">
                <div className="flex-1">
                  <div className="font-display text-lg font-medium tracking-tight">{f.q}</div>
                  <div
                    className={`grid overflow-hidden text-muted-foreground transition-all duration-500 ${
                      isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 text-sm leading-relaxed">{f.a}</div>
                  </div>
                </div>
                <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background transition-transform ${isOpen ? "rotate-45 bg-primary text-primary-foreground" : ""}`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
