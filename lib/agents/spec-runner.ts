/**
 * Spec Runner — Agitprop
 *
 * Ejecutor de fases SDD sobre un cambio específico.
 * Complementa orchestrator.ts: mientras el orquestador gestiona estado y prompts,
 * el runner expone la API de alto nivel que el modelo (o un script) llama.
 *
 * Reemplaza: .agents/skills/spec-kit-command-cursor-main/
 * Documentado en: docs/ENGINEERING_CONTEXT.md
 *
 * Uso típico desde el modelo:
 *   import { run, status, resume } from "@/lib/agents/spec-runner"
 *   const prompt = run("editable-sections", "design", "Añadir body text a homepage_sections")
 *   // → string listo para pasarle al sub-agente
 */

import {
  transition,
  completePhase,
  failPhase,
  statusReport,
  buildSubAgentPrompt,
  listChanges,
  loadState,
  nextPhase,
  type SDDPhase,
  type ChangeState,
} from "./orchestrator";

// ─── API principal ─────────────────────────────────────────────────────────────

/**
 * Inicia o retoma una fase de un cambio.
 * Retorna el prompt listo para el sub-agente, o un error si la transición no es válida.
 */
export function run(
  changeName: string,
  phase: SDDPhase,
  userIntent: string
): { ok: true; prompt: string; state: ChangeState } | { ok: false; reason: string } {
  const result = transition(changeName, phase);
  if (!result.ok) return result;
  return {
    ok: true,
    prompt: buildSubAgentPrompt(changeName, phase, userIntent),
    state: result.state,
  };
}

/**
 * Marca la fase actual como completada.
 * Llamar después de que el sub-agente confirme que escribió su artefacto.
 */
export function done(changeName: string, artifactRelPath?: string) {
  return completePhase(changeName, artifactRelPath);
}

/**
 * Retoma un cambio desde donde quedó.
 * Útil después de una interrupción o context compaction.
 * Retorna el prompt para continuar la fase actual, o avanza a la siguiente si ya está done.
 */
export function resume(
  changeName: string,
  userIntent: string
): { ok: true; prompt: string; phase: SDDPhase } | { ok: false; reason: string } {
  const state = loadState(changeName);
  const current = state.currentPhase;

  // Si la fase actual está in_progress, re-genera el prompt para continuarla
  if (state.phases[current] === "in_progress") {
    return {
      ok: true,
      prompt: buildSubAgentPrompt(changeName, current, userIntent),
      phase: current,
    };
  }

  // Si está done, avanza a la siguiente
  const next = nextPhase(changeName);
  if (!next) {
    return { ok: false, reason: `Change '${changeName}' is complete (archived or no next phase).` };
  }

  const result = run(changeName, next, userIntent);
  if (!result.ok) return result;
  return { ok: true, prompt: result.prompt, phase: next };
}

/**
 * Marca la fase actual como fallida.
 */
export function fail(changeName: string, reason: string): void {
  failPhase(changeName, reason);
}

/**
 * Retorna el estado actual de un cambio como string legible.
 */
export function status(changeName: string): string {
  return statusReport(changeName);
}

/**
 * Lista todos los cambios activos con su fase actual.
 * Útil para que el modelo dé un overview al usuario.
 */
export function listAll(): string {
  const changes = listChanges();
  if (changes.length === 0) return "No active SDD changes found in openspec/changes/.";

  const lines = ["## Active SDD Changes", ""];
  for (const name of changes) {
    const state = loadState(name);
    const phase = state.currentPhase;
    const phaseStatus = state.phases[phase];
    const icon = phaseStatus === "failed" ? "❌" : phaseStatus === "in_progress" ? "🔄" : "✅";
    lines.push(`- **${name}** → ${icon} ${phase} (${phaseStatus})`);
  }
  return lines.join("\n");
}

/**
 * Genera un prompt de /plan para un nuevo cambio desde cero.
 * Equivale a /spec + /plan de spec-kit pero sin ambigüedad.
 */
export function plan(changeName: string, userIntent: string): string {
  return run(changeName, "init", userIntent).ok
    ? buildSubAgentPrompt(changeName, "init", userIntent)
    : `Cannot plan '${changeName}': already initialized. Use resume() instead.`;
}
