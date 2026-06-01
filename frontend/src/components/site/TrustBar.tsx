const items = [
  { icon: "🔒", title: "Secure Payments", body: "Razorpay · UPI · Cards" },
  { icon: "↩️", title: "Easy Replacements", body: "Damaged jar? Free reship." },
  { icon: "🍃", title: "100% Veg + Non-Veg", body: "Clearly labelled, always." },
  { icon: "📞", title: "Real Humans", body: "Mon–Sat · 9am – 8pm IST" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-border/70 bg-card/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-px bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-4 bg-card/80 px-6 py-5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-2xl">{it.icon}</div>
            <div>
              <div className="text-sm font-semibold">{it.title}</div>
              <div className="text-xs text-muted-foreground">{it.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
