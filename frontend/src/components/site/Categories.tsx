import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  description?: string;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) return;
        const data = await response.json();
        setCategories(data.categories ?? []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="categories" className="relative scroll-mt-24 bg-foreground py-20 text-background lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold/60" />
            Categories
            <span className="h-px w-8 bg-gold/60" />
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Shop by category
          </h2>
          <p className="mt-4 text-sm text-slate-500">
            Browse the product categories currently available in the catalog.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center text-slate-500">No categories available yet.</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                {category.description ? (
                  <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Browse products in this category.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
