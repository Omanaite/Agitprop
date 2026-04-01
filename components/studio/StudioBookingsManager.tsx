"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Booking = {
  id: string;
  name: string;
  email: string;
  preferred_date: string;
  placement: string;
  description: string;
  status: "pending" | "confirmed" | "declined" | "completed";
  created_at: string;
};

const STATUS_LABELS: Record<Booking["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  completed: "Completed",
};

const STATUS_VARIANT: Record<Booking["status"], string> = {
  pending: "text-[var(--admin-accent)]",
  confirmed: "text-green-500",
  declined: "text-[var(--admin-danger)]",
  completed: "text-[var(--admin-muted)]",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function StudioBookingsManager() {
  const [items, setItems] = useState<Booking[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [schemaPending, setSchemaPending] = useState(false);

  async function load() {
    setStatus("");
    setIsLoading(true);
    const res = await fetch("/api/studio/bookings");
    if (!res.ok) {
      setStatus("Could not load bookings.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
    if (data.schemaPending) setSchemaPending(true);
    setIsLoading(false);
  }

  useEffect(() => {
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, []);

  async function updateStatus(id: string, newStatus: Booking["status"]) {
    setUpdatingId(id);
    const res = await fetch("/api/studio/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } else {
      const data = await res.json().catch(() => null);
      setStatus(data?.message ?? "Failed to update booking.");
    }
    setUpdatingId(null);
  }

  if (isLoading) return <AdminSectionSkeleton fields={0} cards={4} />;

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Bookings</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Booking Requests</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Client session requests submitted through your public site.
      </p>

      {schemaPending ? (
        <p className="admin-validation mt-4" data-variant="error">
          Bookings table needs the owner_user_id column. Apply the latest schema patch.
        </p>
      ) : null}

      {status ? (
        <p className="admin-validation mt-4" data-variant="error" aria-live="polite">
          {status}
        </p>
      ) : null}

      {items.length === 0 && !schemaPending ? (
        <div className="admin-card-soft mt-6 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--admin-title)]">No booking requests yet</p>
          <p className="admin-muted mt-1 text-xs leading-5">
            When clients submit a booking from your public site, they will appear here.
          </p>
        </div>
      ) : null}

      <ul className="mt-6 space-y-4">
        {items.map((booking) => (
          <li key={booking.id} className="admin-card-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  {booking.name}
                </p>
                <a
                  href={`mailto:${booking.email}`}
                  className="text-xs text-[var(--admin-accent)] hover:underline"
                >
                  {booking.email}
                </a>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${STATUS_VARIANT[booking.status]}`}>
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            <div className="mt-3 grid gap-1 text-xs text-[var(--admin-muted)]">
              <p>
                <span className="font-semibold">Preferred date:</span>{" "}
                {formatDate(booking.preferred_date)}
              </p>
              <p>
                <span className="font-semibold">Placement:</span> {booking.placement}
              </p>
              <p>
                <span className="font-semibold">Submitted:</span>{" "}
                {formatDate(booking.created_at)}
              </p>
            </div>

            <p className="admin-muted mt-3 text-sm leading-6">{booking.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {booking.status === "pending" ? (
                <>
                  <button
                    className="admin-button admin-button-primary text-xs"
                    disabled={updatingId === booking.id}
                    onClick={() => void updateStatus(booking.id, "confirmed")}
                  >
                    Confirm
                  </button>
                  <button
                    className="admin-button admin-button-danger text-xs"
                    disabled={updatingId === booking.id}
                    onClick={() => void updateStatus(booking.id, "declined")}
                  >
                    Decline
                  </button>
                </>
              ) : null}
              {booking.status === "confirmed" ? (
                <button
                  className="admin-button text-xs"
                  disabled={updatingId === booking.id}
                  onClick={() => void updateStatus(booking.id, "completed")}
                >
                  Mark completed
                </button>
              ) : null}
              {(booking.status === "declined" || booking.status === "completed") ? (
                <button
                  className="admin-button admin-button-ghost text-xs"
                  disabled={updatingId === booking.id}
                  onClick={() => void updateStatus(booking.id, "pending")}
                >
                  Reopen
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
