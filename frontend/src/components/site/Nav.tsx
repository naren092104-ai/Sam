import { useEffect, useState } from "react";

const links = [
  { label: "Collection", href: "#collection" },
  { label: "Categories", href: "#categories" },
  { label: "Our Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-border/60 shadow-sm shadow-black/10"
          : "bg-background/70"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition-transform group-hover:scale-[1.02]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3h8M9 3v3M15 3v3M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="leading-none">
            <div className="font-display text-lg font-semibold tracking-tight text-foreground">Sam Enterprises</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Heritage Pickles</div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 transition hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden text-sm font-medium text-foreground/80 hover:text-primary md:block" aria-label="Search">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" />
            </svg>
          </button>
          <a
            href="/login"
            className="rounded-full border border-foreground/20 bg-background/90 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
          >
            Login
          </a>
          <a
            href="#collection"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 md:inline-flex"
          >
            Shop
          </a>
        </div>
      </div>
    </header>
  );
}
