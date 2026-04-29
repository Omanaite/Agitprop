# Agitprop Service Page Plan

## Objective
Build a dedicated page that explains the software product (Agitprop), separates this message from the Akemi pilot portfolio, and drives users into account creation.

## Route
- `/agitprop`

## Target User
- Independent artist or studio owner evaluating a ready-to-use website + operations product.

## Core Message Blocks
1. Product positioning: artist website + portfolio + booking operations.
2. Feature pillars: portfolio, publishing, booking.
3. Plan framing: Free vs Premium.
4. Clear calls to action:
- `Create account` -> `/register`
- `Admin login` -> `/admin/login`
- `View pilot site` -> `/`

## MVP Scope (Implemented)
- Service page in admin-style visual language.
- Theme toggle support (`normal`, `eye`, `dark`).
- CTA links wired to auth funnel.

## Pending Enhancements
- Localized service copy (`en`, `es`, `de`).
- Conversion events (`service_view`, `register_click`, `login_click`).
- SEO page expansion for SaaS-intent keywords.
- Structured FAQ section for onboarding objections.

## Smoke Test
1. Open `/agitprop` on mobile and desktop.
2. Verify all CTA links navigate correctly.
3. Verify theme switch persists and keeps contrast/readability.
4. Verify `/register` flow still works from service-page entry.
5. Verify `/admin/login` flow still works from service-page entry.

## Acceptance Criteria
- The service narrative is distinct from the pilot portfolio.
- A new user can discover the product and start account creation in <= 2 clicks.
- No regressions in current pilot public pages.

