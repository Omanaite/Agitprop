# Documentation by Process

Document role: Canonical
Owner: Documentation governance
Scope: Documentation index, audit map, and category-level tracking
Last updated: 2026-04-29

## Goal
Ensure each roadmap phase has associated documentation and that handoff context survives beyond the current chat/session.

## Status by Area

### Phase 0 - Discovery and scope
- Documents: `docs/ROADMAP.md`, `docs/PROJECT_OVERVIEW.md`
- Status: Complete

### Phase 1 - Formal specs (SDD)
- Documents: `openspec/changes/admin-content-management/specs/*/spec.md`
- Status: Complete and maintained

### Technical design (SDD)
- Document: `openspec/changes/admin-content-management/design.md`
- Status: Complete and updated with SEO/security + post-MVP context

### Tasks (SDD)
- Document: `openspec/changes/admin-content-management/tasks.md`
- Status: Complete and maintained

### Admin operations
- Document: `docs/ADMIN_MANUAL.md`
- Status: Updated with current admin UX and smoke-test guidance

### Pre-production readiness
- Documents: `docs/PRE_PROD_CHECKLIST.md`, `docs/MVP_STATUS.md`, `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- Status: Active / current source of truth for MVP closure

### Product master summary
- Documents: `docs/MASTER_DOCUMENT.md`, `docs/NOTEBOOKLM.md`, `docs/NOTEBOOKLM_SOURCE.md`
- Status: Refreshed for cross-session continuity and PDF/export use

### Documentation governance / consolidation
- Document: `docs/DOCUMENTATION_GOVERNANCE_PROPOSAL.md`
- Status: Proposed audit and consolidation plan, pending implementation

### Progress log / Vitacora
- Document: `docs/DEVLOG.md`
- Status: Active

### Scalability and post-MVP planning
- Documents: `docs/POST_MVP_BACKLOG.md`, `docs/ROADMAP.md`, `docs/PROJECT_OVERVIEW.md`
- Status: Tracked, intentionally not implemented before MVP signoff

### Security
- Documents: `docs/SECURITY_REVIEW.md`, `docs/SDLC_QUALITY_STANDARD.md`, `docs/PR_PROCESS.md`
- Status: Active standards

## Changelog
- 2026-03-12: Baseline roadmap and scope documentation created.
- 2026-03-13: Admin and data-model implementation docs expanded.
- 2026-03-15: Admin navigation and auth fixes documented.
- 2026-03-19: Admin design system and loading states documented.
- 2026-03-20: Homepage composition and locale controls documented.
- 2026-03-24: SEO/security audit actions documented.
- 2026-03-24: MVP status, external-intervention tracking, and post-MVP backlog formalized.
- 2026-03-31: Added persistent devlog for cross-session continuity and release traceability.
- 2026-04-01: Documented studio API split (`/api/studio/profile`, `/api/studio/payment-settings`, `/api/studio/integrations`) and role-boundary hardening.
- 2026-04-01: Updated roadmap, overview, state, and specs task tracking for Platform Admin vs Artist Workspace execution model.
- 2026-04-29: Added documentation governance and consolidation proposal, plus category-level audit map for workflow, release, specs, and support docs.
- 2026-04-29: Added document-role headers to major docs so canonical, support, milestone-specific, derived, and agent-adapter files are visible at a glance.
