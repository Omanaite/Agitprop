/**
 * SDD Orchestrator — Agitprop
 *
 * State machine determinista que reemplaza la skill `agent-teams-lite`.
 * El modelo NO interpreta el flujo — llama funciones que devuelven:
 *   - el estado actual de un cambio
 *   - la transición válida siguiente
 *   - el prompt exacto para el sub-agente correcto
 *
 * Modo de persistencia: `openspec` (archivos en agitprop/openspec/changes/)
 * Estructura por cambio:
 *   openspec/changes/{change}/
 *     state.json      ← estado de la máquina (este módulo lo gestiona)
 *     proposal.md     ← salida de sdd-propose
 *     design.md       ← salida de sdd-design
 *     tasks.md        ← salida de sdd-tasks
 *     specs/          ← specs adicionales
 *
 * Reemplaza: .agents/skills/agent-teams-lite-main/
 * Documentado en: docs/ENGINEERING_CONTEXT.md
 */

import path from "path";
import fs from "fs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type SDDPhase =
  | "idle"
  | "init"
  | "explore"
  | "propose"
  | "design"
  | "tasks"
  | "apply"
  | "verify"
  | "archive";

export type PhaseStatus = "pending" | "in_progress" | "done" | "failed";

export type ChangeState = {
  changeName: string;
  currentPhase: SDDPhase;
  phases: Record<SDDPhase, PhaseStatus>;
  artifacts: Partial<Record<SDDPhase, string>>; // ruta relativa al archivo generado
  startedAt: string;
  updatedAt: string;
  error?: string;
};

// ─── DAG de fases ─────────────────────────────────────────────────────────────

/**
 * Dependencias de cada fase — qué debe estar `done` antes de empezar.
 * Si el array está vacío, la fase puede iniciarse en cualquier momento.
 */
const PHASE_DEPS: Record<SDDPhase, SDDPhase[]> = {
  idle:    [],
  init:    [],
  explore: ["init"],
  propose: ["init"],
  design:  ["propose"],
  tasks:   ["design"],
  apply:   ["tasks"],
  verify:  ["apply"],
  archive: ["verify"],
};

/** Orden lineal de progresión normal */
const PHASE_ORDER: SDDPhase[] = [
  "init", "explore", "propose", "design", "tasks", "apply", "verify", "archive",
];

// ─── Paths ────────────────────────────────────────────────────────────────────

const OPENSPEC_ROOT = path.resolve(process.cwd(), "openspec", "changes");

function changeDir(changeName: string): string {
  return path.join(OPENSPEC_ROOT, changeName);
}

function stateFile(changeName: string): string {
  return path.join(changeDir(changeName), "state.json");
}

function artifactPath(changeName: string, phase: SDDPhase): string {
  const map: Partial<Record<SDDPhase, string>> = {
    propose: "proposal.md",
    design:  "design.md",
    tasks:   "tasks.md",
  };
  const file = map[phase];
  return file ? path.join(changeDir(changeName), file) : "";
}

// ─── Estado ───────────────────────────────────────────────────────────────────

function blankState(changeName: string): ChangeState {
  const now = new Date().toISOString();
  return {
    changeName,
    currentPhase: "idle",
    phases: {
      idle:    "done",
      init:    "pending",
      explore: "pending",
      propose: "pending",
      design:  "pending",
      tasks:   "pending",
      apply:   "pending",
      verify:  "pending",
      archive: "pending",
    },
    artifacts: {},
    startedAt: now,
    updatedAt: now,
  };
}

export function loadState(changeName: string): ChangeState {
  const file = stateFile(changeName);
  if (!fs.existsSync(file)) return blankState(changeName);
  return JSON.parse(fs.readFileSync(file, "utf8")) as ChangeState;
}

export function saveState(state: ChangeState): void {
  const dir = changeDir(state.changeName);
  fs.mkdirSync(dir, { recursive: true });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(stateFile(state.changeName), JSON.stringify(state, null, 2));
}

// ─── Transiciones ─────────────────────────────────────────────────────────────

export type TransitionResult =
  | { ok: true;  state: ChangeState }
  | { ok: false; reason: string };

/**
 * Avanza la fase si todas las dependencias están `done`.
 * Marca la fase anterior como `done` y la nueva como `in_progress`.
 */
export function transition(
  changeName: string,
  toPhase: SDDPhase
): TransitionResult {
  const state = loadState(changeName);

  const deps = PHASE_DEPS[toPhase];
  const missing = deps.filter((d) => state.phases[d] !== "done");
  if (missing.length > 0) {
    return {
      ok: false,
      reason: `Cannot enter '${toPhase}': phases not done → [${missing.join(", ")}]`,
    };
  }

  // Marca la fase anterior como done si estaba in_progress
  if (
    state.currentPhase !== "idle" &&
    state.phases[state.currentPhase] === "in_progress"
  ) {
    state.phases[state.currentPhase] = "done";
  }

  state.currentPhase = toPhase;
  state.phases[toPhase] = "in_progress";
  saveState(state);
  return { ok: true, state };
}

