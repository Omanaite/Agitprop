"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published";
};

const emptyPost = {
  id: "",
  title: "",
  body: "",
  status: "draft" as const,
};

export function PostManager() {
  const [items, setItems] = useState<Post[]>([]);
  const [form, setForm] = useState<typeof emptyPost>(emptyPost);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/posts");
    if (!res.ok) {
      setStatus("No se pudo cargar los posts.");
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function editPost(item: Post) {
    setForm({
      id: item.id,
      title: item.title,
      body: item.body,
      status: item.status,
    });
  }

  function resetForm() {
    setForm(emptyPost);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);
    const payload = {
      title: form.title,
      body: form.body,
      status: form.status,
    };

    const isEdit = Boolean(form.id);
    const res = await fetch(
      isEdit ? `/api/admin/posts/${form.id}` : "/api/admin/posts",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Error al guardar el post.");
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este post?")) return;
    setStatus("");
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
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
      <h2 className="mb-4 text-lg uppercase">Posts</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
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
        <textarea
          className={`theme-border p-2 ${
            errorMap.get("body") ? "input-error" : ""
          }`}
          placeholder="Contenido"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={4}
          minLength={10}
          required
        />
        {errorMap.get("body") ? (
          <p className="input-helper" data-variant="error">
            body: {errorMap.get("body")}
          </p>
        ) : null}
        <select
          className="theme-border p-2"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Post["status"] })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex gap-2">
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
            <div className="text-xs uppercase">{item.status}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-xs">{item.body.slice(0, 120)}...</div>
            <div className="mt-2 flex gap-2">
              <button
                className="theme-border px-2 py-1 text-xs"
                onClick={() => editPost(item)}
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
