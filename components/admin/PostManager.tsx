"use client";

import { useEffect, useMemo, useState } from "react";

type Post = {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published";
  excerpt?: string | null;
  cover_image_url?: string | null;
  publish_at?: string | null;
};

type PostForm = {
  id: string;
  title: string;
  body: string;
  status: Post["status"];
  excerpt: string;
  cover_image_url: string;
  publish_at: string;
};

const emptyPost: PostForm = {
  id: "",
  title: "",
  body: "",
  status: "draft",
  excerpt: "",
  cover_image_url: "",
  publish_at: "",
};

type ValidationError = { path: string; message: string };

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PostManager() {
  const [items, setItems] = useState<Post[]>([]);
  const [form, setForm] = useState<PostForm>(emptyPost);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasIntegration, setHasIntegration] = useState(false);

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/posts");
    const integrationsRes = await fetch("/api/admin/integrations");
    if (!res.ok) {
      setStatus("No se pudo cargar los posts.");
      return;
    }
    if (!integrationsRes.ok) {
      setStatus("No se pudieron cargar integraciones.");
      return;
    }
    const data = await res.json();
    const integrationsData = await integrationsRes.json();
    setItems(data.items || []);
    const connectedCount = (integrationsData.items || []).filter(
      (item: { status: string }) => item.status === "connected"
    ).length;
    setHasIntegration(connectedCount > 0);
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
      excerpt: item.excerpt ?? "",
      cover_image_url: item.cover_image_url ?? "",
      publish_at: toLocalInput(item.publish_at),
    });
  }

  function resetForm() {
    setForm(emptyPost);
  }

  function validateForm(): ValidationError[] {
    const nextErrors: ValidationError[] = [];
    if (!form.title.trim()) {
      nextErrors.push({ path: "title", message: "Required" });
    }
    if (!form.body.trim()) {
      nextErrors.push({ path: "body", message: "Required" });
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
      body: form.body,
      status: form.status,
      excerpt: form.excerpt || undefined,
      cover_image_url: form.cover_image_url || undefined,
      publish_at: form.publish_at || undefined,
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
      setIsSaving(false);
      return;
    }

    resetForm();
    await load();
    setStatus("Guardado.");
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este post?")) return;
    setStatus("");
    setIsSaving(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
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
      <h2 className="mb-2 text-lg uppercase">Posts</h2>
      <p className="mb-4 text-xs uppercase tracking-[0.2em]">
        Crea borradores, agrega portada, y programa publicacion si aplica.
      </p>
      {!hasIntegration ? (
        <p className="input-helper" data-variant="error">
          Sin integracion activa. Upload remoto bloqueado.
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-3">
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
        <textarea
          className="theme-border p-2"
          placeholder="Excerpt (optional)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
        />
        <input
          className="theme-border p-2"
          placeholder="Cover image URL"
          value={form.cover_image_url}
          onChange={(e) =>
            setForm({ ...form, cover_image_url: e.target.value })
          }
          type="url"
        />
        <input
          className="theme-border p-2"
          placeholder="Publish at"
          value={form.publish_at}
          onChange={(e) => setForm({ ...form, publish_at: e.target.value })}
          type="datetime-local"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="theme-border px-4 py-2"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>
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
      {showPreview ? (
        <div className="theme-border mt-4 p-3">
          <p className="text-xs uppercase tracking-[0.2em]">Preview</p>
          {form.cover_image_url ? (
            <img
              className="mt-2 w-full object-cover"
              src={form.cover_image_url}
              alt={form.title || "Post cover"}
            />
          ) : null}
          <h3 className="mt-3 text-lg uppercase">{form.title || "Untitled"}</h3>
          <p className="text-sm">{form.excerpt || form.body}</p>
        </div>
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
