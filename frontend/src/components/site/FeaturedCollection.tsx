import { SectionHeading } from "./SectionHeading";
import { useEffect, useState } from "react";
import pMango from "@/assets/p-mango.jpg";
import pLemon from "@/assets/p-lemon.jpg";
import pGarlic from "@/assets/p-garlic.jpg";
import pFish from "@/assets/p-fish.jpg";
import pChicken from "@/assets/p-chicken.jpg";

const defaultProducts = [
  { name: "Avakaya Mango", tag: "Bestseller", img: pMango, price: 499, mrp: 699, off: 29, rating: 4.9, reviews: 1284 },
  { name: "Sun-Dried Lemon", tag: "New", img: pLemon, price: 379, mrp: 499, off: 24, rating: 4.8, reviews: 842 },
  { name: "Smoked Garlic", tag: "Limited", img: pGarlic, price: 549, mrp: 749, off: 27, rating: 4.9, reviews: 612 },
  { name: "Malabar Fish", tag: "Chef's Pick", img: pFish, price: 699, mrp: 899, off: 22, rating: 4.7, reviews: 391 },
  { name: "Andhra Chicken", tag: "Spicy", img: pChicken, price: 749, mrp: 949, off: 21, rating: 4.9, reviews: 528 },
  { name: "Heritage Trio Box", tag: "Gift", img: pMango, price: 1299, mrp: 1799, off: 28, rating: 5.0, reviews: 204 },
];

interface PublicProduct {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  offerPrice: number;
  status?: string;
  image?: string;
}

export function FeaturedCollection() {
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/products`);
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        if (!Array.isArray(data.products)) return;

        const mapped = data.products.slice(0, 6).map((product: PublicProduct) => {
          const parsedOfferPrice = Number(product.offerPrice || 0);
          const parsedPrice = Number(product.price || 0);
          
          const price = parsedOfferPrice || parsedPrice || 0;
          const mrp = parsedPrice || price;
          const off = parsedOfferPrice
            ? Math.round(((mrp - parsedOfferPrice) / mrp) * 100)
            : 0;
          return {
            id: product.id,
            name: product.name,
            tag: product.status === "active" ? "New" : "Featured",
            img: product.image || pMango,
            price,
            mrp,
            off,
            rating: 4.8,
            reviews: 120,
          };
        });

        if (mapped.length) setProducts(mapped);
      } catch {
        // keep fallback cards on failure
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="collection" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading
        eyebrow="Featured Collection"
        title={<>The pickles <em className="italic text-primary">everyone</em> keeps reordering</>}
        description="Each jar is hand-mixed, sun-cured, and aged for at least 21 days before it reaches you."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id || p.name}
            className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-luxe)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-accent/40">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              {/* badges */}
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                {p.tag}
              </span>
              {p.off > 0 && (
                <span className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
                  -{p.off}%
                </span>
              )}

              {/* action rail */}
              <div className="absolute right-4 top-20 flex translate-x-16 flex-col gap-2 transition-transform duration-500 group-hover:translate-x-0">
                {[
                  <svg key="h" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
                  <svg key="e" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
                ].map((icon, i) => (
                  <button key={i} className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground shadow-md transition hover:bg-primary hover:text-primary-foreground">
                    {icon}
                  </button>
                ))}
              </div>

              {/* quick add */}
              <button className="absolute inset-x-4 bottom-4 translate-y-16 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition-all duration-500 hover:bg-primary group-hover:translate-y-0">
                Add to cart
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                ))}
                <span className="ml-1 text-xs font-medium text-muted-foreground">{p.rating} ({p.reviews})</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">{p.name}</h3>
              <p className="text-sm text-muted-foreground">500g · Glass jar</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-primary">₹{p.price}</span>
                {p.off > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">₹{p.mrp}</span>
                    <span className="ml-auto text-xs font-semibold text-gold">Save ₹{p.mrp - p.price}</span>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a href="#" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-7 py-3.5 text-sm font-semibold hover:border-primary hover:text-primary">
          View all 50+ pickles
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </section>
  );
}
