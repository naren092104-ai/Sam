import { useEffect, useState } from "react";

export function StickyCTAs() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href="https://wa.me/919848012345"
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 left-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-luxe)] transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.9L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.2-2.9-1.2-4.5 0-4.6 3.8-8.3 8.3-8.3 4.6 0 8.3 3.8 8.3 8.3 0 4.6-3.7 8.3-8.3 8.3z" />
        </svg>
      </a>

      {/* Sticky order bar */}
      <div className={`fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm transition-all duration-500 sm:right-6 sm:left-auto sm:mx-0 ${visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
        <a
          href="#collection"
          className="flex items-center justify-between gap-4 rounded-2xl bg-foreground py-3 pl-4 pr-2 text-background shadow-[var(--shadow-luxe)]"
        >
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Festive offer · 25% off</div>
            <div className="text-sm font-semibold">Heritage Trio Box</div>
          </div>
          <span className="grid h-10 shrink-0 place-items-center rounded-xl bg-gold px-4 text-xs font-semibold text-foreground">
            Order Now
          </span>
        </a>
      </div>
    </>
  );
}
