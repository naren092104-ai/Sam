import ingredients from "@/assets/ingredients.jpg";
import { SectionHeading } from "./SectionHeading";

const items = [
  { name: "Raw Mangoes", note: "Ratnagiri & Banganapalli" },
  { name: "Fresh Lemons", note: "Hill-grown Kagzi" },
  { name: "Hand-peeled Garlic", note: "Ooty highland" },
  { name: "Traditional Spices", note: "Stone-ground daily" },
  { name: "Cold-pressed Oils", note: "Wooden ghani mustard" },
];

export function Ingredients() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] luxe-shadow">
          <img src={ingredients} alt="Premium pickle ingredients" loading="lazy" className="aspect-[16/11] w-full object-cover" />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Ingredient Atlas"
            title={<>We name <em className="italic text-primary">every farm.</em></>}
            description="Traceable from soil to jar. Five non-negotiables in every recipe."
          />
          <ul className="mt-10 divide-y divide-border">
            {items.map((it, i) => (
              <li key={it.name} className="group flex items-center justify-between gap-6 py-5">
                <div className="flex items-center gap-5">
                  <span className="font-display text-xl text-gold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-display text-2xl font-medium tracking-tight">{it.name}</div>
                    <div className="text-sm text-muted-foreground">{it.note}</div>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
