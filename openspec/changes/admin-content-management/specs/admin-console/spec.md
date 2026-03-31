# Admin Console Specification

## Purpose
Provide role-scoped private consoles, separating platform administration from artist operations.

## Requirements

### Requirement: Admin Console Entry
The system **SHALL** provide protected entry points for platform admins and artist operators with role-based access.

#### Scenario: Platform admin enters platform console
- GIVEN an authenticated user with platform-admin role
- WHEN the user navigates to the platform console
- THEN the system shows platform governance modules

#### Scenario: Artist enters artist workspace
- GIVEN an authenticated user with artist role
- WHEN the user navigates to the artist workspace
- THEN the system shows artist content and operational modules

#### Scenario: Cross-role access denied
- GIVEN a user with artist role
- WHEN the user attempts to access platform-admin modules
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

### Requirement: Artist-Only Content Modules
The system **MUST** keep content modules scoped to artist workspaces, not platform admin.

#### Scenario: Platform admin opens console
- GIVEN a platform admin session
- WHEN the console loads
- THEN content modules (galleries, pieces, posts, homepage composition) are not shown

#### Scenario: Artist opens workspace
- GIVEN an artist session
- WHEN the workspace loads
- THEN content modules are available according to tenant plan and feature flags

### Requirement: Platform Integrations Governance
The system **SHOULD** allow platform admins to enable/disable integration availability globally.

#### Scenario: Integration temporarily disabled by platform admin
- GIVEN an integration is disabled globally
- WHEN an artist opens integration settings
- THEN the integration is shown as unavailable
- AND the UI explains it is under platform maintenance

### Requirement: Tenant Lifecycle Governance
The system **MUST** allow platform admins to manage tenant status and plan at platform scope.

#### Scenario: Platform admin changes tenant status
- GIVEN a platform admin user is in platform console
- WHEN the admin updates a tenant status (active/inactive/suspended)
- THEN the system persists the new status
- AND the change is written to the audit log

#### Scenario: Platform admin changes tenant plan
- GIVEN a platform admin user is in platform console
- WHEN the admin updates a tenant plan (free/premium)
- THEN the system persists the plan code
- AND future feature gating reads from the updated plan

### Requirement: Public Section Configuration
The system **SHOULD** allow the artist to manage the order and display names of public homepage sections.

#### Scenario: Artist reorders sections
- GIVEN an authenticated artist user in the workspace
- WHEN the user changes the position of homepage sections
- THEN the system stores the new order
- AND the public site renders sections in that order

#### Scenario: Artist renames a section
- GIVEN an authenticated artist user in the workspace
- WHEN the user updates the display name of a homepage section
- THEN the system stores the new label
- AND the public site renders the updated section name

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
