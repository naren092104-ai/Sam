import storyImg from "@/assets/story.jpg";
import { SectionHeading } from "./SectionHeading";

const chapters = [
  { year: "1978", title: "Grandmother's First Jar", body: "It began on a Hyderabad terrace — Ammamma's avakaya recipe, written in the margin of a prayer book." },
  { year: "1996", title: "A Family Heritage", body: "Her daughters carried the recipe across kitchens, refining each spice ratio with seasons." },
  { year: "2018", title: "Modern Glass, Same Soul", body: "We swapped clay urns for food-grade glass — never the recipe, never the hand-mixing." },
  { year: "Today", title: "Pan India, Door to Door", body: "10,000+ kitchens, 800+ pincodes. Same family. Same 21-day cure. Same flavour." },
];

export function Story() {
  return (
    <section id="story" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[5fr_6fr] lg:items-start lg:gap-16">
        <div className="relative lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-[2.5rem] luxe-shadow">
            <img src={storyImg} alt="Grandmother preparing pickle" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/85 p-5 backdrop-blur">
              <div className="font-display text-lg italic text-primary">"Pickle ko hurry pasand nahi."</div>
              <div className="mt-1 text-sm text-muted-foreground">— Ammamma, founder · circa 1978</div>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Our Story"
            title={<>Four generations. <em className="italic text-primary">One jar.</em></>}
          />

          <ol className="relative mt-12 space-y-10 border-l border-border pl-8">
            {chapters.map((c, i) => (
              <li key={c.year} className="relative">
                <span className="absolute -left-[42px] grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-xs font-semibold text-primary-foreground shadow-lg ring-4 ring-background">
                  {i + 1}
                </span>
                <div className="font-display text-sm uppercase tracking-[0.25em] text-gold">{c.year}</div>
                <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">{c.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
