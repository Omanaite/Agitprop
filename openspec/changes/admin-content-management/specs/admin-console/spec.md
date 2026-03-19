# Admin Console Specification

## Purpose
Provide a private admin console for managing content.

## Requirements

### Requirement: Admin Console Entry
The system **SHALL** provide an admin console entry point accessible only to authenticated admins.

#### Scenario: Admin enters console
- GIVEN an authenticated admin user
- WHEN the user navigates to the admin console
- THEN the system shows the admin dashboard

#### Scenario: Non-admin access
- GIVEN a user without admin role
- WHEN the user attempts to access the admin console
- THEN the system denies access

### Requirement: Distinct Admin Experience
The system **MUST** provide an admin experience that is visually distinct from the public portfolio.

#### Scenario: Admin visual separation
- GIVEN an authenticated admin user
- WHEN the admin opens the login page or the admin console
- THEN the interface uses the dedicated admin visual system
- AND it does not reuse the public brutalist content layout as-is

### Requirement: Focused Section Navigation
The system **MUST** show one primary admin section at a time and let the user switch sections through explicit navigation.

#### Scenario: Admin switches sections
- GIVEN an authenticated admin user in the console
- WHEN the user selects another section from the navigation
- THEN the system shows the selected section
- AND hides the previously active section from the main workspace

### Requirement: Admin Theme Controls
The system **MUST** expose theme controls inside the admin login and admin console.

#### Scenario: Admin changes theme
- GIVEN an admin user on the login page or dashboard
- WHEN the user selects normal, eye-rest, or dark mode
- THEN the system applies the selected theme
- AND persists the preference for the next visit

### Requirement: Skeleton Loading for Admin Flows
The system **SHOULD** show skeleton loading states while the admin login and admin console are initializing.

#### Scenario: Admin login route loads
- GIVEN a user navigates to the admin login route
- WHEN the route is still loading
- THEN the system renders a skeleton state instead of an empty screen

#### Scenario: Admin dashboard route loads
- GIVEN an authenticated admin user opens the console
- WHEN the dashboard or a management section is still loading
- THEN the system renders a skeleton state aligned with the admin layout

### Requirement: Action Feedback
The system **SHOULD** provide success or error feedback after admin actions.

#### Scenario: Action succeeds
- GIVEN an admin user submits a valid content change
- WHEN the system completes the operation
- THEN the system displays a success confirmation

#### Scenario: Action fails
- GIVEN an admin user submits a change that cannot be completed
- WHEN the system detects the failure
- THEN the system displays an actionable error

### Requirement: Validation Messaging Standard
The system **MUST** display validation errors using a consistent visual style across the admin console.

#### Scenario: Invalid admin input
- GIVEN an admin user submits a form with invalid data
- WHEN the system validates the payload
- THEN the system shows field-level errors
- AND the error styling matches the global validation standard

### Requirement: Admin Profile (Planned)
The system **SHOULD** provide an admin profile view to manage payment data, addresses, email, and nickname.

#### Scenario: Admin edits profile
- GIVEN an authenticated admin user
- WHEN the user updates profile data
- THEN the system validates required fields
- AND saves the profile changes

### Requirement: Cloud Storage Connection (Planned)
The system **SHOULD** allow the admin to connect a cloud storage provider for image uploads.

#### Scenario: Cloud storage not connected
- GIVEN no cloud storage connection exists
- WHEN the admin opens the gallery/post editor
- THEN cloud upload options are disabled
- AND the UI explains how to connect
