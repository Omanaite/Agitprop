"use client";

import { useEffect, useMemo, useState } from "react";

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

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/gallery");
    const galleriesRes = await fetch("/api/admin/galleries");
    const integrationsRes = await fetch("/api/admin/integrations");
    if (!res.ok) {
      setStatus("No se pudo cargar la galeria.");
      return;
    }
    if (!galleriesRes.ok) {
      setStatus("No se pudo cargar las galerias.");
      return;
    }
    if (!integrationsRes.ok) {
      setStatus("No se pudieron cargar integraciones.");
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
      setStatus("Faltan datos requeridos.");
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
      setStatus("Selecciona una pieza valida para editar.");
      setIsSaving(false);
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
      setIsSaving(false);
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta pieza?")) return;
    setStatus("");
    setIsSaving(true);
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al eliminar.");
      setIsSaving(false);
      return;
    }
    await load();
    setStatus("Eliminado.");
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
      setStatus("Error al subir imagen.");
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
        setStatus("Error en carga masiva.");
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
      setStatus("Define un estilo por defecto para la carga masiva.");
      return;
    }
    setIsSaving(true);
    const requests = bulkUploads.map((url, index) =>
      fetch("/api/admin/gallery", {
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
      setStatus("Error al crear items desde carga masiva.");
      setIsSaving(false);
      return;
    }
    setBulkUploads([]);
    await load();
    setStatus("Carga masiva completada.");
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
      fetch(`/api/admin/gallery/${item.id}`, {
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
      setStatus("Error al guardar el orden.");
      setIsSaving(false);
      return;
    }
    setStatus("Orden guardado.");
    setIsSaving(false);
  }

  return (
    <section className="theme-border p-4">
      <h2 className="mb-2 text-lg uppercase">Galeria</h2>
      <p className="mb-4 text-xs uppercase tracking-[0.2em]">
        1) Crea galerias. 2) Sube piezas y asigna galeria. 3) Reordena y guarda.
      </p>
      {!hasIntegration ? (
        <p className="input-helper" data-variant="error">
          Sin integracion activa. Upload remoto bloqueado.
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          className={`theme-border p-2 ${
            errorMap.get("title") ? "input-error" : ""
          }`}
          placeholder="Titulo"
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
          placeholder="Estilo (ej: blackwork, linework)"
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
          placeholder="Descripcion corta"
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
            <option value="">Sin galeria (default)</option>
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
          <p className="input-helper">
            Usa imagenes cuadradas o verticales para el grid brutalista.
          </p>
          <input
            className="theme-border p-2"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className="theme-border p-2"
            placeholder="Location link (URL) - optional"
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
            disabled={!hasIntegration}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <p className="input-helper">
            Selecciona una imagen desde tu dispositivo o computadora.
          </p>
          {isUploading ? <p>Subiendo...</p> : null}
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="theme-border theme-invert px-4 py-2"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : form.id ? "Actualizar" : "Crear"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="theme-border px-4 py-2"
              disabled={isSaving}
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
          <li
            key={item.id}
            className="theme-border p-3"
            draggable
            onDragStart={() => setDragId(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorderItems(item.id)}
          >
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="theme-border px-4 py-2"
          onClick={() => void saveOrder()}
          disabled={isSaving || items.length === 0}
        >
          {isSaving ? "Guardando..." : "Guardar orden"}
        </button>
        <p className="text-xs uppercase tracking-[0.2em]">
          Tip: arrastra y luego guarda el orden.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm uppercase tracking-[0.2em]">
          Bulk Upload
        </h3>
        <input
          className="theme-border p-2"
          placeholder="Default style"
          value={bulkStyle}
          onChange={(e) => setBulkStyle(e.target.value)}
        />
        <input
          className="theme-border p-2"
          placeholder="Title prefix"
          value={bulkTitlePrefix}
          onChange={(e) => setBulkTitlePrefix(e.target.value)}
        />
        <select
          className="theme-border p-2"
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
        <p className="input-helper md:col-span-2">
          Puedes seleccionar varias imagenes desde tu dispositivo.
        </p>
        <button
          type="button"
          className="theme-border theme-invert px-4 py-2 md:col-span-2"
          onClick={() => void createFromUploads()}
          disabled={!hasIntegration || !bulkUploads.length}
        >
          Crear items desde uploads ({bulkUploads.length})
        </button>
      </div>
    </section>
  );
}
