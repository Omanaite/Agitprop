# Security Review Checklist

Document role: Canonical
Owner: Security and release verification
Scope: Manual security checklist for release and operational review
Last updated: 2026-04-29

## OWASP Top 10 (Admin + Public APIs)
- [x] A01 Broken Access Control: admin routes protected by middleware + server auth checks
- [x] A02 Cryptographic Failures: HTTPS in production, secure cookies
- [x] A03 Injection: input validation (Zod) for all admin payloads
- [x] A04 Insecure Design: RLS policies enforce admin-only writes
- [x] A05 Security Misconfiguration: ensure env vars set, no service keys in client
- [ ] A06 Vulnerable Components: run `npm audit` periodically
- [x] A07 Authentication Failures: enforce admin role in `app_metadata`
- [x] A08 Data Integrity Failures: validate upload mime types and size limits
- [x] A09 Logging Failures: log admin auth events and API errors
- [x] A10 SSRF: no outbound fetches with user-provided URLs

## Supabase RLS Review
- [x] `tattoos` admin-only writes
- [x] `posts` admin-only writes
- [x] public read policies are limited to public content only

## Secrets Review
- [ ] `.env.local` not committed
- [ ] `SUPABASE_SERVICE_ROLE_KEY` used only server-side
- [ ] `NEXT_PUBLIC_*` safe for client exposure

## Findings (Resumen)
- Admin access control y RLS OK.
- Headers de seguridad y rate limiting aplicados.
- Same-origin guard aplicado en rutas mutables.
- Validaciones y errores unificados OK.
- Logging de eventos admin implementado (requiere tabla `audit_logs`).

## Recomendaciones
1. Ejecutar `npm audit` y corregir dependencias críticas.
2. Añadir logging de eventos admin y errores de API.
3. Confirmar que `.env.local` no se suba a git y que service role solo se use server-side.
