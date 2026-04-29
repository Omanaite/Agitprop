"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
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

type Section = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "profile",
    label: "Profile",
    eyebrow: "Identity",
    description: "Billing, contact details, and studio preferences.",
    content: <StudioProfileManager />,
  },
  {
    id: "homepage",
    label: "Homepage",
    eyebrow: "Composition",
    description: "Control section order, naming, and public visibility.",
    content: <StudioHomepageSectionsManager />,
  },
  {
    id: "galleries",
    label: "Galleries",
    eyebrow: "Collections",
    description: "Curate gallery groups before assigning individual pieces.",
    content: <StudioGalleriesManager />,
  },
  {
    id: "pieces",
    label: "Pieces",
    eyebrow: "Library",
    description: "Upload, reorder, and enrich your portfolio pieces.",
    content: <StudioGalleryManager />,
  },
  {
    id: "posts",
    label: "Posts",
    eyebrow: "Editorial",
    description: "Draft stories, notes, and scheduled studio updates.",
    content: <StudioPostManager />,
  },
  {
    id: "bookings",
    label: "Bookings",
    eyebrow: "Requests",
    description: "Client session requests submitted through your public site.",
    content: <StudioBookingsManager />,
  },
  {
    id: "rates",
    label: "Rates",
    eyebrow: "Pricing",
    description: "Define sessions, workshops, classes, and any offering with price.",
    content: <StudioRatesManager />,
  },
  {
    id: "availability",
    label: "Availability",
    eyebrow: "Schedule",
    description: "Set available days and hours shown in the public booking form.",
    content: <StudioAvailabilityManager />,
  },
  {
    id: "site",
    label: "Site",
    eyebrow: "Appearance",
    description: "Theme, custom domain, and notification settings.",
    content: (
      <>
        <StudioSiteSettings />
        <StudioTelegramSettings />
      </>
    ),
  },
];

export function StudioConsoleShell() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeSection = sections[selectedIndex];

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
      className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <aside className="admin-card p-4 lg:sticky lg:top-6 lg:h-fit">
        <div className="mb-5 px-2">
          <div className="mb-4">
            <StudioStorageBanner />
          </div>
          <p className="admin-chip">{activeSection.eyebrow}</p>
          <h2 className="admin-title mt-4 text-2xl font-semibold">
            {activeSection.label}
          </h2>
          <p className="admin-muted mt-2 text-sm leading-6">
            {activeSection.description}
          </p>
        </div>

        <div className="lg:hidden">
          <Menu>
            <MenuButton className="admin-button w-full justify-between">
              <span>{activeSection.label}</span>
              <span className="admin-muted text-xs uppercase tracking-[0.14em]">
                Menu
              </span>
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className="admin-card mt-3 w-[min(18rem,calc(100vw-3rem))] p-2 outline-none"
            >
              {sections.map((section, index) => (
                <MenuItem key={section.id}>
                  {({ focus }) => (
                    <button
                      type="button"
                      className={`w-full rounded-lg px-4 py-3 text-left transition ${
                        focus || index === selectedIndex
                          ? "bg-[var(--admin-accent-soft)] text-[var(--admin-title)]"
                          : "text-[var(--admin-muted)]"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="block text-[9px] uppercase tracking-[0.14em] opacity-60">
                        {section.eyebrow}
                      </span>
                      <span className="block text-sm font-semibold mt-0.5">
                        {section.label}
                      </span>
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <TabList className="hidden flex-col lg:flex">
          {sections.map((section) => (
            <Tab
              key={section.id}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-3 text-left outline-none transition-colors hover:bg-[var(--admin-accent-soft)]/50 data-[selected]:bg-[var(--admin-accent-soft)] data-[selected]:text-[var(--admin-title)]"
            >
              <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[var(--admin-accent)] opacity-0 transition-opacity group-data-[selected]:opacity-100" />
              <div className="min-w-0 flex-1 pl-2">
                <span className="block text-[9px] uppercase tracking-[0.14em] text-[var(--admin-muted)] group-data-[selected]:text-[var(--admin-accent)]">
                  {section.eyebrow}
                </span>
                <span className="block text-sm font-semibold leading-tight mt-0.5">{section.label}</span>
              </div>
            </Tab>
          ))}
        </TabList>
      </aside>

      <TabPanels>
        {sections.map((section) => (
          <TabPanel key={section.id} className="outline-none">
            {section.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
