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
import { StudioPaymentSettingsManager } from "@/components/studio/StudioPaymentSettingsManager";

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
    id: "payments",
    label: "Payments",
    eyebrow: "Billing",
    description: "Configure Stripe and PayPal references and mode.",
    content: <StudioPaymentSettingsManager />,
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
                      className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                        focus || index === selectedIndex
                          ? "bg-[var(--admin-accent-soft)] text-[var(--admin-title)]"
                          : "text-[var(--admin-muted)]"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="block text-sm font-semibold">
                        {section.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5">
                        {section.description}
                      </span>
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <TabList className="hidden flex-col gap-2 lg:flex">
          {sections.map((section) => (
            <Tab
              key={section.id}
              className="rounded-2xl px-4 py-4 text-left outline-none transition data-[selected]:bg-[var(--admin-accent-soft)] data-[selected]:text-[var(--admin-title)] data-[selected]:shadow-sm"
            >
              <span className="block text-sm font-semibold">{section.label}</span>
              <span className="admin-muted mt-1 block text-xs leading-5">
                {section.description}
              </span>
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
