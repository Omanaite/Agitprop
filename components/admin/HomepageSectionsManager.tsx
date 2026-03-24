"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";
import type { HomepageSection } from "@/types";

type ValidationError = { path: string; message: string };

export function HomepageSectionsManager() {
  const [items, setItems] = useState<HomepageSection[]>([]);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );

  async function load() {
    setStatus("");
    setErrors([]);
    setIsLoading(true);

    const res = await fetch("/api/admin/homepage-sections");
    if (!res.ok) {
      setStatus("Could not load homepage sections.");
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    setItems((data.items ?? []) as HomepageSection[]);
    if (data.degraded) {
      setStatus(
        data.message ??
          "Fallback composition loaded. Apply the latest schema to persist changes."
      );
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function updateItem(
    sectionKey: string,
    updater: (item: HomepageSection) => HomepageSection
  ) {
    setItems((current) =>
      current.map((item) =>
        item.section_key === sectionKey ? updater(item) : item
      )
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next.map((item, order) => ({ ...item, sort_order: order }));
    });
  }

  function validateItems(): ValidationError[] {
    const nextErrors: ValidationError[] = [];

    items.forEach((item) => {
      if (!item.title?.trim()) {
        nextErrors.push({
          path: `${item.section_key}.title`,
          message: "Title is required.",
        });
      }
    });

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);

    const clientErrors = validateItems();
    if (clientErrors.length) {
      setErrors(clientErrors);
      setStatus("Some section settings need attention.");
      return;
    }

    setIsSaving(true);

    const payload = {
      items: items.map((item, index) => ({
        section_key: item.section_key,
        title: item.title.trim(),
        eyebrow: item.eyebrow?.trim() ?? "",
        sort_order: index,
        is_visible: item.is_visible,
      })),
    };

    const res = await fetch("/api/admin/homepage-sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to save homepage sections.");
      setIsSaving(false);
      return;
    }

    const data = await res.json().catch(() => null);
    setItems((data?.items ?? items) as HomepageSection[]);
    setStatus("Homepage composition saved.");
    setIsSaving(false);
  }

  if (isLoading) {
    return <AdminSectionSkeleton fields={5} cards={1} />;
  }

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Composition</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">
        Homepage sections
      </h2>
      <p className="admin-muted mt-2 max-w-3xl text-sm leading-6">
        Organize the order of public sections, rename them, and decide which
        blocks stay visible on the client-facing homepage.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {items.map((item, index) => {
          const titleError = errorMap.get(`${item.section_key}.title`);

          return (
            <article key={item.section_key} className="admin-card-soft p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="admin-chip">{item.section_key}</span>
                    <span className="admin-muted text-xs uppercase tracking-[0.14em]">
                      Position {index}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-1">
                      <input
                        className={`admin-input ${
                          titleError ? "admin-field-error" : ""
                        }`}
                        value={item.title}
                        onChange={(event) =>
                          updateItem(item.section_key, (current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Section title"
                      />
                      {titleError ? (
                        <p className="admin-helper mt-2" data-variant="error">
                          {item.section_key}.title: {titleError}
                        </p>
                      ) : null}
                    </div>

                    <input
                      className="admin-input md:col-span-1"
                      value={item.eyebrow ?? ""}
                      onChange={(event) =>
                        updateItem(item.section_key, (current) => ({
                          ...current,
                          eyebrow: event.target.value,
                        }))
                      }
                      placeholder="Eyebrow label"
                    />
                  </div>

                  <label className="mt-4 inline-flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={item.is_visible}
                      onChange={(event) =>
                        updateItem(item.section_key, (current) => ({
                          ...current,
                          is_visible: event.target.checked,
                        }))
                      }
                    />
                    <span className="admin-muted">
                      Show this section on the public homepage
                    </span>
                  </label>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="admin-button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                  >
                    Move down
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save composition"}
          </button>
          <button
            type="button"
            className="admin-button admin-button-ghost"
            onClick={() => void load()}
            disabled={isSaving}
          >
            Reload
          </button>
        </div>
      </form>

      {status ? (
        <p
          className="admin-validation mt-4"
          data-variant={
            errors.length ? "error" : status.toLowerCase().includes("fallback")
              ? "warning"
              : "success"
          }
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
    </section>
  );
}
