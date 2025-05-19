# Google Authentication Setup for Webmark

## Changes Made

1. **Server-side implementation:**

   - Added Passport.js with Google OAuth strategy
   - Updated user model to support Google authentication
   - Created authentication routes for Google sign-in
   - Implemented token-based session management with refresh tokens
   - Added onboarding process for new users to set username

2. **Client-side implementation:**
   - Created new Auth component with Google sign-in button
   - Added Onboarding page for new users
   - Updated authentication hooks to support Google login
   - Removed email/password-based authentication

## Setup Steps

1. **Set up Google OAuth Credentials:**

   - Go to [Google Developer Console](https://console.developers.google.com/)
   - Create a new project
   - Navigate to "Credentials" and create OAuth 2.0 Client ID
   - Configure the OAuth consent screen
   - Add authorized JavaScript origins: `http://localhost:4000`
   - Add authorized redirect URIs: `http://localhost:4000/api/user/auth/google/callback`
   - Save your Client ID and Client Secret

2. **Update Environment Variables:**

   - Copy `.env.example` to `.env` in the server directory
   - Add your MongoDB connection string
   - Set a strong JWT_SECRET
   - Add your Google Client ID and Client Secret

3. **Test Authentication Flow:**
   - Start both server and client applications
   - Test the Google sign-in flow
   - Verify the onboarding process for new users
   - Make sure session persistence works properly

## Security Considerations

1. Ensure your JWT_SECRET is strong and kept secure
2. Make sure the client ID and client secret are not exposed in client-side code
3. Set appropriate cookie security flags in production
4. Implement rate limiting for authentication endpoints

## Production Considerations

When deploying to production:

1. Update Google OAuth callback URLs to your production domain
2. Set appropriate CORS settings
3. Enable HTTPS for all endpoints
4. Use secure cookie settings
5. Consider adding additional security measures like rate limiting and monitoring
