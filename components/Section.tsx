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
      className="hard-border bg-[var(--bg)] px-6 py-10 md:px-10 md:py-14"
    >
      {eyebrow ? (
        <p className="mb-3 uppercase" style={{ fontSize: "var(--type-eyebrow)", letterSpacing: "var(--track-eyebrow)" }}>{eyebrow}</p>
      ) : null}
      <h2 className="mb-6 font-[var(--font-heading)] uppercase" style={{ fontSize: "var(--type-heading)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {title}
      </h2>
      <div className="space-y-4" style={{ fontSize: "var(--type-body-sm)" }}>{children}</div>
    </section>
  );
}
