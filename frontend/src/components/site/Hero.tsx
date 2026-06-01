import heroImg from "@/assets/hero-pickle.jpg";

const badges = [
  { icon: "🌿", label: "Homemade Recipes" },
  { icon: "🚫", label: "No Preservatives" },
  { icon: "🥭", label: "Fresh Ingredients" },
  { icon: "🚚", label: "Pan India Delivery" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-32">
      <div className="absolute inset-0 -z-10 pickle-bg" />
      <div className="absolute -top-40 -right-32 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,var(--gold)_0%,transparent_70%)] opacity-40 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-25 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-28">
        {/* Left */}
        <div className="reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/80">
              Est. 1978 · Hyderabad
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-balance md:text-6xl lg:text-7xl">
            Slow-aged
            <span className="block italic text-primary"> heirloom pickles,</span>
            handcrafted in small batches.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Four generations. Sun-ripened mangoes, cold-pressed mustard oil, and recipes
            measured by memory — never machines. Delivered fresh to your doorstep across India.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#collection"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-luxe)] transition-all hover:-translate-y-0.5"
            >
              Shop the Collection
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-primary hover:text-primary"
            >
              Explore Categories
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-3 py-2.5 backdrop-blur"
              >
                <span className="text-lg">{b.icon}</span>
                <span className="text-xs font-medium leading-tight text-foreground/85">{b.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-gradient-to-br from-accent to-gold font-display text-xs font-semibold text-primary"
                >
                  {["R", "S", "A", "M"][i - 1]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span className="ml-1.5 text-sm font-semibold text-foreground">4.9</span>
              </div>
              <p className="text-xs text-muted-foreground">10,000+ happy customers</p>
            </div>
          </div>
        </div>

        {/* Right - product visual */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-accent via-cream to-background luxe-shadow grain" />
            <div className="absolute inset-3 overflow-hidden rounded-[2rem]">
              <img
                src={heroImg}
                alt="Premium homemade mango pickle in elegant jar"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating ingredient chips */}
            <div className="absolute -left-6 top-12 animate-[float_7s_ease-in-out_infinite] rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 text-lg">🥭</div>
                <div>
                  <div className="text-xs font-semibold">Alphonso Mangoes</div>
                  <div className="text-[10px] text-muted-foreground">Ratnagiri orchards</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 animate-[float_9s_ease-in-out_infinite_1s] rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-lg">🌶️</div>
                <div>
                  <div className="text-xs font-semibold">Guntur Chillies</div>
                  <div className="text-[10px] text-muted-foreground">Stone-ground daily</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/4 animate-[float_8s_ease-in-out_infinite_0.5s] rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-lg">🧄</div>
                <div>
                  <div className="text-xs font-semibold">Farm Garlic</div>
                  <div className="text-[10px] text-muted-foreground">Hand-peeled</div>
                </div>
              </div>
            </div>

            {/* Award sticker */}
            <div className="absolute -right-2 -top-2 grid h-24 w-24 animate-[spin_30s_linear_infinite] place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary">
                <defs>
                  <path id="circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                </defs>
                <text className="fill-current text-[9px] font-semibold uppercase tracking-[0.2em]">
                  <textPath href="#circle">India Food Awards · 2024 · Heritage Brand · </textPath>
                </text>
              </svg>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-base">★</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-border/60 bg-card/40 py-4 backdrop-blur">
        <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-12 whitespace-nowrap font-display text-2xl italic text-foreground/40">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12">
              {["Mango", "Lemon", "Garlic", "Fish", "Chicken", "Gongura", "Tomato", "Mixed Veg"].map((w) => (
                <span key={w} className="flex items-center gap-12">
                  {w}
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
