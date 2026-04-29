# Documentation Governance and Consolidation Proposal

Date: 2026-04-29
Status: Proposed, not implemented yet
Agent: Codex
Model: GPT-5-based Codex runtime (exact model variant not exposed in-session)

## Goal
Reduce duplicated sources of truth, make audits easier, preserve SDD traceability, and make it obvious which document is canonical for each kind of question.

## Executive diagnosis
- The project already has strong documentation coverage, but the system is starting to fragment.
- Core operating rules are split across multiple files with overlapping scope.
- Live product state is duplicated across summary docs, handoff docs, and export docs.
- Release readiness is tracked well, but some gates are repeated in more than one place.
- The SDD layer in `openspec/` is the cleanest part of the system and should remain the formal change record.
- Some files reference different skill-registry locations, and some files show encoding drift. Both increase maintenance cost.

## Non-negotiable quality principle to preserve
The user priority is clear and should survive any documentation cleanup:
- no hallucinated statements about code or system behavior
- no broad incidental edits while solving a narrow issue
- every implementation should be precise, scoped, and atomic

The future governance pass should keep this as a top-level project rule, not as a tool-specific preference.

## Main problems to fix later
1. Too many "source of truth" candidates for process and project state.
2. Agent-specific instructions and project-wide rules are mixed together.
3. Historical log, current snapshot, roadmap, and export packs are partially overlapping.
4. `STATE.md` mixes useful live coordination with long-lived history that belongs elsewhere.
5. `MASTER_DOCUMENT.md`, `NOTEBOOKLM.md`, and `NOTEBOOKLM_SOURCE.md` overlap with canonical docs and look more like derivative packs than primary sources.
6. Registry references are inconsistent:
   - some docs point to `.atl/skill-registry.md`
   - current installed skills are also represented in `.agents/skills/skill-registry.md`
7. Several docs show mojibake, so encoding normalization should be part of the cleanup.

## Target model

### Canonical rule
Each category should have one canonical file, plus support files with narrower responsibilities.

