"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  style: string;
  image_url: string;
  gallery_id: string | null;
  tags?: string[] | null;
  location_link?: string | null;
  session_length_minutes?: number | null;
  aftercare?: string | null;
  sort_order?: number | null;
};

type Gallery = {
  id: string;
  title: string;
};

const emptyItem = {
  id: "",
  title: "",
  description: "",
  style: "",
  image_url: "",
  gallery_id: "",
  tags: "",
  location_link: "",
  session_length_minutes: "",
  aftercare: "",
  sort_order: "0",
};

type ValidationError = { path: string; message: string };

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [form, setForm] = useState<typeof emptyItem>(emptyItem);
  const [bulkStyle, setBulkStyle] = useState<string>("");
  const [bulkGalleryId, setBulkGalleryId] = useState<string>("");
  const [bulkTitlePrefix, setBulkTitlePrefix] = useState<string>("New piece");
  const [bulkUploads, setBulkUploads] = useState<string[]>([]);
  const [hasIntegration, setHasIntegration] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setStatus("");
    setErrors([]);
    setIsLoading(true);
    const res = await fetch("/api/admin/gallery-items");
    const galleriesRes = await fetch("/api/admin/galleries");
    const integrationsRes = await fetch("/api/admin/integrations");
    if (!res.ok) {
      setStatus("Could not load gallery items.");
      setIsLoading(false);
      return;
    }
    if (!galleriesRes.ok) {
      setStatus("Could not load galleries.");
      setIsLoading(false);
      return;
    }
    if (!integrationsRes.ok) {
      setStatus("Could not load integrations.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    const galleriesData = await galleriesRes.json();
    const integrationsData = await integrationsRes.json();
    setItems(data.items || []);
    setGalleries(galleriesData.items || []);
    const connectedCount = (integrationsData.items || []).filter(
      (item: { status: string }) => item.status === "connected"
    ).length;
    setHasIntegration(connectedCount > 0);
    setIsLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <AdminSectionSkeleton fields={6} cards={4} />;
  }

  function editItem(item: GalleryItem) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      style: item.style,
      image_url: item.image_url,
      gallery_id: item.gallery_id ?? "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      location_link: item.location_link ?? "",
      session_length_minutes: item.session_length_minutes?.toString() ?? "",
      aftercare: item.aftercare ?? "",
      sort_order: item.sort_order?.toString() ?? "0",
    });
  }

  function resetForm() {
    setForm(emptyItem);
  }

  function validateForm(): ValidationError[] {
    const nextErrors: ValidationError[] = [];
    if (!form.title.trim()) {
      nextErrors.push({ path: "title", message: "Required" });
    }
    if (!form.style.trim()) {
      nextErrors.push({ path: "style", message: "Required" });
    }
    if (!form.image_url.trim()) {
      nextErrors.push({ path: "image_url", message: "Required" });
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);

    const clientErrors = validateForm();
    if (clientErrors.length) {
      setErrors(clientErrors);
      setStatus("Required fields are missing.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: form.title,
      description: form.description || undefined,
      style: form.style,
      image_url: form.image_url,
      gallery_id: form.gallery_id || undefined,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      location_link: form.location_link || undefined,
      session_length_minutes: form.session_length_minutes
        ? Number(form.session_length_minutes)
        : undefined,
      aftercare: form.aftercare || undefined,
      sort_order: form.sort_order ? Number(form.sort_order) : 0,
    };

    const isEdit = Boolean(form.id);
    if (isEdit && (!form.id || form.id === "undefined")) {
      setStatus("Select a valid piece to edit.");
      setIsSaving(false);
      return;
    }
    const res = await fetch(
      isEdit ? `/api/admin/gallery-items/${form.id}` : "/api/admin/gallery-items",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to save piece.");
      setIsSaving(false);
      return;
    }

    resetForm();
    await load();
    setStatus("Saved.");
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this piece?")) return;
    setStatus("");
    setIsSaving(true);
    const res = await fetch(`/api/admin/gallery-items/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to delete.");
      setIsSaving(false);
      return;
    }
    await load();
    setStatus("Deleted.");
    setIsSaving(false);
  }

  async function handleUpload(file: File) {
    setIsUploading(true);
    setStatus("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setStatus("Image upload failed.");
      setIsUploading(false);
      return;
    }
    const data = await res.json();
    setForm((prev) => ({ ...prev, image_url: data.url }));
    setIsUploading(false);
  }

  async function handleBulkUpload(files: FileList) {
    setIsUploading(true);
    setStatus("");
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
    if (!res.ok) {
      setIsUploading(false);
      setStatus("Bulk upload failed.");
      return;
    }
      const data = await res.json();
      uploaded.push(data.url);
    }
    setBulkUploads((prev) => [...prev, ...uploaded]);
    setIsUploading(false);
  }

  async function createFromUploads() {
    if (!bulkUploads.length) return;
    if (!bulkStyle.trim()) {
      setStatus("Set a default style for bulk upload.");
      return;
    }
    setIsSaving(true);
    const requests = bulkUploads.map((url, index) =>
      fetch("/api/admin/gallery-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${bulkTitlePrefix} ${index + 1}`,
          style: bulkStyle,
          image_url: url,
          gallery_id: bulkGalleryId || undefined,
          sort_order: index,
        }),
      })
    );
    const results = await Promise.all(requests);
    if (results.some((r) => !r.ok)) {
      setStatus("Failed to create items from bulk upload.");
      setIsSaving(false);
      return;
    }
    setBulkUploads([]);
    await load();
    setStatus("Bulk upload completed.");
    setIsSaving(false);
  }

  function reorderItems(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const fromIndex = next.findIndex((i) => i.id === dragId);
    const toIndex = next.findIndex((i) => i.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setItems(next);
  }

  async function saveOrder() {
    setStatus("");
    setIsSaving(true);
    const updates = items.map((item, index) =>
      fetch(`/api/admin/gallery-items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description ?? "",
          style: item.style,
          image_url: item.image_url,
          gallery_id: item.gallery_id ?? undefined,
          tags: item.tags ?? undefined,
          location_link: item.location_link ?? undefined,
          session_length_minutes: item.session_length_minutes ?? undefined,
          aftercare: item.aftercare ?? undefined,
          sort_order: index,
        }),
      })
    );
    const results = await Promise.all(updates);
    if (results.some((r) => !r.ok)) {
      setStatus("Failed to save order.");
      setIsSaving(false);
      return;
    }
    setStatus("Order saved.");
    setIsSaving(false);
  }

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Portfolio library</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Gallery Pieces</h2>
      <p className="admin-muted mt-2 mb-4 text-sm leading-6">
        1) Create galleries. 2) Upload pieces and assign a gallery. 3) Reorder and save.
      </p>
      {!hasIntegration ? (
        <p className="admin-validation mb-4" data-variant="error">
          No active integration. Remote uploads are blocked.
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          className={`admin-input ${
            errorMap.get("title") ? "admin-field-error" : ""
          }`}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          minLength={2}
          required
        />
        {errorMap.get("title") ? (
          <p className="admin-helper" data-variant="error">
            title: {errorMap.get("title")}
          </p>
        ) : null}
        <input
          className={`admin-input ${
            errorMap.get("style") ? "admin-field-error" : ""
          }`}
          placeholder="Style (ex: blackwork, linework)"
          value={form.style}
          onChange={(e) => setForm({ ...form, style: e.target.value })}
          minLength={2}
          required
        />
        {errorMap.get("style") ? (
          <p className="admin-helper" data-variant="error">
            style: {errorMap.get("style")}
          </p>
        ) : null}
        <input
          className={`admin-input md:col-span-2 ${
            errorMap.get("description") ? "admin-field-error" : ""
          }`}
          placeholder="Short description"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errorMap.get("description") ? (
          <p className="admin-helper" data-variant="error">
            description: {errorMap.get("description")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 md:col-span-2">
          <select
            className={`admin-select ${
              errorMap.get("gallery_id") ? "admin-field-error" : ""
            }`}
            value={form.gallery_id}
            onChange={(e) => setForm({ ...form, gallery_id: e.target.value })}
          >
            <option value="">No gallery (default)</option>
            {galleries.map((gallery) => (
              <option key={gallery.id} value={gallery.id}>
                {gallery.title}
              </option>
            ))}
          </select>
          <input
            className={`admin-input ${
              errorMap.get("image_url") ? "admin-field-error" : ""
            }`}
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            type="url"
            required
          />
          <p className="admin-helper">
            Use square or vertical images for the brutal grid.
          </p>
          <input
            className="admin-input"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Location link (URL) - optional"
            value={form.location_link}
            onChange={(e) =>
              setForm({ ...form, location_link: e.target.value })
            }
            type="url"
          />
          <input
            className="admin-input"
            placeholder="Session length (minutes)"
            value={form.session_length_minutes}
            onChange={(e) =>
              setForm({ ...form, session_length_minutes: e.target.value })
            }
            type="number"
            min={0}
          />
          <input
            className="admin-input"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            type="number"
          />
          <textarea
            className="admin-textarea min-h-[120px]"
            placeholder="Aftercare notes"
            value={form.aftercare}
            onChange={(e) => setForm({ ...form, aftercare: e.target.value })}
          />
          {errorMap.get("image_url") ? (
            <p className="admin-helper" data-variant="error">
              image_url: {errorMap.get("image_url")}
            </p>
          ) : null}
          <input
            type="file"
            accept="image/*"
            disabled={!hasIntegration}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <p className="admin-helper">
            Choose an image from your device or computer.
          </p>
          {isUploading ? (
            <p className="admin-helper text-[var(--admin-accent)]">Uploading...</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : form.id ? "Update" : "Create"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="admin-button admin-button-ghost"
              disabled={isSaving}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      {status ? (
        <p
          className="admin-validation mt-4"
          data-variant={errors.length ? "error" : "success"}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
      {errors.length ? (
        <ul className="mt-3 space-y-1 text-sm text-[var(--admin-danger)]" aria-live="polite">
          {errors.map((error) => (
            <li key={`${error.path}-${error.message}`}>
              {error.path}: {error.message}
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="admin-card-soft p-4"
            draggable
            onDragStart={() => setDragId(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorderItems(item.id)}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-muted)]">{item.style}</div>
            <div className="admin-title mt-2 text-lg font-semibold">{item.title}</div>
            <div className="admin-muted mt-2 text-sm leading-6">{item.description}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="admin-button"
                onClick={() => editItem(item)}
              >
                Edit
              </button>
              <button
                className="admin-button admin-button-danger"
                onClick={() => void handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="admin-button"
          onClick={() => void saveOrder()}
          disabled={isSaving || items.length === 0}
        >
          {isSaving ? "Saving..." : "Save order"}
        </button>
        <p className="admin-helper uppercase tracking-[0.14em]">
          Tip: drag and then save the order.
        </p>
      </div>

      <div className="admin-card-soft mt-6 grid gap-3 p-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--admin-title)]">
          Bulk Upload
        </h3>
        <input
          className="admin-input"
          placeholder="Default style"
          value={bulkStyle}
          onChange={(e) => setBulkStyle(e.target.value)}
        />
        <input
          className="admin-input"
          placeholder="Title prefix"
          value={bulkTitlePrefix}
          onChange={(e) => setBulkTitlePrefix(e.target.value)}
        />
        <select
          className="admin-select"
          value={bulkGalleryId}
          onChange={(e) => setBulkGalleryId(e.target.value)}
        >
          <option value="">No gallery (default)</option>
          {galleries.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={!hasIntegration}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length) void handleBulkUpload(files);
          }}
        />
        <p className="admin-helper md:col-span-2">
          You can select multiple images from your device.
        </p>
        <button
          type="button"
          className="admin-button admin-button-primary md:col-span-2"
          onClick={() => void createFromUploads()}
          disabled={!hasIntegration || !bulkUploads.length}
        >
          Create items from uploads ({bulkUploads.length})
        </button>
      </div>
    </section>
  );
}
