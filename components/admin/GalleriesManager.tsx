"use client";

import { useEffect, useMemo, useState } from "react";

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
};

const emptyGallery = {
  id: "",
  title: "",
  description: "",
  slug: "",
};

type ValidationError = { path: string; message: string };

export function GalleriesManager() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [form, setForm] = useState<typeof emptyGallery>(emptyGallery);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );
  const [isSaving, setIsSaving] = useState(false);

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/galleries");
    if (!res.ok) {
      setStatus("No se pudo cargar las galerias.");
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function editItem(item: Gallery) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      slug: item.slug,
    });
  }

  function resetForm() {
    setForm(emptyGallery);
  }

  function validateForm(): ValidationError[] {
    const nextErrors: ValidationError[] = [];
    if (!form.title.trim()) {
      nextErrors.push({ path: "title", message: "Required" });
    }
    if (!form.slug.trim()) {
      nextErrors.push({ path: "slug", message: "Required" });
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
      slug: form.slug,
    };

    const isEdit = Boolean(form.id);
    const res = await fetch(
      isEdit ? `/api/admin/galleries/${form.id}` : "/api/admin/galleries",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al guardar la galeria.");
      setIsSaving(false);
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta galeria?")) return;
    setStatus("");
    setIsSaving(true);
    const res = await fetch(`/api/admin/galleries/${id}`, { method: "DELETE" });
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

  return (
    <section className="theme-border p-4">
      <h2 className="mb-2 text-lg uppercase">Galerias</h2>
      <p className="mb-4 text-xs uppercase tracking-[0.2em]">
        Crea galerias primero. Luego asigna piezas desde el editor de galeria.
      </p>
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
            errorMap.get("slug") ? "input-error" : ""
          }`}
          placeholder="Slug (ej: blackwork-2026)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          minLength={2}
          required
        />
        {errorMap.get("slug") ? (
          <p className="input-helper" data-variant="error">
            slug: {errorMap.get("slug")}
          </p>
        ) : null}
        <input
          className={`theme-border p-2 md:col-span-2 ${
            errorMap.get("description") ? "input-error" : ""
          }`}
          placeholder="Descripcion"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errorMap.get("description") ? (
          <p className="input-helper" data-variant="error">
            description: {errorMap.get("description")}
          </p>
        ) : null}
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
          <li key={item.id} className="theme-border p-3">
            <div className="text-xs uppercase">{item.slug}</div>
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
