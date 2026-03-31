# Google OAuth Setup (Agitprop)

Date: 2026-03-31
Owner: Platform Admin

## Current Google OAuth Client
- Status: Enabled
- Client ID: `282533677964-nduiordgl1rbbv7og1qorb43rh3mt9l4.apps.googleusercontent.com`
- Client Secret: configured in secure provider settings (do not store full value in repo)
- Created at: 2026-03-31

## Required Redirect URI (Google Cloud)
Google OAuth client **must** include this exact redirect URI:

`https://ffnrzvklegbiejlksnai.supabase.co/auth/v1/callback`

If this URI is missing, Google returns:
- `Error 400: redirect_uri_mismatch`

## Supabase Provider Configuration
In Supabase Dashboard:
- Authentication -> Providers -> Google
  - Enabled: `true`
  - Client ID: set from Google Cloud
  - Client Secret: set from Google Cloud

## Supabase URL Configuration
In Supabase Dashboard:
- Authentication -> URL Configuration
  - Site URL:
    - `https://akemiontattoo.vercel.app`
  - Additional Redirect URLs:
    - `https://akemiontattoo.vercel.app/auth/callback`
    - `https://akemiontattoo.vercel.app/studio`
    - `https://akemiontattoo.vercel.app/studio/login`

## Google OAuth Consent Screen
- OAuth access may be restricted to test users if app is in testing mode.
- Ensure required test users are added under Google OAuth consent screen.

## Security Notes
- Never commit Google Client Secret to git.
- If secret was shared in chat/screenshots, rotate it in Google Cloud and update Supabase immediately.
- After rotating credentials, re-test `/studio/login` OAuth flow.

## Smoke Test
1. Open `/studio/login`.
2. Click `Continue with Google`.
3. Complete Google OAuth.
4. Verify redirect to `/studio`.
5. Verify no `redirect_uri_mismatch` error.

