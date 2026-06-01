const cols = [
  { title: "Shop", links: ["All Pickles", "Mango", "Lemon", "Garlic", "Non-Veg", "Gift Boxes"] },
  { title: "Support", links: ["Track Order", "Shipping", "Returns", "FAQ", "Contact"] },
  { title: "Brand", links: ["Our Story", "Heritage", "Ingredients", "Press", "Wholesale"] },
];

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-foreground">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3h8M9 3v3M15 3v3M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div>
                <div className="font-display text-2xl font-medium">Sam Enterprises</div>
                <div className="text-xs uppercase tracking-[0.25em] text-background/60">Heritage Pickles · Est. 1978</div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-background/70">
              A family of pickle makers from Hyderabad, packaging four generations of recipes for kitchens across India.
            </p>
            <div className="mt-6 space-y-2 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <span className="text-gold">✉</span> hello@aamras.in
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">☏</span> +91 98480 12345
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">⌖</span> 14 Banjara Hills, Hyderabad
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {["IG", "FB", "YT", "X"].map((s) => (
                <a key={s} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-background/20 text-xs font-semibold transition-all hover:bg-gold hover:text-foreground">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{c.title}</div>
                <ul className="mt-5 space-y-3 text-sm text-background/75">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="transition-colors hover:text-gold">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-6 text-xs text-background/55 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Sam Enterprises  Crafted with mustard oil and patience.</div>
          <div className="flex flex-wrap items-center gap-4">
            <span>FSSAI · Lic 10018012345</span>
            <span>Secure payments by Razorpay</span>
            <span>Ships PAN India · Delhivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
