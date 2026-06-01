export function Newsletter() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-gradient-to-br from-card via-accent/40 to-cream p-10 lg:p-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-8 bg-primary/60" />
              Inner Circle
            </div>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
              Get the <em className="italic text-primary">first jar</em> of every new batch.
            </h2>
            <p className="mt-3 max-w-md text-base text-muted-foreground">
              Exclusive subscriber discounts, seasonal launches, and our family recipe journal — twice a month, never more.
            </p>
          </div>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-2 shadow-[var(--shadow-soft)] sm:flex-row">
              <input
                type="email"
                required
                placeholder="your@email.in"
                className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground">By subscribing you agree to our privacy policy. No spam, ever.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
