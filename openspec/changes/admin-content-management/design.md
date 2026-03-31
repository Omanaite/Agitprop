# Design: Admin Content Management

## Technical Approach
Add an admin-only content management layer using Supabase Auth for authentication, Next.js App Router for protected admin routes, and Supabase RLS for data access control. Extend the data model with admin-managed tables (posts, galleries, tattoos) and wire CRUD via server routes using the existing Supabase server client pattern. Public reads remain via the public client to avoid regressions.

## Architecture Decisions

### Decision: Supabase Auth for admin authentication
**Choice**: Use Supabase Auth as the single source of truth for admin identity.
**Alternatives considered**: Custom JWT auth, third-party auth provider.
**Rationale**: The project already uses Supabase; aligning auth with Supabase reduces operational complexity and integrates with RLS.

### Decision: Admin-only CRUD via server routes
**Choice**: Implement admin CRUD through Next.js route handlers (server) using auth-bound session.
**Alternatives considered**: Direct client-side mutations with anon key.
**Rationale**: Server routes keep privileged access on the server and enforce access rules.

### Decision: Add Posts table as separate content type
**Choice**: Introduce a `posts` table for admin-managed updates.
**Alternatives considered**: Reuse `tattoos` table with a `type` discriminator.
**Rationale**: Clear separation of concerns and schema clarity for future extensibility.

### Decision: OAuth extension (planned)
**Choice**: Support OAuth providers (Google, GitHub, Facebook, others as needed).
**Rationale**: Artists often already use these identities; reduces friction and supports future multi-admin.

Future UX refinement:
- OAuth entry points should include provider iconography that remains legible in
  light, eye-rest, and dark admin themes.
- Registration should support both confirmed email/password sign-up and OAuth
  sign-up without fragmenting the auth model.
- Admin edit actions should move viewport and focus directly to the edit form,
  especially on mobile where the editable form can sit far above the tapped item.
- Public gallery filtering should preserve clear select/option contrast in every
  theme mode, including dark theme native dropdown rendering.

### Decision: Admin profile + cloud storage connections (planned)
**Choice**: Add a profile view for the admin to manage payment data, addresses, email, nickname, and cloud storage connections. Editors should only enable cloud upload when connected.
**Rationale**: Keeps account management centralized and reduces broken upload flows.

### Decision: Separate visual language for admin experience
**Choice**: Give the admin console a distinct UI system from the public brutalist portfolio, using a friendlier operations-oriented layout with Headless UI navigation primitives and skeleton loading states.
**Alternatives considered**: Reuse the public brutalist styling across admin, or create a completely separate application.
**Rationale**: The public site optimizes for brand expression, while the admin optimizes for clarity, speed, and repeat operational tasks. A separate admin visual language reduces cognitive friction without requiring a second application.

### Decision: Neutral typography for admin operations
**Choice**: Use a neutral sans-serif font stack for the admin shell instead of the public mono/brutalist body font.
**Alternatives considered**: Reuse the public typography across the full product.
**Rationale**: Operational screens benefit from higher readability, denser forms, and more standard scanning behavior. Typography separation reinforces the different purpose of the admin workspace.

### Decision: Public section configuration managed by admin
**Choice**: Introduce a configurable page section model so the admin can reorder public sections, rename them, and hide/show them without code changes.
**Alternatives considered**: Hardcode section order and labels in the homepage, or expose only a subset of sections as configurable.
**Rationale**: The homepage is editorial by nature. Giving the admin control over order and naming allows the public site to adapt to campaigns, seasonal priorities, and portfolio direction without deployment.

### Decision: User-selectable site language
**Choice**: Add language selection for German, English, and Spanish, using the same preference-driven interaction style already used for themes.
**Alternatives considered**: Browser-only language detection or a single default locale.
**Rationale**: The artist audience and client audience span multiple languages. User-selectable locale control gives predictability and supports future SEO and localized content strategies.

### Decision: Cookie-backed public locale preference
**Choice**: Persist the public locale in a lightweight cookie and read it from server components before rendering public pages.
**Alternatives considered**: Client-only locale state, query-string locale switching.
**Rationale**: Cookie-backed locale preference keeps the selector simple while allowing server-rendered localized content and `html lang` alignment without introducing a full routing-based i18n framework yet.

### Decision: Audit-driven SEO and security hardening backlog
**Choice**: Treat external audit findings from `docs/reports/akemi-seo-security-audit-2026-03-24.pdf` as first-class roadmap items.
**Rationale**: This keeps observed live-site weaknesses traceable inside SDD instead of leaving them as a disconnected report artifact.

