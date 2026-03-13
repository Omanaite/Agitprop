import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuditEvent = {
  actor_email?: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function logAuditEvent(event: AuditEvent) {
  try {
    const client = createSupabaseServerClient();
    await client.from("audit_logs").insert({
      actor_email: event.actor_email ?? null,
      action: event.action,
      entity: event.entity,
      entity_id: event.entity_id ?? null,
      metadata: event.metadata ?? null,
    });
  } catch {
    // Fail-open: audit logging should not block user actions.
  }
}

