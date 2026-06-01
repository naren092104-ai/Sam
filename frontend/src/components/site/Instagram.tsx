import { SectionHeading } from "./SectionHeading";
import pMango from "@/assets/p-mango.jpg";
import pLemon from "@/assets/p-lemon.jpg";
import pGarlic from "@/assets/p-garlic.jpg";
import pFish from "@/assets/p-fish.jpg";
import pChicken from "@/assets/p-chicken.jpg";
import ing from "@/assets/ingredients.jpg";
import story from "@/assets/story.jpg";
import hero from "@/assets/hero-pickle.jpg";

const imgs = [pMango, pLemon, pGarlic, pFish, pChicken, ing, story, hero];

export function Instagram() {
  return (
    <section className="relative bg-accent/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="@aamras.heritage"
          title={<>Tagged with <em className="italic text-primary">love</em>.</>}
          description="Real kitchens. Real meals. Tag us and you might land here."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {imgs.map((src, i) => (
            <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-2xl">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-foreground/0 transition-colors group-hover:bg-foreground/40">
                <svg viewBox="0 0 24 24" className="h-6 w-6 scale-0 text-background transition-transform group-hover:scale-100" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.25a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5zm5.4-8.4a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0z" /></svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
