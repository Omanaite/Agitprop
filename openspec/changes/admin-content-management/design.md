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

### Decision: Admin profile + cloud storage connections (planned)
**Choice**: Add a profile view for the admin to manage payment data, addresses, email, nickname, and cloud storage connections. Editors should only enable cloud upload when connected.
**Rationale**: Keeps account management centralized and reduces broken upload flows.

### Decision: Separate visual language for admin experience
**Choice**: Give the admin console a distinct UI system from the public brutalist portfolio, using a friendlier operations-oriented layout with Headless UI navigation primitives and skeleton loading states.
**Alternatives considered**: Reuse the public brutalist styling across admin, or create a completely separate application.
**Rationale**: The public site optimizes for brand expression, while the admin optimizes for clarity, speed, and repeat operational tasks. A separate admin visual language reduces cognitive friction without requiring a second application.

## Data Flow

Admin Login -> Supabase Auth -> Admin Session
  |
  |-- Admin Console (protected route)
  |   |-- Create/Update/Delete gallery items -> API route -> Supabase
  |   |-- Create/Update/Delete posts -> API route -> Supabase
  |   |-- Manage admin profile -> API route -> Supabase (planned)
  |   |-- Connect OAuth / cloud storage -> Supabase Auth + provider (planned)
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

## Knowledge Capture & Skills
Maintain SDD artifacts in `openspec/` and keep skill registry updated so
future changes stay aligned with existing standards.

## SDLC Quality Standard
This project follows a manual security review workflow and documented quality
gates in `docs/SDLC_QUALITY_STANDARD.md` and `docs/PR_PROCESS.md`.

## Open Questions
- [ ] Exact admin roles and number of admin users?
- [ ] Should posts be public immediately or require a publish workflow?
- [ ] Which OAuth providers are required first (Google/GitHub/Facebook)?
