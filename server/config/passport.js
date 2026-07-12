import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import "dotenv/config";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || "http://localhost:4000"}/api/user/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        const displayName = profile.displayName;

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Refresh Google profile fields on each sign-in
          let dirty = false;
          if (photo && user.profilePicture !== photo) {
            user.profilePicture = photo;
            dirty = true;
          }
          if (displayName && user.name !== displayName) {
            user.name = displayName;
            dirty = true;
          }
          if (dirty) await user.save();
          return done(null, user);
        }

        // If user with this email exists but no googleId (legacy user), update with googleId
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (photo) user.profilePicture = photo;
            if (displayName) user.name = displayName;
            await user.save();
            return done(null, user);
          }
        }

        // New user - create in pre-onboarding state
        // Username will be set during onboarding
        const newUser = new User({
          email,
          googleId: profile.id,
          profilePicture: photo,
          name: displayName,
          username: `user_${Math.random().toString(36).substring(2, 10)}`, // Temporary username
          hasCompletedOnboarding: false,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
