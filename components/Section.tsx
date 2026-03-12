import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

// Generic section wrapper with brutalist styling and hard borders.
export function Section({ id, title, eyebrow, children }: SectionProps) {
  return (
    <section
      id={id}
      className="hard-border bg-white px-6 py-10 md:px-10 md:py-14"
    >
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.4em]">{eyebrow}</p>
      ) : null}
      <h2 className="mb-6 font-[var(--font-heading)] text-3xl uppercase tracking-tight md:text-4xl">
        {title}
      </h2>
      <div className="space-y-4 text-sm md:text-base">{children}</div>
    </section>
  );
}
