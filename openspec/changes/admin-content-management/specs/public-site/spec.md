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
