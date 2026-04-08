import { PublicLocaleToggle } from "@/components/PublicLocaleToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Locale } from "@/lib/i18n";
import type { HomepageSection } from "@/types";

// Primary navigation header with brutalist, high-contrast layout.
type HeaderProps = {
  sections?: HomepageSection[];
  locale?: Locale;
  brandEyebrow?: string;
  brandTitle?: string;
  themeLabels?: {
    light: string;
    eye: string;
    dark: string;
  };
  localeLabel?: string;
};

const hiddenNavKeys = new Set(["hero"]);

export function Header({
  sections = [],
  locale = "en",
  brandEyebrow = "Akemi",
  brandTitle = "Tattoo Manifesto",
  themeLabels = { light: "Light", eye: "Eye", dark: "Dark" },
  localeLabel,
}: HeaderProps) {
  const navItems = sections.filter(
    (section) => section.is_visible && !hiddenNavKeys.has(section.section_key)
  );

  return (
    <header className="hard-border flex flex-col gap-6 bg-[var(--bg)] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.5em]">{brandEyebrow}</p>
        <h1 className="font-[var(--font-heading)] text-4xl uppercase md:text-5xl">
          {brandTitle}
        </h1>
      </div>
      <div className="flex flex-col gap-4 md:items-end">
        <div className="flex flex-wrap gap-3 md:justify-end">
          <ThemeToggle labels={themeLabels} />
          {localeLabel !== undefined && (
            <PublicLocaleToggle locale={locale} label={localeLabel} />
          )}
        </div>
        <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em]">
          {navItems.map((section) => (
            <a
              key={section.section_key}
              className="snap-transition theme-border-thin px-2 py-1 theme-hover-invert"
              href={`#${section.section_key}`}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
