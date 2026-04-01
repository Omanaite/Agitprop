// Apply BOOKINGS_TENANT_ISOLATION_PATCH to Supabase production.
// Usage: node scripts/apply-bookings-patch.js

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbnJ6dmtsZWdiaWVqbGtzbmFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3Mzc3NSwiZXhwIjoyMDg4ODQ5Nzc1fQ.GW6czCHn7CsBwbjJ97aPDLIxwRfLb97GqHLdpj0beds";
const projectId = "ffnrzvklegbiejlksnai";

const sql = `
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'bookings' and column_name = 'owner_user_id'
  ) then
    alter table bookings add column owner_user_id uuid references auth.users(id) on delete set null;
  end if;
end $$;

create index if not exists bookings_owner_user_id_idx on bookings(owner_user_id);
`;

async function apply() {
  const res = await fetch(
    `https://${projectId}.supabase.co/rest/v1/rpc/exec_sql`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!res.ok) {
    // Fallback: try the SQL API endpoint
    const res2 = await fetch(
      `https://api.supabase.com/v1/projects/${projectId}/database/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      }
    );

    const data2 = await res2.json().catch(() => null);
    if (!res2.ok) {
      console.error("Failed:", data2);
      process.exit(1);
    }
    console.log("Applied via management API:", data2);
    return;
  }

  const data = await res.json().catch(() => null);
  console.log("Applied:", data);
}

apply().catch(console.error);
