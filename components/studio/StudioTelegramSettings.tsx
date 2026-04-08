"use client";

import { useEffect, useState } from "react";

/**
 * StudioTelegramSettings
 *
 * Lets the artist connect their own Telegram bot to receive booking
 * notifications. Each artist creates a bot via BotFather (free) and
 * enters their token + chat ID here.
 */
export function StudioTelegramSettings() {
  const [configured, setConfigured] = useState(false);
  const [tokenHint, setTokenHint] = useState<string | null>(null);
  const [chatId, setChatId] = useState("");
  const [botToken, setBotToken] = useState("");
  const [newChatId, setNewChatId] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/studio/telegram");
    if (res.ok) {
      const data = await res.json();
      setConfigured(data.configured ?? false);
      setTokenHint(data.bot_token_hint ?? null);
      setChatId(data.chat_id ?? "");
    }
    setIsLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function handleSave() {
    setStatus(""); setIsError(false); setIsSaving(true);
    const res = await fetch("/api/studio/telegram", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bot_token: botToken, chat_id: newChatId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Failed to save.");
      setIsError(true);
    } else {
      setConfigured(true);
      setTokenHint(`...${botToken.slice(-6)}`);
      setChatId(newChatId);
      setBotToken("");
      setNewChatId("");
      setShowForm(false);
      setStatus("Telegram connected.");
      setIsError(false);
    }
    setIsSaving(false);
  }

  async function handleTest() {
    setStatus(""); setIsTesting(true);
    const res = await fetch("/api/studio/telegram", { method: "POST" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Test failed.");
      setIsError(true);
    } else {
      setStatus("Test message sent! Check your Telegram.");
      setIsError(false);
    }
    setIsTesting(false);
  }

  async function handleRemove() {
    setStatus(""); setIsRemoving(true);
    await fetch("/api/studio/telegram", { method: "DELETE" });
    setConfigured(false);
    setTokenHint(null);
    setChatId("");
    setShowForm(false);
    setStatus("Telegram disconnected.");
    setIsError(false);
    setIsRemoving(false);
  }

  if (isLoading) return null;

  return (
    <section className="admin-card mt-6 p-6 md:p-7">
      <p className="admin-chip">Notifications</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Telegram</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Receive booking notifications instantly via Telegram — free, no subscription.{" "}
        <a
          href="https://t.me/BotFather"
          target="_blank"
          rel="noopener noreferrer"
          className="underline opacity-70 hover:opacity-100"
        >
          Create a bot with BotFather →
        </a>
      </p>

      {configured ? (
        <div className="mt-5 rounded-xl border border-[var(--admin-border)] p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">●</span>
            <span className="font-semibold">Connected</span>
          </div>
          <div className="admin-muted mt-2 grid gap-1 text-xs">
            <p>Token: <span className="font-mono">{tokenHint}</span></p>
            {chatId && <p>Chat ID: <span className="font-mono">{chatId}</span></p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="admin-button admin-button-ghost text-xs"
              onClick={() => void handleTest()}
              disabled={isTesting}
            >
              {isTesting ? "Sending..." : "Send test message"}
            </button>
            <button
              type="button"
              className="admin-button admin-button-ghost text-xs"
              onClick={() => setShowForm(!showForm)}
            >
              Update
            </button>
            <button
              type="button"
              className="admin-button admin-button-ghost text-xs text-red-500 hover:text-red-600"
              onClick={() => void handleRemove()}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Disconnect"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="admin-button admin-button-primary mt-5"
          onClick={() => setShowForm(true)}
        >
          Connect Telegram
        </button>
      )}

      {showForm && (
        <div className="mt-5 grid gap-4 rounded-xl border border-[var(--admin-border)] p-4">
          <div>
            <label className="admin-label mb-1 block text-xs uppercase tracking-[0.15em] opacity-60">
              Bot Token
            </label>
            <input
              type="password"
              className="admin-input w-full font-mono"
              placeholder="123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
            <p className="admin-muted mt-1 text-xs">From BotFather — keep this private.</p>
          </div>
          <div>
            <label className="admin-label mb-1 block text-xs uppercase tracking-[0.15em] opacity-60">
              Chat ID
            </label>
            <input
              type="text"
              className="admin-input w-full font-mono"
              placeholder="-100123456789"
              value={newChatId}
              onChange={(e) => setNewChatId(e.target.value)}
            />
            <p className="admin-muted mt-1 text-xs">
              Your personal chat ID or a group. Use{" "}
              <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="underline">
                @userinfobot
              </a>{" "}
              to find yours.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="admin-button admin-button-primary"
              onClick={() => void handleSave()}
              disabled={isSaving || !botToken || !newChatId}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && (
        <p className="admin-validation mt-4" data-variant={isError ? "error" : "success"} aria-live="polite">
          {status}
        </p>
      )}
    </section>
  );
}
