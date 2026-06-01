import { useEffect, useState } from "react";

function useCountdown(targetHours = 48) {
  const [target] = useState(() => Date.now() + targetHours * 3600 * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export function LimitedOffer() {
  const t = useCountdown(48);
  const cells = [
    { v: t.h, l: "Hours" },
    { v: t.m, l: "Minutes" },
    { v: t.s, l: "Seconds" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground p-10 text-background luxe-shadow lg:p-16">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at top right, var(--gold), transparent 60%)" }} />
        <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
              Festive Edit · Limited
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium tracking-tight md:text-6xl">
              Heritage Trio Box
              <span className="block italic text-gold">25% off</span>
            </h2>
            <p className="mt-4 max-w-md text-base text-background/75">
              Avakaya mango, smoked garlic, and sun-dried lemon — together in a hand-tied gift box. Until stocks last.
            </p>
            <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-2xl">
              Claim the offer
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {cells.map((c) => (
              <div key={c.l} className="rounded-2xl border border-background/15 bg-background/5 p-5 text-center backdrop-blur">
                <div className="font-display text-5xl font-medium tabular-nums">{String(c.v).padStart(2, "0")}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-background/60">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
