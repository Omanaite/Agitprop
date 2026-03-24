# Auth Specification

## Purpose
Define secure authentication and role enforcement for the admin user.

## Requirements

### Requirement: Admin Login
The system **MUST** allow a registered admin user to sign in to access protected features.

#### Scenario: Successful login
- GIVEN a valid admin account exists
- WHEN the user submits correct credentials
- THEN the system grants access to protected areas
- AND the session is established

#### Scenario: Invalid credentials
- GIVEN a login attempt with incorrect credentials
- WHEN the user submits the form
- THEN the system denies access
- AND returns a generic authentication error

### Requirement: Role-Based Access
The system **MUST** restrict admin-only capabilities to users with the admin role.

#### Scenario: Authorized access
- GIVEN an authenticated admin user
- WHEN the user requests an admin-only operation
- THEN the system allows the operation

#### Scenario: Unauthorized access
- GIVEN a user without admin role or without authentication
- WHEN the user requests an admin-only operation
- THEN the system blocks the operation

### Requirement: Admin Session Guard
The system **SHALL** protect admin routes with session validation and role verification.

#### Scenario: Expired session
- GIVEN an admin session has expired
- WHEN the user accesses an admin route
- THEN the system redirects to the admin login

### Requirement: OAuth Providers (Planned)
The system **SHOULD** support OAuth providers (Google, GitHub, Facebook, or others used by artists).

#### Scenario: OAuth login enabled
- GIVEN OAuth is configured for a provider
- WHEN the admin selects that provider
- THEN the system authenticates via Supabase Auth OAuth flow

#### Scenario: OAuth not configured
- GIVEN OAuth is not configured
- WHEN the admin selects a provider
- THEN the system shows a configuration error and blocks the flow

### Requirement: Account Registration
The system **SHOULD** provide a registration flow for standard accounts with email confirmation and OAuth sign-up options.

#### Scenario: Email sign-up succeeds
- GIVEN a visitor opens the registration page
- WHEN the visitor submits a valid email/password form
- THEN the system creates the account
- AND sends a confirmation email
- AND explains that admin access requires separate approval

#### Scenario: OAuth sign-up succeeds
- GIVEN a supported OAuth provider is configured
- WHEN the visitor chooses Google or GitHub on the registration page
- THEN the system authenticates through Supabase OAuth
- AND redirects the visitor to a completion page
- AND keeps admin-only access restricted unless the admin role exists
