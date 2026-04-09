"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME = "Hi! I'm your Agitprop assistant. Ask me anything about your studio — galleries, bookings, settings, domains, Telegram — I'm here to help.";

export function StudioChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Connection error. Try again." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--admin-title)] text-[var(--admin-bg)] shadow-lg transition-transform hover:scale-105"
        title="Studio assistant"
        aria-label="Open studio assistant"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 flex w-[min(360px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--admin-title)]">Studio Assistant</p>
              <p className="text-xs text-[var(--admin-muted)]">Powered by Claude</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-title)]"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--admin-accent-soft)] text-[var(--admin-title)]"
                    : "bg-[var(--admin-border)] text-[var(--admin-title)]"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-xl bg-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-muted)]">
                …
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--admin-border)] p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); void send(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                className="admin-input flex-1 text-sm"
                placeholder="Ask anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="admin-button admin-button-primary px-3 text-xs"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
