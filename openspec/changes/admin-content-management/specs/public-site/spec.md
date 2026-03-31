# Public Site Specification

## Purpose
Expose public-facing posts and galleries with clear, minimal layout.

## Requirements

### Requirement: Public Posts Feed
The system **MUST** display published posts on the public site.

#### Scenario: Posts available
- GIVEN published posts exist
- WHEN a visitor loads the home page
- THEN the posts section displays the latest published posts

#### Scenario: No posts available
- GIVEN no published posts exist
- WHEN a visitor loads the home page
- THEN the posts section shows an empty-state message

### Requirement: Public Galleries Listing
The system **SHOULD** display available galleries on the public site.

#### Scenario: Galleries available
- GIVEN galleries exist
- WHEN a visitor loads the home page
- THEN the galleries section lists available galleries

#### Scenario: No galleries available
- GIVEN no galleries exist
- WHEN a visitor loads the home page
- THEN the galleries section shows an empty-state message

### Requirement: Configurable Public Section Order
The system **SHOULD** render public homepage sections according to admin-managed order settings.

#### Scenario: Custom section order exists
- GIVEN an admin-defined order exists for homepage sections
- WHEN a visitor loads the home page
- THEN the sections render in the configured order

#### Scenario: No custom order exists
- GIVEN no admin-defined order exists
- WHEN a visitor loads the home page
- THEN the system uses the default section order

### Requirement: Configurable Public Section Labels
The system **SHOULD** render public section names using admin-managed labels when present.

#### Scenario: Custom section label exists
- GIVEN a custom label exists for a homepage section
- WHEN a visitor loads the home page
- THEN the section renders with the configured label

#### Scenario: No custom section label exists
- GIVEN no custom label exists for a homepage section
- WHEN a visitor loads the home page
- THEN the section renders with the default label

### Requirement: Configurable Public Section Visibility
The system **SHOULD** allow admins to hide or show homepage sections without code changes.

#### Scenario: Section hidden by admin
- GIVEN a homepage section is marked hidden
- WHEN a visitor loads the home page
- THEN the hidden section is not rendered
- AND it is excluded from the public header navigation

#### Scenario: Section visible by admin
- GIVEN a homepage section is marked visible
- WHEN a visitor loads the home page
- THEN the section is rendered in its configured position

### Requirement: User-Selectable Language
The system **SHOULD** allow visitors to select between German, English, and Spanish.

#### Scenario: Visitor changes language
- GIVEN a visitor is on the public site
- WHEN the visitor selects a supported language
- THEN the system updates visible labels and copy to the selected language
- AND the preference persists for the next visit

#### Scenario: Unsupported or missing locale preference
- GIVEN no valid language preference is available
- WHEN a visitor loads the public site
- THEN the system falls back to the default locale

### Requirement: Public Service Landing for Agitprop
The system **MUST** provide a public service page that explains the software offer and routes users to account creation and login.

#### Scenario: Visitor opens service page
- GIVEN a visitor wants to learn about the software itself
- WHEN the visitor navigates to `/agitprop`
- THEN the page explains platform value, plan framing, and onboarding path
- AND the page includes CTAs to registration and admin login

#### Scenario: Visitor enters account flow from service page
- GIVEN a visitor is on `/agitprop`
- WHEN the visitor clicks create account
- THEN the visitor is routed to `/register`
- AND the flow remains usable on mobile and desktop layouts