Current audit follow-up themes:
- canonical metadata for public routes
- stronger route-specific SEO descriptions
- final editorial copy replacement before indexation
- richer gallery detail SEO content
- payload trimming on public responses
- CSP tightening and narrower source policies
- reduced stack fingerprinting
- consistent abuse protection across public write endpoints
- future route-based multilingual SEO architecture
- production-grade locale cookie attributes

Applied baseline improvements:
- current public routes now emit canonical metadata
- locale preference is persisted server-side with production-aware cookie options
- homepage payload is reduced to the fields required for public filtering/rendering
- public write flows use rate limiting, same-origin checks, and honeypot fields
- `X-Powered-By` exposure is disabled through Next.js configuration

### Decision: MVP-first external integration gating
**Choice**: Keep provider-dependent features that require external credentials or business-rule confirmation documented, but blocked from implementation until MVP signoff unless they can degrade safely without affecting current production flows.
**Alternatives considered**: Start implementing all planned integrations before MVP acceptance.
**Rationale**: The project is close to MVP. Adding provider-heavy features (payments, calendar sync, WhatsApp delivery, chatbot escalation) before production verification would increase regression risk and blur release readiness.

### Decision: Introduce Agitprop service landing as a separate product surface
**Choice**: Add a dedicated route (`/agitprop`) to communicate the software offer and route visitors into signup/login without replacing the Akemi pilot homepage.
**Alternatives considered**: Rebrand the pilot homepage directly, or defer service marketing until post-MVP.
**Rationale**: The product now has two valid narratives: pilot artist site (Akemi) and SaaS platform (Agitprop). A dedicated service page enables go-to-market messaging immediately while preserving pilot brand continuity and lowering release risk.

### Decision: Split Platform Admin and Artist Workspace
**Choice**: Separate back-office capabilities into two explicit surfaces:
- **Platform Admin (SaaS operator)**: tenant governance, plans, feature flags, role management, site lifecycle.
- **Artist Workspace (tenant operator)**: galleries, pieces, posts, homepage composition, artist integrations, scheduling.
**Alternatives considered**: Single mixed admin panel for all roles.
**Rationale**: Mixing platform and artist operations is confusing and unsafe at scale. Separation reduces accidental cross-tenant edits and aligns permissions with business responsibilities.

## Data Flow

Platform Admin Login -> Supabase Auth -> Platform Admin Session
  |
  |-- Platform Console (protected route)
  |   |-- Tenant lifecycle (activate/deactivate/delete) -> API route -> Supabase
  |   |-- Plan & feature toggles per tenant -> API route -> Supabase
  |   |-- Role management (artist/staff) -> API route -> Supabase
  |
Artist Login -> Supabase Auth -> Artist Session
  |
  |-- Artist Workspace (protected route)
  |   |-- Create/Update/Delete gallery items -> API route -> Supabase
  |   |-- Create/Update/Delete posts -> API route -> Supabase
  |   |-- Manage artist profile -> API route -> Supabase
  |   |-- Connect artist integrations -> Supabase Auth + provider
  |
Public Pages -> Server components -> Supabase public client (read-only)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `openspec/changes/admin-content-management/design.md` | Update | Extend architecture and roadmap alignment |
| `supabase/schema.sql` | Modify | Add tables and policies |
| `app/api/admin/*` | Create | CRUD endpoints for admin |
| `app/admin/*` | Create | Admin UI routes (protected) |
| `components/*` | Modify | Reusable admin form components |
| `components/admin/*` | Modify | Dedicated admin shell, theme selector, and loading states |

## Interfaces / Contracts