### Proposed canon by category
- Reglas operativas: `docs/ENGINEERING_CONTEXT.md`
- Trazabilidad y documentacion viva: `docs/DEVLOG.md`, `docs/ROADMAP.md`, `docs/PROJECT_OVERVIEW.md`, `docs/DOCUMENTATION_TRACKER.md`
- Calidad, release y seguridad: `docs/SDLC_QUALITY_STANDARD.md`, `docs/SECURITY_REVIEW.md`, `docs/PRE_PROD_CHECKLIST.md`, `docs/MVP_STATUS.md`, `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- Specs / SDD: `openspec/changes/admin-content-management/*`
- Operacion / soporte: `docs/ADMIN_MANUAL.md`, `docs/POST_MVP_BACKLOG.md`

## Inventory by category

### Reglas operativas

#### `agitprop/CLAUDE.md`
Title: `Agitprop - Claude Code Project Rules`

Serves to:
- adapt project rules to one specific agent harness
- remind workflow, response style, architecture, and security constraints

Current contents summary:
- SDD workflow reminders
- mandatory doc sync reminders
- response-style rules for Claude Code
- key architecture rules
- security reminders

Proposed future role:
- Keep, but narrow it to an agent adapter only.
- It should point to canonical project rules instead of duplicating them.

#### `agitprop/docs/ENGINEERING_CONTEXT.md`
Title: `Engineering Context Protocol`

Serves to:
- define project-wide execution protocol
- preserve architecture invariants
- define update points after features and fixes
- describe skill usage and deterministic replacements

Current contents summary:
- multi-agent coordination reference to `STATE.md`
- mandatory update points
- architecture invariants
- project skill baseline
- deterministic replacements for removed skills
- release discipline

Proposed future role:
- Make this the canonical operational rules document.
- Anything project-wide should live here first.

#### `agitprop/docs/STATE.md`
Title: `State Snapshot - Agitprop Studio`

Serves to:
- coordinate concurrent work
- provide current branch, production, env, and operational snapshot
- act as a live board for active work

Current contents summary:
- coordination rules
- domain split between agents
- current in-progress work
- production snapshot
- key files
- long bitacora/history

Proposed future role:
- Keep, but narrow to:
  - live coordination
  - current production snapshot
  - quick "start here"
- Move historical narrative fully to `DEVLOG.md`.

#### `agitprop/docs/SDLC_QUALITY_STANDARD.md`
Title: `SDLC Quality Standard`

Serves to:
- define lifecycle quality gates
- define planning, implementation, testing, security, and PR expectations

Current contents summary:
- SDD planning rules
- implementation rules
- testing gate
- security gate
- PR gate
- release checklist

Proposed future role:
- Keep as canonical quality/process standard.
- Avoid repeating the same process rules elsewhere unless linking back here.

#### `agitprop/docs/PR_PROCESS.md`
Title: `PR Process (Security-Gated)`

Serves to:
- define PR and merge gate rules

Current contents summary:
- every relevant push opens PR
- manual security review is mandatory
- merge is manual after verification

Proposed future role:
- Either merge into `SDLC_QUALITY_STANDARD.md`
- or keep as a short alias document that only points to SDLC + security checklist

### Trazabilidad y documentacion viva

#### `agitprop/docs/DEVLOG.md`
Title: `Devlog`

Serves to:
- preserve chronological implementation history
- record changes across sessions
- preserve authorship trace for agent/model usage

Current contents summary:
- dated entries of important product and workflow changes
- recent additions now include agent/model trace

Proposed future role:
- Keep as canonical chronological trace.
- Every significant change should land here.

#### `agitprop/docs/ROADMAP.md`
Title: `Project Roadmap: Agitprop (Akemi Pilot)`

Serves to:
- define future direction, phase progression, and sequencing

Current contents summary:
- executive summary
- project phases
- planned path from MVP hardening into SaaS evolution

Proposed future role:
- Keep as canonical forward-looking plan.
- Do not mix it with operational checklist detail.

#### `agitprop/docs/PROJECT_OVERVIEW.md`
Title: `Project Overview - Agitprop`

Serves to:
- explain what the product is right now
- describe product goals, scope, architecture, and current model

Current contents summary:
- product definition
- core goals
- MVP scope
- major technical and product surfaces

Proposed future role:
- Keep as canonical "what the product is" reference.
- This should answer onboarding questions faster than `MASTER_DOCUMENT.md`.

#### `agitprop/docs/DOCUMENTATION_TRACKER.md`
Title: `Documentation by Process`

Serves to:
- index major documentation by area
- show what exists and where to look first

Current contents summary:
- doc status by area
- lightweight changelog of documentation evolution

Proposed future role:
- Keep as canonical doc map and audit index.
- It should point to every current primary document and mark deprecated ones.

#### `agitprop/docs/MASTER_DOCUMENT.md`
Title: `Master Document - Agitprop (Akemi Pilot)`

Serves to:
- provide a broad project summary in one file

Current contents summary:
- product summary
- MVP definition
- architecture and documentation references

Proposed future role:
- Degrade from source of truth to derived summary or export bundle.
- Too much of this overlaps with `PROJECT_OVERVIEW.md`, `ROADMAP.md`, and release docs.

#### `agitprop/docs/NOTEBOOKLM.md`
Title: `NotebookLM Source Pack - Agitprop`

Serves to:
- package project context for external ingestion/export

Current contents summary:
- snapshot
- product description
- MVP scope
- stack/context summary

Proposed future role:
- Treat as generated or derived export material, not primary truth.

#### `agitprop/docs/NOTEBOOKLM_SOURCE.md`
Title: `NotebookLM Source - Agitprop`

Serves to:
- provide a condensed source-oriented context pack

Current contents summary:
- snapshot
- roadmap summary
- current capabilities

Proposed future role:
- Treat as generated or derived export material, not primary truth.

### Calidad, release y seguridad

#### `agitprop/docs/SECURITY_REVIEW.md`
Title: `Security Review Checklist`

Serves to:
- define the manual security checklist
- provide release-time security verification

Current contents summary:
- OWASP-style checklist
- Supabase RLS review
- secrets review

Proposed future role:
- Keep as canonical security checklist.

#### `agitprop/docs/PRE_PROD_CHECKLIST.md`
Title: `Pre-Prod Checklist`

Serves to:
- provide the operational checklist before release signoff

Current contents summary:
- local quality gates
- Vercel checks
- Supabase checks
- environment verification

Proposed future role:
- Keep as canonical pre-release operations checklist.

#### `agitprop/docs/MVP_STATUS.md`
Title: `MVP Status - Agitprop`

Serves to:
- define the MVP completion gate
- show whether MVP is actually complete

Current contents summary:
- MVP definition
- already-done items
- still-pending items

Proposed future role:
- Keep while MVP remains the active milestone.
- After MVP closure, either archive or rename for the next milestone gate.

#### `agitprop/docs/PENDING_EXTERNAL_INTERVENTIONS.md`
Title: `Pending External Interventions`

Serves to:
- separate external blockers from internal implementation work

Current contents summary:
- Vercel actions
- Supabase actions
- OAuth provider actions
- external credentials and production-access tasks

Proposed future role:
- Keep as canonical blocker list for user/external actions.

#### `agitprop/docs/PR_PROCESS.md`
Title: `PR Process (Security-Gated)`

Serves to:
- define merge gate expectations

Current contents summary:
- PR requirement
- security review requirement
- manual merge gate

Proposed future role:
- Likely merge into SDLC or reduce to a short pointer file.

### Specs / SDD

#### `agitprop/openspec/changes/admin-content-management/proposal.md`
Title: `Proposal: Admin Content Management`

Serves to:
- define intent, scope, out of scope, and affected areas for the change set

Current contents summary:
- change intent
- scoped domains
- boundaries

Proposed future role:
- Keep as formal origin of the change set.

#### `agitprop/openspec/changes/admin-content-management/design.md`
Title: `Design: Admin Content Management`

Serves to:
- explain technical decisions and architecture choices for the change set

Current contents summary:
- technical approach
- architecture decisions
- rationale and alternatives
- later extensions

Proposed future role:
- Keep as the design record for this change set.

#### `agitprop/openspec/changes/admin-content-management/tasks.md`
Title: `Tasks: Admin Content Management`

Serves to:
- track implementation tasks and completion status

Current contents summary:
- phased checklist
- cross-links to docs and implementation concerns

Proposed future role:
- Keep as the execution ledger for the change set.

#### `agitprop/openspec/changes/admin-content-management/specs/admin-console/spec.md`
Title: `Admin Console Specification`

Serves to:
- define requirements for role-scoped private consoles

Current contents summary:
- entry points
- role separation
- cross-role access rules

Proposed future role:
- Keep as formal requirement spec for admin/studio console behavior.

#### `agitprop/openspec/changes/admin-content-management/specs/auth/spec.md`
Title: `Auth Specification`

Serves to:
- define secure authentication and role enforcement requirements

Current contents summary:
- login requirements
- role restriction requirements
- auth scenarios

Proposed future role:
- Keep as formal auth requirement spec.

#### `agitprop/openspec/changes/admin-content-management/specs/extensibility/spec.md`
Title: `Extensibility Specification`

Serves to:
- define how new content types should be added safely

Current contents summary:
- extensibility rules
- compatibility expectations
- access-control continuity

Proposed future role:
- Keep as formal extensibility spec.

#### `agitprop/openspec/changes/admin-content-management/specs/gallery-management/spec.md`
Title: `Gallery Management Specification`

Serves to:
- define gallery CRUD behavior and validation expectations

Current contents summary:
- create/update requirements
- metadata requirements
- collection assignment behavior

Proposed future role:
- Keep as formal gallery-management spec.

#### `agitprop/openspec/changes/admin-content-management/specs/posts-management/spec.md`
Title: `Posts Management Specification`

Serves to:
- define post CRUD behavior and validation expectations

Current contents summary:
- create/update requirements
- validation expectations
- public visibility expectations

Proposed future role:
- Keep as formal posts-management spec.

#### `agitprop/openspec/changes/admin-content-management/specs/public-site/spec.md`
Title: `Public Site Specification`

Serves to:
- define public-facing behavior for posts and galleries

Current contents summary:
- public feed expectations
- gallery listing expectations
- empty-state behavior

Proposed future role:
- Keep as formal public-site behavior spec.

### Operacion / soporte

#### `agitprop/docs/ADMIN_MANUAL.md`
Title: `Manual de Administrador`

Serves to:
- guide operators through admin usage
- explain recommended flow and expected UI behavior

Current contents summary:
- access notes
- recommended panel order
- admin UI conventions
- smoke-test oriented usage guidance

Proposed future role:
- Keep as operator-facing guide.

#### `agitprop/docs/POST_MVP_BACKLOG.md`
Title: `Post-MVP Backlog`

Serves to:
- capture future work after MVP closure

Current contents summary:
- ordered backlog by difficulty
- product and platform evolution ideas
- deferred work not meant for MVP

Proposed future role:
- Keep as post-MVP planning backlog.

## Recommended consolidation decisions

### Keep and strengthen
- `docs/ENGINEERING_CONTEXT.md`
- `docs/SDLC_QUALITY_STANDARD.md`
- `docs/DEVLOG.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/DOCUMENTATION_TRACKER.md`
- `docs/SECURITY_REVIEW.md`
- `docs/PRE_PROD_CHECKLIST.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `openspec/changes/admin-content-management/*`
- `docs/ADMIN_MANUAL.md`
- `docs/POST_MVP_BACKLOG.md`

### Keep, but narrow
- `docs/STATE.md`
- `CLAUDE.md`
- `docs/PR_PROCESS.md`
- `docs/MVP_STATUS.md`

### Degrade to derived or export-only docs
- `docs/MASTER_DOCUMENT.md`
- `docs/NOTEBOOKLM.md`
- `docs/NOTEBOOKLM_SOURCE.md`

## Concrete proposal for later implementation

### Phase 1 - Canonical map
1. Declare canonical ownership in `DOCUMENTATION_TRACKER.md`.
2. Add a short "source of truth" line at the top of every primary doc.
3. Standardize one skill-registry path reference across the project.

### Phase 2 - Reduce duplication
1. Trim `CLAUDE.md` so it only adapts project rules for Claude.
2. Trim `STATE.md` so it only carries live coordination and current ops snapshot.
3. Merge `PR_PROCESS.md` into `SDLC_QUALITY_STANDARD.md`, or reduce it to a pointer-only file.
4. Move anything historical from `STATE.md` into `DEVLOG.md`.

### Phase 3 - Reclassify derived docs
1. Mark `MASTER_DOCUMENT.md` as derived summary or archive candidate.
2. Mark `NOTEBOOKLM.md` and `NOTEBOOKLM_SOURCE.md` as generated/export packs.
3. Ensure they are refreshed from canonical docs instead of edited first.

### Phase 4 - Hygiene and consistency
1. Normalize all documentation files to UTF-8.
2. Fix mojibake in existing docs.
3. Standardize section naming in Spanish or English, but not both mixed arbitrarily.
4. Add a lightweight metadata block:
   - owner
   - status
   - canonical or derived
   - last updated

### Phase 5 - Optional automation
1. Add a release or PR template reminder for devlog + agent/model trace.
2. Add a docs-lint script that checks required files are updated for major changes.
3. Generate export packs (`NOTEBOOKLM*`) from canonical docs where possible.

## Implementation plan by priority

This section translates the proposal into an execution plan designed for low-risk, atomic implementation.

### Priority High
Goal:
- make the documentation system safe to operate without changing too much at once
- establish one canonical source per concern
- reduce the risk of future contradictory updates

#### H1. Canonical ownership labels
Files:
- `docs/ENGINEERING_CONTEXT.md`
- `docs/SDLC_QUALITY_STANDARD.md`
- `docs/DEVLOG.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/DOCUMENTATION_TRACKER.md`
- `docs/SECURITY_REVIEW.md`
- `docs/PRE_PROD_CHECKLIST.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/ADMIN_MANUAL.md`
- `docs/POST_MVP_BACKLOG.md`

Atomic action:
- add a tiny metadata header or one-line ownership note to each file:
  - canonical or derived
  - owner
  - purpose
  - last updated

Why first:
- this creates a visible source-of-truth map without changing document structure yet

Done when:
- every primary doc declares whether it is canonical or derived

#### H2. Standardize the skill-registry reference
Files:
- `docs/ENGINEERING_CONTEXT.md`
- `docs/SDLC_QUALITY_STANDARD.md`
- `CLAUDE.md`
- any other docs that still point to `.atl/skill-registry.md`

Atomic action:
- choose one authoritative path for skill discovery and replace inconsistent references

Why first:
- this removes a concrete source of confusion during execution

Done when:
- all process docs reference the same skill-registry location

#### H3. Narrow `CLAUDE.md` into an adapter
Files:
- `CLAUDE.md`

Atomic action:
- keep only agent-specific guidance
- replace duplicated project rules with links to:
  - `docs/ENGINEERING_CONTEXT.md`
  - `docs/SDLC_QUALITY_STANDARD.md`

Why first:
- agent adapter files should not become competing project constitutions

Done when:
- `CLAUDE.md` no longer duplicates global workflow rules except for short reminders

#### H4. Narrow `STATE.md` to live state only
Files:
- `docs/STATE.md`
- `docs/DEVLOG.md`

Atomic action:
- remove or relocate long-lived historical narrative from `STATE.md`
- keep only:
  - coordination
  - current production snapshot
  - current pending work
  - quick start
- move any historical content worth preserving into `DEVLOG.md`

Why first:
- `STATE.md` is most useful when it behaves like a live board, not a mixed archive

Done when:
- `STATE.md` is short, operational, and current

### Priority Medium
Goal:
- reduce duplicated summaries
- make onboarding and audits faster

#### M1. Reclassify summary/export docs
Files:
- `docs/MASTER_DOCUMENT.md`
- `docs/NOTEBOOKLM.md`
- `docs/NOTEBOOKLM_SOURCE.md`

Atomic action:
- label them explicitly as derived or export-oriented
- add a line pointing back to canonical docs

Why medium:
- helpful, but not as risky as rule duplication in live process docs

Done when:
- no one could mistake these for primary sources of truth

#### M2. Simplify PR rule duplication
Files:
- `docs/PR_PROCESS.md`
- `docs/SDLC_QUALITY_STANDARD.md`

Atomic action:
- either merge PR rules into SDLC and reduce `PR_PROCESS.md` to a pointer
- or keep `PR_PROCESS.md` extremely short with no duplicate explanations

Why medium:
- this is a cleanup of duplication, not a blocker

Done when:
- there is one clear place to read merge-gate rules in full

#### M3. Strengthen `DOCUMENTATION_TRACKER.md` as the audit index
Files:
- `docs/DOCUMENTATION_TRACKER.md`

Atomic action:
- add a simple table or status block per document:
  - category
  - canonical or derived
  - purpose
  - audit status

Why medium:
- this becomes the fastest audit dashboard in the repository

Done when:
- a new contributor can find the right document in under a minute

### Priority Low
Goal:
- improve long-term maintainability and polish

#### L1. Encoding normalization
Files:
- all docs showing mojibake

Atomic action:
- normalize to UTF-8
- fix broken characters without rewriting content meaning

Why low:
- very worthwhile, but not as urgent as eliminating governance ambiguity

Done when:
- major docs render cleanly without encoding artifacts

#### L2. Language consistency pass
Files:
- process docs and major summaries

Atomic action:
- choose a consistent language policy:
  - Spanish for internal ops
  - English for product/specs
  - or another explicit split

Why low:
- improves readability, but should follow ownership cleanup first

Done when:
- language switching across docs feels deliberate, not accidental

#### L3. Lightweight automation
Files:
- future script or template files

Atomic action:
- add checks or templates for:
  - devlog update
  - agent/model trace
  - release checklist reminders

Why low:
- automation is safest after the human process is already clarified

Done when:
- the process can be followed with less manual memory

## Recommended rollout order
1. H1 Canonical ownership labels
2. H2 Skill-registry path standardization
3. H3 Narrow `CLAUDE.md`
4. H4 Narrow `STATE.md`
5. M2 Simplify PR rule duplication
6. M1 Reclassify summary/export docs
7. M3 Strengthen `DOCUMENTATION_TRACKER.md`
8. L1 Encoding normalization
9. L2 Language consistency pass
10. L3 Lightweight automation

## Suggested execution boundaries
- Do not implement more than one high-priority item in the same narrow fix unless the files are inseparable.
- Avoid mixing content cleanup with process redesign in the same change.
- Prefer one PR or one work block per numbered item above.
- After each item, update `DEVLOG.md` and `DOCUMENTATION_TRACKER.md`.

## Suggested definition of done for the future cleanup project
- Every documentation category has one obvious canonical source.
- Agent adapters no longer compete with project-wide rules.
- Live operational state is separated from historical narrative.
- Derived/export docs are clearly labeled.
- The audit index is fast to scan.
- The non-negotiable rule remains intact:
  - no hallucinated claims
  - no unnecessary file edits
  - precise, atomic changes only

## Recommended final information architecture

### Reglas operativas
- Canonical: `docs/ENGINEERING_CONTEXT.md`
- Support:
  - `docs/STATE.md`
  - `docs/SDLC_QUALITY_STANDARD.md`
  - `CLAUDE.md`

### Trazabilidad y documentacion viva
- Canonical:
  - `docs/DEVLOG.md`
  - `docs/ROADMAP.md`
  - `docs/PROJECT_OVERVIEW.md`
  - `docs/DOCUMENTATION_TRACKER.md`
- Derived:
  - `docs/MASTER_DOCUMENT.md`
  - `docs/NOTEBOOKLM.md`
  - `docs/NOTEBOOKLM_SOURCE.md`

### Calidad, release y seguridad
- Canonical:
  - `docs/SDLC_QUALITY_STANDARD.md`
  - `docs/SECURITY_REVIEW.md`
  - `docs/PRE_PROD_CHECKLIST.md`
  - `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- Milestone-specific:
  - `docs/MVP_STATUS.md`
- Optional short alias:
  - `docs/PR_PROCESS.md`

### Specs / SDD
- Canonical:
  - `openspec/changes/admin-content-management/proposal.md`
  - `openspec/changes/admin-content-management/design.md`
  - `openspec/changes/admin-content-management/tasks.md`
  - `openspec/changes/admin-content-management/specs/*/spec.md`

### Operacion / soporte
- Canonical:
  - `docs/ADMIN_MANUAL.md`
  - `docs/POST_MVP_BACKLOG.md`

## Decision summary
The documentation system does not need to be rewritten from scratch. It needs a governance pass:
- fewer duplicated summaries
- one canonical doc per concern
- agent-specific files reduced to adapters
- `openspec/` preserved as the formal change system
- export packs treated as derived artifacts

This proposal is intentionally written as the implementation brief for a future cleanup pass when more tokens or time are available.
