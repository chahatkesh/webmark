# Webmark Developer Setup Guide

Instructions for setting up the Webmark development environment and understanding the codebase.

## Prerequisites

- **Node.js** 20+
- **pnpm** — install via `npm install -g pnpm` or [pnpm.io](https://pnpm.io/)
- **MongoDB** — local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**
- **Code editor** — VS Code recommended

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/chahatkesh/webmark.git
cd webmark
```

### 2. Install Dependencies

From the repo root (pnpm workspace):

```bash
pnpm install
```

### 3. Environment Configuration

#### Server

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```bash
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/webmark
JWT_SECRET=your_very_secure_jwt_secret

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
SERVER_URL=http://localhost:4000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional — enables AI sort and bookmarklet categorization
OPENAI_API_KEY=sk-your-openai-key-here
```

See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for OAuth credential setup.

#### Client

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:

```bash
VITE_API_URL=http://localhost:4000
```

### 4. Database Setup

**Local MongoDB:**

```bash
# macOS
brew services start mongodb-community

# Linux
sudo service mongod start
```

**MongoDB Atlas:** Create a cluster, whitelist your IP, and paste the connection string into `MONGO_URI`.

Collections are created automatically on first use.

### 5. Start Development Servers

From the repo root:

```bash
pnpm dev
```

This uses [mprocs](https://github.com/pvolok/mprocs) to run both apps:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

Or run them separately:

```bash
pnpm dev:client
pnpm dev:server
```

## Project Structure

### Server

```
server/
├── config/           # Database, email, and Passport configuration
├── controllers/    # Request handlers and business logic
├── middleware/       # Auth and bookmarklet middleware
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── utils/            # AI categorizer, cron jobs, session helpers
└── server.js         # Application entry point
```

### Client

```
client/
├── public/           # Static assets and sitemaps
└── src/
    ├── components/   # UI, dashboard, and home page components
    ├── context/      # Auth and store providers
    ├── hooks/        # SWR data hooks (useBookmarks, useAuth, etc.)
    ├── layouts/      # Authenticated layout wrapper
    ├── pages/        # Route-level pages
    └── utils/        # API client, DnD helpers, SEO utilities
```

## Development Workflow

### Branching

1. `git checkout -b feature/your-feature-name`
2. Make changes and commit: `git commit -m "feat: add your feature"`
3. `git push origin feature/your-feature-name`
4. Open a pull request to `main`

### Commit Format

Follow [conventional commits](https://www.conventionalcommits.org/):

```
feat(scope): short description
fix(scope): short description
docs(scope): short description
```

### Code Quality

```bash
pnpm lint           # ESLint (client) + syntax check (server)
pnpm type-check     # TypeScript check for client UI components
pnpm format         # Auto-format with Prettier
pnpm format:check   # Verify formatting (runs in CI)
```

## Debugging

**Server:** Check terminal output from `pnpm dev:server`. Use VS Code debugger or `console.log`.

**Client:** Use React DevTools and browser DevTools (Console, Network). API calls go through `client/src/utils/apiClient.js` with `credentials: include` for cookie-based auth.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel setup, environment variables, and CI/CD.

Production build:

```bash
pnpm --filter client run build
pnpm --filter server run start
```

## Common Issues

### MongoDB connection fails

- Verify MongoDB is running locally, or the Atlas connection string is correct
- Check network access / IP whitelist on Atlas

### Google login fails

- Confirm `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `server/.env`
- Authorized redirect URI must be `http://localhost:4000/api/user/auth/google/callback`
- See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)

### Frontend can't reach the API

- Both servers must be running
- `VITE_API_URL` in `client/.env` must match the server port
- Check `CORS_ORIGINS` in `server/.env` includes the client origin

### Session / auth issues

- See [AUTH_SESSION_FLOW.md](./AUTH_SESSION_FLOW.md)
- For local dev: `COOKIE_SECURE=false`, `COOKIE_SAMESITE=lax`
- Clear cookies and `localStorage` token if stuck in a bad state

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [SWR Documentation](https://swr.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
