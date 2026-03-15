import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { signOutAdmin } from "./actions";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6 text-[var(--fg)] md:p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between theme-border p-4">
          <div>
            <h1 className="font-[var(--font-heading)] text-2xl uppercase">
              Admin Console
            </h1>
            <p className="text-sm">Gestion de contenido</p>
          </div>
          <form action={signOutAdmin}>
            <button type="submit" className="theme-border px-4 py-2">
              Salir
            </button>
          </form>
        </header>

        <AdminConsoleShell />
      </div>
    </div>
  );
}
