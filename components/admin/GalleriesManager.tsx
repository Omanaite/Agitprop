"use client";

import { useEffect, useState } from "react";

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

export function GalleriesManager() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [form, setForm] = useState<typeof emptyGallery>(emptyGallery);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/galleries");
    if (!res.ok) {
      setStatus("No se pudo cargar las galerías.");
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);

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
      setStatus(data?.message ?? "Error al guardar la galería.");
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta galería?")) return;
    setStatus("");
    const res = await fetch(`/api/admin/galleries/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al eliminar.");
      return;
    }
    await load();
    setStatus("Eliminado.");
  }

  return (
    <section className="theme-border p-4">
      <h2 className="mb-4 text-lg uppercase">Galerías</h2>
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
        <input
          className={`theme-border p-2 md:col-span-2 ${
            errorMap.get("description") ? "input-error" : ""
          }`}
          placeholder="Descripción"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
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

