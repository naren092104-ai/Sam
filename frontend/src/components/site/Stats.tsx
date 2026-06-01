import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Happy Customers", caption: "Across 800+ pincodes" },
  { value: 500, suffix: "+", label: "Daily Orders", caption: "Shipped fresh, same week" },
  { value: 50, suffix: "+", label: "Pickle Varieties", caption: "Regional & seasonal" },
  { value: 4.9, suffix: "★", label: "Customer Rating", caption: "Verified Google reviews", decimals: 1 },
];

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(value * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</span>;
}

export function Stats() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group relative bg-card p-8 transition-colors hover:bg-accent/40">
            <div className="flex items-baseline gap-1 font-display text-5xl font-medium text-primary lg:text-6xl">
              <Counter value={s.value} decimals={s.decimals ?? 0} />
              <span className="text-3xl text-gold lg:text-4xl">{s.suffix}</span>
            </div>
            <div className="mt-3 text-base font-semibold text-foreground">{s.label}</div>
            <div className="text-sm text-muted-foreground">{s.caption}</div>
            <div className="gold-divider mt-6 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
