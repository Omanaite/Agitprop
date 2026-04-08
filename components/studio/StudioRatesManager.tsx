"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";
import { useStudioPreview } from "@/lib/studio-preview-context";

type RateCard = {
  id: string;
  label: string;
  price: string;
  description: string;
  capacity: number | null;
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyCard(): RateCard {
  return { id: makeId(), label: "", price: "", description: "", capacity: null };
}

export function StudioRatesManager() {
  const { refreshPreview } = useStudioPreview();
  const [cards, setCards] = useState<RateCard[]>([]);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schemaPending, setSchemaPending] = useState(false);

  async function load() {
    setIsLoading(true);
    const res = await fetch("/api/studio/rates");
    if (res.ok) {
      const data = await res.json();
      setCards((data.cards ?? []) as RateCard[]);
    }
    setIsLoading(false);
  }

  useEffect(() => { void load(); }, []);

  function update(id: string, field: keyof RateCard, value: string | number | null) {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  function addCard() {
    setCards((prev) => [...prev, emptyCard()]);
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSave() {
    setStatus("");
    const invalid = cards.filter((c) => !c.label.trim() || !c.price.trim());
    if (invalid.length) {
      setStatus("Each rate card needs a label and price.");
      return;
    }
    setIsSaving(true);
    const res = await fetch("/api/studio/rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 409) setSchemaPending(true);
      setStatus(data?.message ?? "Failed to save rates.");
    } else {
      setStatus("Rates saved.");
      refreshPreview();
    }
    setIsSaving(false);
  }

  if (isLoading) return <AdminSectionSkeleton fields={3} cards={0} />;

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Pricing</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Rates & Offerings</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Add rate cards for sessions, workshops, classes, commissions, or any offering. Each card shows on your public page.
      </p>

      {schemaPending && (
        <div className="mt-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-accent-soft)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--admin-title)]">Database update required</p>
          <p className="admin-muted mt-1 text-xs leading-5">Run <code className="font-mono text-[var(--admin-accent)]">MVP_COMPLETION_PATCH.sql</code> in Supabase to enable rates persistence.</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {cards.map((card, i) => (
          <div key={card.id} className="admin-card-soft p-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="admin-muted text-xs uppercase tracking-[0.14em]">Card {i + 1}</span>
              <button type="button" onClick={() => removeCard(card.id)}
                className="admin-muted text-xs hover:text-[var(--admin-danger)]">Remove</button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="admin-input" placeholder="Label (e.g. Workshop / Full session)"
                value={card.label} onChange={(e) => update(card.id, "label", e.target.value)} />
              <input className="admin-input" placeholder="Price (e.g. €120 / Free / From €80)"
                value={card.price} onChange={(e) => update(card.id, "price", e.target.value)} />
              <textarea className="admin-textarea sm:col-span-2 min-h-[80px]"
                placeholder="Description — duration, what's included, location, etc."
                value={card.description}
                onChange={(e) => update(card.id, "description", e.target.value)} />
              <div>
                <label className="admin-muted mb-1 block text-xs">Capacity (optional)</label>
                <input className="admin-input" type="number" min={1} placeholder="e.g. 5 spots"
                  value={card.capacity ?? ""}
                  onChange={(e) => update(card.id, "capacity", e.target.value ? parseInt(e.target.value) : null)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={addCard}
          className="admin-button admin-button-ghost">+ Add offering</button>
        <button type="button" onClick={handleSave} disabled={isSaving || schemaPending}
          className="admin-button admin-button-primary">{isSaving ? "Saving…" : "Save rates"}</button>
      </div>

      {status && (
        <p className="admin-validation mt-4"
          data-variant={status === "Rates saved." ? "success" : "error"}
          aria-live="polite">{status}</p>
      )}
    </section>
  );
}
