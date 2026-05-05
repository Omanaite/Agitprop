"use client";

import { useState } from "react";
import { StudioProfileManager } from "@/components/studio/StudioProfileManager";
import { StudioHomepageSectionsManager } from "@/components/studio/StudioHomepageSectionsManager";
import { StudioGalleriesManager } from "@/components/studio/StudioGalleriesManager";
import { StudioGalleryManager } from "@/components/studio/StudioGalleryManager";
import { StudioPostManager } from "@/components/studio/StudioPostManager";
import { StudioSiteSettings } from "@/components/studio/StudioSiteSettings";
import { StudioBookingsManager } from "@/components/studio/StudioBookingsManager";
import { StudioRatesManager } from "@/components/studio/StudioRatesManager";
import { StudioAvailabilityManager } from "@/components/studio/StudioAvailabilityManager";
import { StudioStorageBanner } from "@/components/studio/StudioStorageBanner";
import { StudioTelegramSettings } from "@/components/studio/StudioTelegramSettings";

/* ── Section icons (thin-stroke SVG, 16×16) ── */
function IconProfile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" />
    </svg>
  );
}
function IconHomepage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 7L8 1.5 14.5 7V14.5H10V10H6v4.5H1.5z" />
    </svg>
  );
}
function IconGalleries() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" />
    </svg>
  );
}
function IconPieces() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" />
      <circle cx="5.5" cy="5.5" r="1.5" />
      <path d="M1.5 10.5l4-4 3 3 2-2 3.5 3.5" />
    </svg>
  );
}
function IconPosts() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" />
      <line x1="5" y1="5.5" x2="11" y2="5.5" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="5" y1="10.5" x2="8.5" y2="10.5" />
    </svg>
  );
}
function IconBookings() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" />
      <line x1="1.5" y1="7" x2="14.5" y2="7" />
      <line x1="5" y1="1.5" x2="5" y2="4.5" />
      <line x1="11" y1="1.5" x2="11" y2="4.5" />
      <circle cx="5.5" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="8" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconRates() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v1.2M8 10.3v1.2M5.8 6.5a1.7 1.7 0 0 1 1.7-1.2h1c.9 0 1.5.6 1.5 1.3 0 .7-.5 1.1-1 1.3L8 8.4c-.5.2-.8.6-.8 1.2h3" />
    </svg>
  );
}
function IconAvailability() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="8,4.5 8,8 10.5,9.5" />
    </svg>
  );
}
function IconSite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5" />
      <path d="M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="2" y1="2" x2="12" y2="12" />
      <line x1="12" y1="2" x2="2" y2="12" />
    </svg>
  );
}

type Section = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "profile",
    label: "Profile",
    eyebrow: "Identity",
    description: "Billing, contact details, and studio preferences.",
    icon: <IconProfile />,
    content: <StudioProfileManager />,
  },
  {
    id: "homepage",
    label: "Homepage",
    eyebrow: "Composition",
    description: "Control section order, naming, and public visibility.",
    icon: <IconHomepage />,
    content: <StudioHomepageSectionsManager />,
  },
  {
    id: "galleries",
    label: "Galleries",
    eyebrow: "Collections",
    description: "Curate gallery groups before assigning individual pieces.",
    icon: <IconGalleries />,
    content: <StudioGalleriesManager />,
  },
  {
    id: "pieces",
    label: "Pieces",
    eyebrow: "Library",
    description: "Upload, reorder, and enrich your portfolio pieces.",
    icon: <IconPieces />,
    content: <StudioGalleryManager />,
  },
  {
    id: "posts",
    label: "Posts",
    eyebrow: "Editorial",
    description: "Draft stories, notes, and scheduled studio updates.",
    icon: <IconPosts />,
    content: <StudioPostManager />,
  },
  {
    id: "bookings",
    label: "Bookings",
    eyebrow: "Requests",
    description: "Client session requests submitted through your public site.",
    icon: <IconBookings />,
    content: <StudioBookingsManager />,
  },
  {
    id: "rates",
    label: "Rates",
    eyebrow: "Pricing",
    description: "Define sessions, workshops, classes, and any offering with price.",
    icon: <IconRates />,
    content: <StudioRatesManager />,
  },
  {
    id: "availability",
    label: "Availability",
    eyebrow: "Schedule",
    description: "Set available days and hours shown in the public booking form.",
    icon: <IconAvailability />,
    content: <StudioAvailabilityManager />,
  },
  {
    id: "site",
    label: "Site",
    eyebrow: "Appearance",
    description: "Theme, custom domain, and notification settings.",
    icon: <IconSite />,
    content: (
      <>
        <StudioSiteSettings />
        <StudioTelegramSettings />
      </>
    ),
  },
];

