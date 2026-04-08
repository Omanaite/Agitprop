"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";
import { useStudioPreview } from "@/lib/studio-preview-context";

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

export function StudioPostManager() {
  const { refreshPreview } = useStudioPreview();
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
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    setStatus("");
    setErrors([]);
    setIsLoading(true);
    const res = await fetch("/api/studio/posts");
    const integrationsRes = await fetch("/api/studio/integrations");
    if (!res.ok) {
      setStatus("Could not load posts.");
      setIsLoading(false);
      return;
    }
    if (!integrationsRes.ok) {
      setStatus("Could not load integrations.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    const integrationsData = await integrationsRes.json();
    setItems(data.items || []);
    const connectedCount = (integrationsData.items || []).filter(
      (item: { status: string }) => item.status === "connected"
    ).length;
    setHasIntegration(connectedCount > 0);
    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!form.id) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 120);
  }, [form.id]);

  if (isLoading) {
    return <AdminSectionSkeleton fields={5} cards={4} />;
  }

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
      setStatus("Required fields are missing.");
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
      isEdit ? `/api/studio/posts/${form.id}` : "/api/studio/posts",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to save post.");
      setIsSaving(false);
      return;
    }

    resetForm();
    await load();
    setStatus("Saved.");
    setIsSaving(false);
    refreshPreview();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    setStatus("");
    setIsSaving(true);
    const res = await fetch(`/api/studio/posts/${id}`, { method: "DELETE" });
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

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Editorial</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Posts</h2>
      <p className="admin-muted mt-2 mb-4 text-sm leading-6">
        Draft posts, add a cover, and schedule publication when needed.
      </p>
      {!hasIntegration ? (
        <p className="admin-validation mb-4" data-variant="error">
          No active integration. Remote uploads are blocked.
        </p>
      ) : null}
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-3">
        <input
          ref={titleInputRef}
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
        <textarea
          className={`admin-textarea min-h-[180px] ${
            errorMap.get("body") ? "admin-field-error" : ""
          }`}
          placeholder="Content"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={4}
          minLength={10}
          required
        />
        {errorMap.get("body") ? (
          <p className="admin-helper" data-variant="error">
            body: {errorMap.get("body")}
          </p>
        ) : null}
        <textarea
          className="admin-textarea min-h-[96px]"
          placeholder="Excerpt (optional)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
        />
        <input
          className="admin-input"
          placeholder="Cover image URL"
          value={form.cover_image_url}
          onChange={(e) =>
            setForm({ ...form, cover_image_url: e.target.value })
          }
          type="url"
        />
        <input
          className="admin-input"
          placeholder="Publish at"
          value={form.publish_at}
          onChange={(e) => setForm({ ...form, publish_at: e.target.value })}
          type="datetime-local"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="admin-button"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>
        <select
          className="admin-select"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Post["status"] })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex flex-wrap gap-2">
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
      {showPreview ? (
        <div className="admin-card-soft mt-5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-muted)]">
            Preview
          </p>
          {form.cover_image_url ? (
            <Image
              className="mt-3 h-56 w-full rounded-2xl object-cover"
              src={form.cover_image_url}
              alt={form.title || "Post cover"}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : null}
          <h3 className="admin-title mt-4 text-xl font-semibold">
            {form.title || "Untitled"}
          </h3>
          <p className="admin-muted mt-2 text-sm leading-6">
            {form.excerpt || form.body}
          </p>
        </div>
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
      {items.length === 0 ? (
        <div className="admin-card-soft mt-6 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--admin-title)]">No posts yet</p>
          <p className="admin-muted mt-1 text-xs leading-5">
            Write your first post above — aftercare guides, studio news, or anything you want clients to read.
          </p>
        </div>
      ) : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="admin-card-soft p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="admin-chip">{item.status}</span>
            </div>
            <div className="admin-title mt-3 text-lg font-semibold">{item.title}</div>
            <div className="admin-muted mt-2 text-sm leading-6">
              {item.body.slice(0, 120)}...
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="admin-button"
                onClick={() => editPost(item)}
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
    </section>
  );
}