/** Marca la fase actual como done y registra el artefacto generado */
export function completePhase(
  changeName: string,
  artifactRelPath?: string
): TransitionResult {
  const state = loadState(changeName);
  if (state.currentPhase === "idle") {
    return { ok: false, reason: "No active phase to complete." };
  }
  state.phases[state.currentPhase] = "done";
  if (artifactRelPath) {
    state.artifacts[state.currentPhase] = artifactRelPath;
  }
  saveState(state);
  return { ok: true, state };
}

/** Marca la fase actual como fallida con mensaje de error */
export function failPhase(changeName: string, reason: string): void {
  const state = loadState(changeName);
  state.phases[state.currentPhase] = "failed";
  state.error = reason;
  saveState(state);
}

// ─── Consultas ────────────────────────────────────────────────────────────────

/** Siguiente fase válida en el flujo lineal */
export function nextPhase(changeName: string): SDDPhase | null {
  const state = loadState(changeName);
  const currentIdx = PHASE_ORDER.indexOf(state.currentPhase);
  if (currentIdx === -1 || currentIdx === PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[currentIdx + 1];
}

/** Resumen de estado para mostrar al usuario o al modelo */
export function statusReport(changeName: string): string {
  const state = loadState(changeName);
  const lines = [
    `## SDD Status: ${changeName}`,
    `Phase: **${state.currentPhase}** | Updated: ${state.updatedAt}`,
    "",
    "| Phase | Status | Artifact |",
    "|-------|--------|----------|",
  ];
  for (const phase of PHASE_ORDER) {
    const status = state.phases[phase];
    const artifact = state.artifacts[phase] ?? "—";
    const icon = status === "done" ? "✅" : status === "in_progress" ? "🔄" : status === "failed" ? "❌" : "⬜";
    lines.push(`| ${phase} | ${icon} ${status} | ${artifact} |`);
  }
  if (state.error) lines.push(`\n> ❌ Error: ${state.error}`);
  return lines.join("\n");
}

/** Lista todos los cambios activos en openspec/changes/ */
export function listChanges(): string[] {
  if (!fs.existsSync(OPENSPEC_ROOT)) return [];
  return fs
    .readdirSync(OPENSPEC_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// ─── Generador de prompts para sub-agentes ────────────────────────────────────

/**
 * Genera el prompt completo que el orquestador debe pasar al sub-agente
 * de la fase indicada. Incluye contexto de artefactos previos y
 * instrucciones de persistencia.
 *
 * El modelo llama esta función y usa el string retornado como prompt —
 * no improvisa instrucciones para el sub-agente.
 */
export function buildSubAgentPrompt(
  changeName: string,
  phase: SDDPhase,
  userIntent: string
): string {
  const state = loadState(changeName);
  const dir = changeDir(changeName);

  const artifactRefs: string[] = [];
  for (const dep of PHASE_DEPS[phase]) {
    const p = artifactPath(changeName, dep);
    if (p && fs.existsSync(p)) {
      artifactRefs.push(`- Read before starting: \`${path.relative(process.cwd(), p)}\``);
    }
  }

  const outputPath = artifactPath(changeName, phase);
  const persistInstruction = outputPath
    ? `PERSIST (MANDATORY): Write your output to \`${path.relative(process.cwd(), outputPath)}\``
    : `PERSIST: Save your findings inline — this phase has no artifact file.`;

  return [
    `## SDD Sub-Agent: ${phase.toUpperCase()} — ${changeName}`,
    "",
    `**User intent:** ${userIntent}`,
    "",
    `**Change folder:** \`openspec/changes/${changeName}/\``,
    "",
    artifactRefs.length > 0
      ? `**Required reading (artifacts from previous phases):**\n${artifactRefs.join("\n")}`
      : "**No prior artifacts required for this phase.**",
    "",
    "**Skill loading (FIRST step):**",
    "Read `.atl/skill-registry.md` and load skills relevant to your task.",
    "Engineering context: `docs/ENGINEERING_CONTEXT.md`",
    "Project state: `docs/STATE.md`",
    "",
    persistInstruction,
    "",
    `**Phase contract:** Follow the SDD ${phase} contract strictly.`,
    `Do not start the next phase (${nextPhase(changeName) ?? "none"}) — stop after completing this one.`,
    "",
    `**Current pipeline state:**`,
    `\`\`\``,
    statusReport(changeName),
    `\`\`\``,
  ].join("\n");
}
