"use client";

import { useState } from "react";
import type { Post } from "@/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="theme-border relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[var(--bg)] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
          onClick={onClose}
          aria-label="Close"
        >
          ✕ Close
        </button>

        <p className="text-xs uppercase tracking-[0.2em] opacity-50">
          {formatDate(post.publish_at ?? post.created_at)}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{post.title}</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 opacity-85 whitespace-pre-line">
          {post.body}
        </div>
      </div>
    </div>
  );
}

export function PostFeed({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post | null>(null);

  if (!posts.length) {
    return <p className="text-sm opacity-60">No posts published yet.</p>;
  }

  return (
    <>
      {selected ? <PostModal post={selected} onClose={() => setSelected(null)} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="theme-border cursor-pointer rounded-xl p-5 transition-opacity hover:opacity-80"
            onClick={() => setSelected(post)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(post)}
            aria-label={`Read ${post.title}`}
          >
            <p className="text-xs uppercase tracking-[0.2em] opacity-50">
              {formatDate(post.publish_at ?? post.created_at)}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
            <p className="mt-2 text-sm opacity-75 line-clamp-3">
              {post.excerpt || post.body}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] opacity-40">
              Read more →
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
