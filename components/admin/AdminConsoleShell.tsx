"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { GalleriesManager } from "@/components/admin/GalleriesManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { IntegrationsManager } from "@/components/admin/IntegrationsManager";
import { PostManager } from "@/components/admin/PostManager";
import { ProfileManager } from "@/components/admin/ProfileManager";

type SectionId =
  | "profile"
  | "integrations"
  | "galleries"
  | "gallery-items"
  | "posts";

type Section = {
  id: SectionId;
  label: string;
  description: string;
  content: ReactNode;
};

export function AdminConsoleShell() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        description: "Contact, payments, and delivery details.",
        content: <ProfileManager />,
      },
      {
        id: "integrations",
        label: "Integrations",
        description: "Connect GitHub, Google, or cloud uploads.",
        content: <IntegrationsManager />,
      },
      {
        id: "galleries",
        label: "Galleries",
        description: "Create and organize multiple galleries.",
        content: <GalleriesManager />,
      },
      {
        id: "gallery-items",
        label: "Pieces",
        description: "Upload and edit pieces inside each gallery.",
        content: <GalleryManager />,
      },
      {
        id: "posts",
        label: "Posts",
        description: "Draft and publish editorial content.",
        content: <PostManager />,
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<SectionId>(sections[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = sections.find((section) => section.id === activeId);

  return (
    <div className="flex flex-col gap-6">
      <div className="theme-border p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em]">Active section</p>
            <h2 className="text-lg uppercase">
              {activeSection?.label ?? ""}
            </h2>
            <p className="text-sm">{activeSection?.description ?? ""}</p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <div className="relative">
              <button
                type="button"
                className="theme-border px-4 py-2 text-sm uppercase"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-controls="admin-section-menu"
              >
                Menu
              </button>
              {menuOpen ? (
                <div
                  id="admin-section-menu"
                  className="absolute right-0 z-20 mt-2 w-64 theme-border bg-[var(--bg)] p-2"
                  role="menu"
                >
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      role="menuitem"
                      className={`w-full text-left px-3 py-2 text-sm uppercase theme-border-thin mb-2 last:mb-0 ${
                        section.id === activeId ? "theme-invert" : ""
                      }`}
                      onClick={() => {
                        setActiveId(section.id);
                        setMenuOpen(false);
                      }}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <label className="text-xs uppercase tracking-[0.2em] md:hidden">
              Switch section
              <select
                className="mt-2 w-full theme-border p-2 text-sm"
                value={activeId}
                onChange={(event) =>
                  setActiveId(event.target.value as SectionId)
                }
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div>{activeSection?.content}</div>
    </div>
  );
}
