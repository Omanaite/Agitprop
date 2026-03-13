"use client";

import { useEffect, useState } from "react";

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

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [form, setForm] = useState<typeof emptyItem>(emptyItem);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));
  const [isUploading, setIsUploading] = useState(false);

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/gallery");
    const galleriesRes = await fetch("/api/admin/galleries");
    if (!res.ok) {
      setStatus("No se pudo cargar la galería.");
      return;
    }
    if (!galleriesRes.ok) {
      setStatus("No se pudo cargar las galerías.");
      return;
    }
    const data = await res.json();
    const galleriesData = await galleriesRes.json();
    setItems(data.items || []);
    setGalleries(galleriesData.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

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
      session_length_minutes:
        item.session_length_minutes?.toString() ?? "",
      aftercare: item.aftercare ?? "",
      sort_order: item.sort_order?.toString() ?? "0",
    });
  }

  function resetForm() {
    setForm(emptyItem);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);
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
      setStatus("Selecciona una pieza válida para editar.");
      return;
    }
    const res = await fetch(
      isEdit ? `/api/admin/gallery/${form.id}` : "/api/admin/gallery",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al guardar la pieza.");
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta pieza?")) return;
    setStatus("");
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al eliminar.");
      return;
    }
    await load();
    setStatus("Eliminado.");
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
    setIsUploading(false);
    if (!res.ok) {
      setStatus("Error al subir imagen.");
      return;
    }
    const data = await res.json();
    setForm((prev) => ({ ...prev, image_url: data.url }));
  }

  return (
    <section className="theme-border p-4">
      <h2 className="mb-4 text-lg uppercase">Galería</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          className={`theme-border p-2 ${
            errorMap.get("title") ? "input-error" : ""
          }`}
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          minLength={2}
          required
        />
        {errorMap.get("title") ? (
          <p className="input-helper" data-variant="error">
            title: {errorMap.get("title")}
          </p>
        ) : null}
        <input
          className={`theme-border p-2 ${
            errorMap.get("style") ? "input-error" : ""
          }`}
          placeholder="Estilo"
          value={form.style}
          onChange={(e) => setForm({ ...form, style: e.target.value })}
          minLength={2}
          required
        />
        {errorMap.get("style") ? (
          <p className="input-helper" data-variant="error">
            style: {errorMap.get("style")}
          </p>
        ) : null}
        <input
          className={`theme-border p-2 md:col-span-2 ${
            errorMap.get("description") ? "input-error" : ""
          }`}
          placeholder="Descripción"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errorMap.get("description") ? (
          <p className="input-helper" data-variant="error">
            description: {errorMap.get("description")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 md:col-span-2">
          <select
            className={`theme-border p-2 ${
              errorMap.get("gallery_id") ? "input-error" : ""
            }`}
            value={form.gallery_id}
            onChange={(e) => setForm({ ...form, gallery_id: e.target.value })}
          >
            <option value="">Sin galería (default)</option>
            {galleries.map((gallery) => (
              <option key={gallery.id} value={gallery.id}>
                {gallery.title}
              </option>
            ))}
          </select>
          <input
            className={`theme-border p-2 ${
              errorMap.get("image_url") ? "input-error" : ""
            }`}
            placeholder="URL de imagen"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            type="url"
            required
          />
          <input
            className="theme-border p-2"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className="theme-border p-2"
            placeholder="Location link (URL)"
            value={form.location_link}
            onChange={(e) =>
              setForm({ ...form, location_link: e.target.value })
            }
            type="url"
          />
          <input
            className="theme-border p-2"
            placeholder="Session length (minutes)"
            value={form.session_length_minutes}
            onChange={(e) =>
              setForm({ ...form, session_length_minutes: e.target.value })
            }
            type="number"
            min={0}
          />
          <input
            className="theme-border p-2"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            type="number"
          />
          <textarea
            className="theme-border p-2 min-h-[90px]"
            placeholder="Aftercare notes"
            value={form.aftercare}
            onChange={(e) => setForm({ ...form, aftercare: e.target.value })}
          />
          {errorMap.get("image_url") ? (
            <p className="input-helper" data-variant="error">
              image_url: {errorMap.get("image_url")}
            </p>
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          {isUploading ? <p>Subiendo...</p> : null}
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="theme-border theme-invert px-4 py-2"
          >
            {form.id ? "Actualizar" : "Crear"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="theme-border px-4 py-2"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
      {status ? (
        <p
          className="validation-box mt-3"
          data-variant={errors.length ? "error" : "success"}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
      {errors.length ? (
        <ul className="validation-list" aria-live="polite">
          {errors.map((error) => (
            <li key={`${error.path}-${error.message}`}>
              {error.path}: {error.message}
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="theme-border p-3">
            <div className="text-sm uppercase">{item.style}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-xs">{item.description}</div>
            <div className="mt-2 flex gap-2">
              <button
                className="theme-border px-2 py-1 text-xs"
                onClick={() => editItem(item)}
              >
                Editar
              </button>
              <button
                className="theme-border px-2 py-1 text-xs"
                onClick={() => void handleDelete(item.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
