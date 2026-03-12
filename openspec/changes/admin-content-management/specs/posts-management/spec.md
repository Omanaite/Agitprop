# Posts Management Specification

## Purpose
Enable admins to create, update, and delete posts for public updates.

## Requirements

### Requirement: Create Post
The system **MUST** allow admins to create a post with required content.

#### Scenario: Create post successfully
- GIVEN an authenticated admin user
- WHEN the user submits a post with required fields
- THEN the system creates the post
- AND the post appears in the public view

#### Scenario: Invalid post data
- GIVEN an authenticated admin user
- WHEN the user submits a post without required fields
- THEN the system rejects the request
- AND reports validation errors using the validation standard

### Requirement: Update Post
The system **MUST** allow admins to update existing posts.

#### Scenario: Update post successfully
- GIVEN an authenticated admin user
- WHEN the user edits a post
- THEN the system saves changes
- AND the public view reflects the update

#### Scenario: Post not found
- GIVEN an authenticated admin user
- WHEN the user updates a non-existent post
- THEN the system returns a not-found error

### Requirement: Delete Post
The system **MUST** allow admins to delete posts with explicit confirmation.

#### Scenario: Delete confirmed
- GIVEN an authenticated admin user
- WHEN the user confirms deletion
- THEN the system deletes the post
- AND the post is removed from the public view

#### Scenario: Delete canceled
- GIVEN an authenticated admin user
- WHEN the user cancels deletion
- THEN the system keeps the post unchanged
