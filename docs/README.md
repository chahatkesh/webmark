# Webmark Documentation

Product and engineering docs for [Webmark](https://webmark.chahatkesh.me) — a modern bookmark manager with categories, drag-and-drop, browser import, a one-click bookmarklet, AI sorting, and multi-device sessions.

## Index

### Architecture

| Document                                   | Description                                 |
| ------------------------------------------ | ------------------------------------------- |
| [Overview](./architecture/overview.md)     | System design, tech stack, and request flow |
| [Data Model](./architecture/data-model.md) | MongoDB collections and key fields          |

### Getting Started

| Document                                                | Description                                  |
| ------------------------------------------------------- | -------------------------------------------- |
| [Developer Setup](./getting-started/developer-setup.md) | Local install, env files, and workflows      |
| [Google OAuth](./getting-started/google-oauth.md)       | Creating and wiring Google OAuth credentials |

### Deployment

| Document                                                       | Description                               |
| -------------------------------------------------------------- | ----------------------------------------- |
| [Vercel](./deployment/vercel.md)                               | Client + server Vercel projects           |
| [Environment Variables](./deployment/environment-variables.md) | All client and server env vars            |
| [CI/CD](./deployment/cicd.md)                                  | GitHub Actions quality checks and deploys |

### Auth

| Document                                         | Description                           |
| ------------------------------------------------ | ------------------------------------- |
| [Session Flow](./auth/session-flow.md)           | OAuth, cookies, refresh rotation      |
| [Device Management](./auth/device-management.md) | 2-device limit, pending login, revoke |

### Features

| Document                                                         | Description                                   |
| ---------------------------------------------------------------- | --------------------------------------------- |
| [Bookmarks & Categories](./features/bookmarks-and-categories.md) | Core organization model and UI                |
| [Drag & Drop](./features/drag-and-drop.md)                       | @dnd-kit reorder within and across categories |
| [Search](./features/search.md)                                   | Client-side multi-term search                 |
| [Bookmarklet](./features/bookmarklet.md)                         | Toolbar save popup and AI category assign     |
| [AI Sort](./features/ai-sort.md)                                 | Bulk OpenAI reorganization and credits        |
| [Import](./features/import.md)                                   | Chrome/Firefox HTML import and quotas         |
| [Profile & Analytics](./features/profile-and-analytics.md)       | Profile, credits, click charts, devices       |
| [Onboarding](./features/onboarding.md)                           | Username setup and default categories         |

### API

| Document                            | Description                           |
| ----------------------------------- | ------------------------------------- |
| [API Reference](./api/reference.md) | REST endpoints, auth, and rate limits |

### Frontend

| Document                                       | Description                            |
| ---------------------------------------------- | -------------------------------------- |
| [SEO](./frontend/seo.md)                       | Meta tags, sitemaps, structured data   |
| [Error Handling](./frontend/error-handling.md) | Boundaries, global handlers, reporting |