```ts
// Example admin content contract
export type GalleryItemInput = {
  title: string;
  description?: string;
  style: string;
  image_url: string;
  gallery_id?: string;
};

export type PostInput = {
  title: string;
  body: string;
  status: "draft" | "published";
  excerpt?: string;
  cover_image_url?: string;
  publish_at?: string;
};

export type ValidationError = {
  path: string;
  message: string;
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Validation schemas | Zod schema tests |
| Integration | Admin CRUD APIs | Call route handlers with valid/invalid payloads |
| E2E | Admin flow | Login -> create -> edit -> delete content |

## Migration / Rollout
Add required tables and RLS policies. No breaking changes to public views.

## Version Control Standard
All significant changes SHALL be committed with clear, prefixed messages
(`feat:`, `fix:`, `docs:`, `refactor:`). Commits should represent meaningful
milestones for future development history.

## Planned Editor Architecture (Advanced)
Future iteration for editor UX:
- Gallery editor: bulk upload, drag-and-drop reordering, tagging/collections,
  and quick metadata edits per item.
- Post editor: structured content, draft/publish toggle, scheduling, and
  preview mode.
- Metadata fields: tattoo style, location link, session length, and aftercare notes.
- Admin profile: payment data, addresses, email, nickname, and cloud connections.
- OAuth providers: enable GitHub/Google/Facebook sign-in for admin.

## Admin UI Architecture
- Public portal and admin console intentionally use different visual systems.
- Public portal remains brutalist and brand-driven.
- Admin console uses softer surfaces, clearer spacing, and operational navigation.
- Headless UI provides accessible interaction primitives for menu/tab navigation.
- Skeleton loading is required on admin login and admin dashboard entry states.
- Theme controls remain available inside admin so operators can switch between
  light, eye-rest, and dark modes without leaving the workspace.
- Future admin controls include homepage section ordering, section renaming,
  and locale configuration for the public site.
- Registration should live on a dedicated route with email confirmation,
  reusable OAuth provider buttons, and a completion state that explains the
  difference between a standard account and admin approval.

## Public Composition Architecture
- Public homepage sections should move from fixed layout definition to a
  configurable composition model.
- Each section should expose:
  - stable key
  - display label
  - eyebrow label
  - sort position
  - visibility flag
  - localized labels when i18n is enabled
- The public rendering layer should consume the configured composition before
  falling back to default section order.
- The public header navigation should derive from the visible configured
  sections so navigation order stays aligned with homepage composition.
- Language preference should be stored independently from theme preference, but
  exposed with a similarly lightweight selector UX.

## Post-MVP Expansion Architecture
- Payments, calendar sync, reminders, chatbot support, and WhatsApp delivery
  should all be modeled as optional modules.
- Each optional module should support three states:
  - disabled
  - configured but disconnected / degraded
  - enabled and healthy
- Artist-controlled toggles should live in the admin workspace and must not
  require redeploys for routine enable/disable operations.
- Booking and public contact flows must continue working even if post-MVP
  integrations are absent or misconfigured.
- Notification and calendar features should evolve behind clear service
  boundaries so future SaaS tenancy does not require rewriting core booking
  logic.

Planned post-MVP themes now tracked in product docs:
- sandbox Stripe / PayPal completion
- appointment calendar management
- email reminders
- WhatsApp booking notification
- Google Calendar sync
- chatbot guidance + developer ticket routing
- per-feature toggles controlled by the artist
- future multi-tenant / SaaS exploration

Pilot extension assumptions now recorded:
- `akemi@tattoo.ink` is treated as the premium pilot tenant with custom brutalist styling.
- New artist accounts should default to a free plan baseline with limited features.
- Free plan should expose only a small predefined theme set (target: three selectable styles).
- Platform admin (developer-side) needs activation/deactivation control per artist page.
- New domain naming for scheduling module: `Scheduling & Availability`.

## Role-Split Implementation Status (2026-04-01)
- Private surface split is implemented:
  - Platform Admin Console: `/admin`
  - Artist Workspace: `/studio`
- Artist workspace settings baseline is migrated to artist-scoped APIs:
  - `/api/studio/profile`
  - `/api/studio/payment-settings`
  - `/api/studio/integrations`
- Next architectural step:
  - migrate artist content modules from `/api/admin/*` to `/api/studio/*`
  - enforce tenant-scoped reads/writes for galleries, pieces, posts, and homepage composition.

## Knowledge Capture & Skills
Maintain SDD artifacts in `openspec/` and keep skill registry updated so
future changes stay aligned with existing standards.
- Before implementation, review `C:\GitHub\akemi\.atl\skill-registry.md`
  and load the minimum relevant skills for the task.
- When Engram is available, persist active task context and the selected skill
  context before major execution work.
- If the task changes domain during execution, repeat the skill review
  preflight before continuing.

## SDLC Quality Standard
This project follows a manual security review workflow and documented quality
gates in `docs/SDLC_QUALITY_STANDARD.md` and `docs/PR_PROCESS.md`.

## Open Questions
- [ ] Exact admin roles and number of admin users?
- [ ] Should posts be public immediately or require a publish workflow?
- [ ] Which OAuth providers are required first (Google/GitHub/Facebook)?

