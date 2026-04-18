import { NavAtelier } from "@/components/headers/NavAtelier";
import { NavMono } from "@/components/headers/NavMono";
import { NavInk } from "@/components/headers/NavInk";
import { NavVerdure } from "@/components/headers/NavVerdure";
import { NavAmber } from "@/components/headers/NavAmber";
import type { Locale } from "@/lib/i18n";
import type { HomepageSection } from "@/types";

type HeaderProps = {
  sections?: HomepageSection[];
  locale?: Locale;
  brandEyebrow?: string;
  brandTitle?: string;
  siteTheme?: string;
};

const hiddenNavKeys = new Set(["hero"]);

export function Header({
  sections = [],
  locale = "en",
  brandEyebrow = "Akemi",
  brandTitle = "Tattoo Manifesto",
  siteTheme = "atelier",
}: HeaderProps) {
  const navItems = sections.filter(
    (section) => section.is_visible && !hiddenNavKeys.has(section.section_key)
  );

  const props = { navItems, locale, brandEyebrow, brandTitle, siteTheme };

  const family = siteTheme.replace(/_b$/, "");

  if (family === "mono") return <NavMono {...props} />;
  if (family === "ink") return <NavInk {...props} />;
  if (family === "verdure") return <NavVerdure {...props} />;
  if (family === "amber") return <NavAmber {...props} />;
  return <NavAtelier {...props} />;
}
