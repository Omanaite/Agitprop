# Design: Admin Content Management

## Technical Approach
Add an admin-only content management layer using Supabase Auth for authentication, Next.js App Router for protected admin routes, and Supabase RLS for data access control. Extend the data model with admin-managed tables (posts) and wire CRUD via server routes using the existing Supabase server client pattern. Public reads remain via the public client to avoid regressions.

## Architecture Decisions

### Decision: Supabase Auth for admin authentication
**Choice**: Use Supabase Auth as the single source of truth for admin identity.
**Alternatives considered**: Custom JWT auth, third-party auth provider.
**Rationale**: The project already uses Supabase; aligning auth with Supabase reduces operational complexity and integrates with RLS.

### Decision: Admin-only CRUD via server routes
**Choice**: Implement admin CRUD through Next.js route handlers (server) using service role or auth-bound session.
**Alternatives considered**: Direct client-side mutations with anon key.
**Rationale**: Server routes keep privileged keys on the server and enforce access rules.

### Decision: Add Posts table as separate content type
**Choice**: Introduce a `posts` table for admin-managed updates.
**Alternatives considered**: Reuse `tattoos` table with a `type` discriminator.
**Rationale**: Clear separation of concerns and schema clarity for future extensibility.

## Data Flow

Admin Login → Supabase Auth → Admin Session
      │
      ├─ Admin Console (protected route)
      │    ├─ Create/Update/Delete gallery items → API route → Supabase (service role)
      │    └─ Create/Update/Delete posts → API route → Supabase (service role)
      │
Public Pages → Server components → Supabase public client (read-only)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `openspec/changes/admin-content-management/design.md` | Create | Technical design document |
| `openspec/changes/admin-content-management/tasks.md` | Create | Task breakdown (next step) |
| `supabase/schema.sql` | Modify | Add `posts` table and policies |
| `lib/supabase/server.ts` | Modify | Add admin-auth helpers if needed |
| `app/api/admin/*` | Create | CRUD endpoints for admin |
| `app/admin/*` | Create | Admin UI routes (protected) |
| `components/*` | Modify | Reusable admin form components |

## Interfaces / Contracts

```ts
// Example admin content contract
type GalleryItemInput = {
  title: string;
  description?: string;
  style: string;
  image_url: string;
};

type PostInput = {
  title: string;
  body: string;
  status: "draft" | "published";
};

type ValidationError = {
  path: string;
  message: string;
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Validation schemas | Zod schema tests |
| Integration | Admin CRUD APIs | Call route handlers with valid/invalid payloads |
| E2E | Admin flow | Login → create → edit → delete content |

## Migration / Rollout
Add `posts` table and RLS policies. No breaking changes to public views.

## Version Control Standard
All significant changes **SHALL** be committed with clear, prefixed messages
(`feat:`, `fix:`, `docs:`, `refactor:`). Commits should represent meaningful
milestones for future development history.

## Planned Editor Architecture (Advanced)
Future iteration for editor UX:
- Gallery editor: bulk upload, drag-and-drop reordering, tagging/collections,
  and quick metadata edits per item.
- Post editor: structured content, draft/publish toggle, scheduling, and
  preview mode.
- Metadata fields: tattoo style, location link, session length, and aftercare notes.

This design is inspired by common CMS patterns such as bulk upload, sorting,
and tagging flows used in gallery managers and editorial tools. citeturn1search1turn1search0

## Knowledge Capture & Skills
Maintain SDD artifacts in `openspec/` and keep skill registry updated so
future changes stay aligned with existing standards.

## Open Questions
- [ ] Exact admin roles and number of admin users?
- [ ] Should posts be public immediately or require a publish workflow?