export function StudioConsoleShell() {
  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = sections[selected];

  function navigate(i: number) {
    setSelected(i);
    setMobileOpen(false);
  }

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 overflow-y-auto"
        style={{
          width: "220px",
          borderRight: "1px solid var(--admin-border)",
          background: "var(--admin-surface)",
        }}
      >
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {sections.map((s, i) => {
            const isActive = i === selected;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => navigate(i)}
                className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left w-full"
                style={{
                  background: isActive ? "var(--admin-accent-soft)" : "transparent",
                  color: isActive ? "var(--admin-title)" : "var(--admin-muted)",
                  transition: "background 150ms ease, color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--admin-accent-soft) 50%, transparent)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Active indicator */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: "3px",
                    height: "20px",
                    background: "var(--admin-accent)",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 150ms ease",
                  }}
                />
                <span
                  style={{
                    color: isActive ? "var(--admin-accent)" : "inherit",
                    transition: "color 150ms ease",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </span>
                <span className="text-sm font-medium leading-tight">{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Storage banner at bottom of sidebar */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--admin-border)" }}>
          <StudioStorageBanner />
        </div>
      </aside>

      {/* ── Mobile sidebar drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative flex flex-col"
            style={{
              width: "260px",
              background: "var(--admin-surface-strong)",
              borderRight: "1px solid var(--admin-border)",
              zIndex: 1,
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--admin-muted)" }}>
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                style={{ color: "var(--admin-muted)", transition: "color 150ms ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--admin-title)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--admin-muted)")}
              >
                <IconClose />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
              {sections.map((s, i) => {
                const isActive = i === selected;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigate(i)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left w-full"
                    style={{
                      background: isActive ? "var(--admin-accent-soft)" : "transparent",
                      color: isActive ? "var(--admin-title)" : "var(--admin-muted)",
                    }}
                  >
                    <span style={{ color: isActive ? "var(--admin-accent)" : "inherit", flexShrink: 0 }}>
                      {s.icon}
                    </span>
                    <div>
                      <span className="block text-[9px] uppercase tracking-[0.12em] opacity-60">{s.eyebrow}</span>
                      <span className="block text-sm font-medium">{s.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--admin-border)" }}>
              <StudioStorageBanner />
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content area ── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Section header bar */}
        <div
          className="shrink-0 flex items-center gap-4 px-6 md:px-8"
          style={{
            height: "56px",
            borderBottom: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
          }}
        >
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden shrink-0"
            style={{ color: "var(--admin-muted)" }}
          >
            <IconMenu />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-xs font-medium uppercase tracking-[0.1em] hidden sm:block"
              style={{ color: "var(--admin-muted)" }}
            >
              {active.eyebrow}
            </span>
            <span
              className="hidden sm:block"
              style={{ width: "1px", height: "12px", background: "var(--admin-border)" }}
            />
            <span className="text-sm font-semibold truncate" style={{ color: "var(--admin-title)" }}>
              {active.label}
            </span>
          </div>

          {/* Description — hidden on small screens */}
          <p
            className="text-xs truncate hidden md:block ml-2"
            style={{ color: "var(--admin-muted)" }}
          >
            {active.description}
          </p>
        </div>

        {/* Panel content */}
        <div className="flex-1 p-6 md:p-8 admin-panel-enter">
          {sections.map((s, i) => (
            <div key={s.id} style={{ display: i === selected ? "block" : "none" }}>
              {s.content}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
