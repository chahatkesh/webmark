# Webmark Developer Setup Guide

This comprehensive guide provides detailed instructions for setting up the Webmark development environment, understanding the codebase, and contributing to the project.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher
- **npm**: Usually comes with Node.js
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control
- **Code Editor**: VS Code recommended with ESLint and Prettier extensions

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/chahatkesh/webmark.git
cd webmark
```

### 2. Environment Configuration

#### Server Configuration

Create a `.env` file in the server directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/webmark
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/webmark

# Authentication
JWT_SECRET=your_very_secure_jwt_secret
COOKIE_SECRET=your_very_secure_cookie_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/user/auth/google/callback

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Client Configuration

Create a `.env` file in the client directory:

```bash
cd ../client
cp .env.example .env
```

Edit the client `.env` file:

```
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Install Dependencies

Install server dependencies:

```bash
cd ../server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

### 4. Database Setup

#### Option 1: Local MongoDB

If you're using a local MongoDB installation:

1. Start MongoDB service:

```bash
sudo service mongod start  # Linux
brew services start mongodb-community  # macOS
```

2. The application will automatically create the necessary collections.

#### Option 2: MongoDB Atlas

If using MongoDB Atlas:

1. Create a cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address in the Network Access settings
4. Copy the connection string to your server `.env` file

### 5. Google OAuth Setup

To enable Google authentication:

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project
3. Navigate to "Credentials" and create OAuth 2.0 Client ID
4. Configure the consent screen with necessary scopes
5. Add authorized JavaScript origins: `http://localhost:4000`
6. Add authorized redirect URIs: `http://localhost:4000/api/user/auth/google/callback`
7. Copy the Client ID and Client Secret to your server `.env` file
8. Copy the Client ID to your client `.env` file

### 6. Start Development Servers

Start the server in development mode:

```bash
cd ../server
npm run dev
```

In a separate terminal, start the client development server:

```bash
cd ../client
npm run dev
```

The application should now be running:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Project Structure

### Server Architecture

```
server/
├── config/           # Configuration for database, email, and authentication
├── controllers/      # Request handlers and business logic
├── middleware/       # Authentication and request processing middleware
├── models/           # MongoDB schema definitions
├── routes/           # API route definitions
├── utils/            # Utility functions and helpers
├── server.js         # Main application entry point
```

### Client Architecture

```
client/
├── public/           # Static assets
└── src/
    ├── assets/       # Images, icons, and other static resources
    ├── components/   # Reusable UI components
    │   ├── DashboardComponents/   # Dashboard-specific components
    │   ├── HomeComponents/        # Home page components
    │   ├── enhanced/              # Enhanced components with additional features
    │   └── ui/                    # Base UI components
    ├── context/      # React context providers
    ├── hooks/        # Custom React hooks
    ├── layouts/      # Page layout components
    ├── lib/          # Utility libraries
    ├── pages/        # Page components
    └── utils/        # Utility functions
```

## Development Workflow

### Branching Strategy

Follow this workflow for contributions:

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit: `git commit -m "feat: add your feature"`
3. Push to remote: `git push origin feature/your-feature-name`
4. Create pull request to the `main` branch

### Commit Message Format

Follow conventional commits format:

```
type(scope): short description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes

### Code Style Guidelines

- Use ESLint and Prettier for code formatting
- Follow Airbnb JavaScript Style Guide
- Use React functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Ensure accessibility standards are met

## Testing

### Running Tests

Run backend tests:

```bash
cd server
npm test
```

Run frontend tests:

```bash
cd client
npm test
```

### Test Coverage

Generate test coverage reports:

```bash
cd server
npm run test:coverage

cd ../client
npm run test:coverage
```

## Debugging

### Server Debugging

1. Add console.log statements or use the debugger keyword
2. Use VS Code's built-in debugger
3. Check logs in the terminal running the server

### Client Debugging

1. Use React Developer Tools browser extension
2. Check Console and Network tabs in browser DevTools
3. Use the debugger statement in your code

## Deployment

### Production Build

Create production builds:

```bash
# Build the client
cd client
npm run build

# Start the server in production mode
cd ../server
npm run start
```

### Environment Variables for Production

Update environment variables for production:

1. Set `NODE_ENV=production` in server environment
2. Update MongoDB connection string to production database
3. Configure proper OAuth callback URLs for production domain
4. Set appropriate CORS settings for production

## Common Issues and Solutions

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB
**Solution**:

- Check if MongoDB service is running
- Verify connection string in `.env`
- Ensure network access is properly configured

### OAuth Authentication Failures

**Problem**: Google login not working
**Solution**:

- Verify Client ID and Client Secret are correct
- Check authorized domains and callback URLs
- Ensure the consent screen is properly configured

### Frontend API Connection Issues

**Problem**: Frontend cannot connect to backend API
**Solution**:

- Check if CORS is properly configured on server
- Verify API URL in client `.env` file
- Ensure both client and server are running

### JWT Token Issues

**Problem**: Authentication token issues
**Solution**:

- Check JWT_SECRET in server `.env`
- Verify token is being properly stored and sent with requests
- Check for token expiration handling

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Beautiful DnD Documentation](https://github.com/atlassian/react-beautiful-dnd)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
