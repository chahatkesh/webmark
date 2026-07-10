# Webmark API Documentation

This document provides a comprehensive guide to the Webmark REST API endpoints, including request formats, response structures, and authentication requirements.

## Authentication

Webmark uses Google OAuth for sign-in. Protected endpoints require a valid access token.

The server accepts the access token from:

1. **`wm_access` httpOnly cookie** (primary)
2. **`token` request header** (legacy fallback)

On login, the server also sets a `wm_refresh` httpOnly cookie for session renewal. The client refreshes expired access tokens via `POST /api/user/refresh` with `credentials: include`.

See [AUTH_SESSION_FLOW.md](./AUTH_SESSION_FLOW.md) for the full flow.

**Authenticated request example:**

```
fetch("/api/bookmarks/categories", {
  credentials: "include",
  headers: { token: "<legacy-token-if-present>" }
})
```

## User Management

### Google Authentication

```
GET /api/user/auth/google
```

Redirects the user to Google's OAuth consent screen.

```
GET /api/user/auth/google/callback
```

OAuth callback. Sets `wm_access` and `wm_refresh` cookies, then redirects to the frontend.

### Refresh Session

```
POST /api/user/refresh
```

Rotates the refresh token and issues a new access token. Requires the `wm_refresh` cookie.

### Get User Data

```
POST /api/user/userdata
```

Returns the authenticated user's profile. Requires auth.

### Complete Onboarding

```
POST /api/user/complete-onboarding
```

Sets username and completes first-time setup for new Google sign-ups.

### Logout

```
POST /api/user/logout
```

Clears auth cookies, refresh token hashes, and legacy client tokens.

### Get User Profile

```
POST /api/user/profile
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url"
  }
}
```

### Update User Profile

```
PUT /api/user/profile
```

**Request Body:**

```json
{
  "name": "Updated Name",
  "picture": "new_profile_picture_url"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "user@example.com",
    "picture": "new_profile_picture_url"
  }
}
```

## Category Management

### Get Categories

```
GET /api/bookmarks/categories
```

**Response:**

```json
{
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "category": "Category Name",
      "bgcolor": "#f7fee7",
      "hcolor": "#4d7c0f",
      "emoji": "📑",
      "order": 0
    }
  ]
}
```

### Get Categories with Bookmarks

```
GET /api/bookmarks/categories-with-bookmarks
```

**Response:**

```json
{
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "category": "Category Name",
      "bgcolor": "#f7fee7",
      "hcolor": "#4d7c0f",
      "emoji": "📑",
      "order": 0,
      "bookmarks": [
        {
          "_id": "bookmark_id",
          "name": "Bookmark Name",
          "link": "https://example.com",
          "logo": "logo_url",
          "order": 0
        }
      ]
    }
  ]
}
```

### Create Category

```
POST /api/bookmarks/category
```

**Request Body:**

```json
{
  "category": "New Category",
  "bgcolor": "#f7fee7",
  "hcolor": "#4d7c0f",
  "emoji": "📑"
}
```

**Response:**

```json
{
  "success": true,
  "category": {
    "_id": "new_category_id",
    "category": "New Category",
    "bgcolor": "#f7fee7",
    "hcolor": "#4d7c0f",
    "emoji": "📑",
    "order": 0
  }
}
```

### Update Category

```
PUT /api/bookmarks/category
```

**Request Body:**

```json
{
  "_id": "category_id",
  "category": "Updated Category",
  "bgcolor": "#e0f2fe",
  "hcolor": "#0369a1",
  "emoji": "📚"
}
```

**Response:**

```json
{
  "success": true,
  "category": {
    "_id": "category_id",
    "category": "Updated Category",
    "bgcolor": "#e0f2fe",
    "hcolor": "#0369a1",
    "emoji": "📚",
    "order": 0
  }
}
```

### Delete Category

```
DELETE /api/bookmarks/category
```

**Request Body:**

```json
{
  "categoryId": "category_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Bookmark Management

### Get Bookmarks

```
GET /api/bookmarks/bookmarks/:categoryId
```

**Response:**

```json
{
  "success": true,
  "bookmarks": [
    {
      "_id": "bookmark_id",
      "categoryId": "category_id",
      "name": "Bookmark Name",
      "link": "https://example.com",
      "logo": "logo_url",
      "order": 0
    }
  ]
}
```

### Create Bookmark

```
POST /api/bookmarks/bookmark
```

**Request Body:**

```json
{
  "categoryId": "category_id",
  "name": "New Bookmark",
  "link": "https://example.com",
  "logo": "logo_url"
}
```

**Response:**

```json
{
  "success": true,
  "bookmark": {
    "_id": "new_bookmark_id",
    "categoryId": "category_id",
    "name": "New Bookmark",
    "link": "https://example.com",
    "logo": "logo_url",
    "order": 0
  }
}
```

### Update Bookmark

```
PUT /api/bookmarks/bookmark
```

**Request Body:**

```json
{
  "bookmarkId": "bookmark_id",
  "name": "Updated Bookmark",
  "link": "https://updated-example.com",
  "logo": "updated_logo_url"
}
```

**Response:**

```json
{
  "success": true,
  "bookmark": {
    "_id": "bookmark_id",
    "categoryId": "category_id",
    "name": "Updated Bookmark",
    "link": "https://updated-example.com",
    "logo": "updated_logo_url",
    "order": 0
  }
}
```

### Delete Bookmark

```
DELETE /api/bookmarks/bookmark
```

**Request Body:**

```json
{
  "bookmarkId": "bookmark_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Bookmark deleted successfully"
}
```

### Reorder Bookmarks

```
PUT /api/bookmarks/reorder
```

**Request Body:**

```json
{
  "categoryId": "category_id",
  "bookmarks": [
    {
      "id": "bookmark_id_1",
      "order": 0
    },
    {
      "id": "bookmark_id_2",
      "order": 1
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Bookmark order updated successfully"
}
```

### Import Bookmarks

```
POST /api/bookmarks/import
```

Imports bookmarks from a parsed browser export. Request body contains folder/bookmark data grouped by category.

### Reorder Layout (cross-category)

```
PUT /api/bookmarks/reorder-layout
```

Batch-updates bookmark positions across multiple categories (used after drag-and-drop).

### AI Sort

```
POST /api/bookmarks/ai/sort
```

Bulk reorganizes bookmarks using OpenAI. Body: `{ "mode": "all" | "uncategorized" }`. Requires `OPENAI_API_KEY` on the server.

```
POST /api/bookmarks/ai/sort/revert
```

Reverts the most recent AI sort operation.

### Bookmarklet Save

```
GET /api/bookmarks/save
```

Server-rendered save page for the bookmarklet popup. Authenticated via bookmarklet auth middleware.

## Click Tracking

### Track Bookmark Click

```
POST /api/clicks/track
```

**Request Body:**

```json
{
  "bookmarkId": "bookmark_id"
}
```

**Response:**

```json
{
  "success": true,
  "clickCount": 42
}
```

### Get User Statistics

```
GET /api/stats
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalBookmarks": 120,
    "totalCategories": 15,
    "totalClicks": 1500,
    "topBookmarks": [
      {
        "_id": "bookmark_id",
        "name": "Popular Bookmark",
        "link": "https://example.com",
        "clickCount": 45
      }
    ]
  }
}
```

## Error Responses

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

Common error scenarios:

- Invalid authentication token
- Resource not found
- Unauthorized access
- Invalid input data
- Server errors

## Rate Limiting

API requests are limited to 100 requests per minute per user. When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

## API Versioning

Current API version is v1. All endpoints are prefixed with `/api/`.
