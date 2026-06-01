export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary`}>
        <span className="h-px w-8 bg-primary/60" />
        {eyebrow}
        <span className="h-px w-8 bg-primary/60" />
      </div>
      <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
