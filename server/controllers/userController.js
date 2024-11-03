import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { sendEmail } from '../config/emailConfig.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // checking if user already exists (email or username)
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.json({ success: false, message: "Email already in use" });
    }

    // validating username
    if (!(username.length == 6)) {
      return res.json({ success: false, message: "Username must be of 6 Characters" });
    }

    const existUsername = await userModel.findOne({ username });
    if (existUsername) {
      return res.json({ success: false, message: "Username already in use" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a stronger password" });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 3600000; // 24 hours

    // hashing user password - moved this up before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with all fields
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false
    });

    // Save the user
    const user = await newUser.save();

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Webmark - Verify Your Email',
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style="background-color: #f6f9fc; padding: 40px 0;">
      <div style="max-width: 560px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.FRONTEND_URL}/favicon.png" alt="Webmark Logo" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: #1a2b4b; font-size: 24px; font-weight: 700; margin: 0;">
            Verify your email address
          </h1>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 30px; color: #4a5568;">
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Hi ${username},
          </p>
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Welcome to Webmark! To start organizing your bookmarks smarter and accessing them from anywhere, please verify your email address.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verificationUrl}" 
             style="display: inline-block; 
                    padding: 12px 32px; 
                    background-color: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: 600;
                    font-size: 16px;
                    transition: background-color 0.2s;">
            Verify Email Address
          </a>
        </div>

        <!-- Additional Info -->
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
          <p style="font-size: 14px; color: #64748b; line-height: 20px; margin: 0;">
            This verification link will expire in 24 hours. If you didn't create an account with Webmark, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="font-size: 14px; color: #94a3b8; margin: 0;">
            © ${new Date().getFullYear()} Webmark. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
      });

      // Return success response with requiresVerification flag
      return res.json({
        success: false,
        requiresVerification: true,
        message: "Please verify your email to continue. Remember to check your spam folder if you don't see the email.",
        email: email
      });
    } catch (error) {
      console.error('Email sending error:', error);
      // If email sending fails, delete the user and return error
      await userModel.findByIdAndDelete(user._id);
      return res.json({
        success: false,
        message: "Failed to send verification email. Please try again."
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error during registration" });
  }
};

// login user
const loginUser = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await userModel.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check email verification before creating token
    if (!user.isEmailVerified) {
      return res.json({
        success: false,
        requiresVerification: true,
        message: "Please verify your email before logging in",
        email: user.email
      });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error during login" });
  }
};

const userData = async (req, res) => {
  try {
    const userdata = await userModel.findById(req.body.userId);
    if (userdata) {
      // Check if email is verified
      if (!userdata.isEmailVerified) {
        return res.json({
          success: false,
          requiresVerification: true,
          message: "Email not verified",
          email: userdata.email
        });
      }

      res.json({
        success: true,
        username: userdata.username,
        email: userdata.email,
        joinedAt: userdata.joinedAt
      });
    }
    else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user data" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired verification link."
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully."
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.json({
      success: false,
      message: "Error verifying email"
    });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 3600000; // 24 hours
    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Webmark - Email Verification',
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style="background-color: #f6f9fc; padding: 40px 0;">
      <div style="max-width: 560px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.FRONTEND_URL}/favicon.png" alt="Webmark Logo" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: #1a2b4b; font-size: 24px; font-weight: 700; margin: 0;">
            Verify your email address
          </h1>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 30px; color: #4a5568;">
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            You requested a new verification link for your Webmark account. Click the button below to verify your email address.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verificationUrl}" 
             style="display: inline-block; 
                    padding: 12px 32px; 
                    background-color: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: 600;
                    font-size: 16px;
                    transition: background-color 0.2s;">
            Verify Email Address
          </a>
        </div>

        <!-- Additional Info -->
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
          <p style="font-size: 14px; color: #64748b; line-height: 20px; margin: 0;">
            This verification link will expire in 24 hours. If you didn't request this verification email, you can safely ignore it.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="font-size: 14px; color: #94a3b8; margin: 0;">
            © ${new Date().getFullYear()} Webmark. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
    });

    res.json({
      success: true,
      message: "Verification email sent successfully"
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.json({
      success: false,
      message: "Error sending verification email"
    });
  }
};

// Request password reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "No account with that email address exists."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token and expiry to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email using the sendEmail utility
    try {
      await sendEmail({
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Webmark - Password Reset Request',
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style="background-color: #f6f9fc; padding: 40px 0;">
      <div style="max-width: 560px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.FRONTEND_URL}/favicon.png" alt="Webmark Logo" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: #1a2b4b; font-size: 24px; font-weight: 700; margin: 0;">
            Reset Your Password
          </h1>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 30px; color: #4a5568;">
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            We received a request to reset the password for your Webmark account. Click the button below to create a new password.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetUrl}" 
             style="display: inline-block; 
                    padding: 12px 32px; 
                    background-color: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: 600;
                    font-size: 16px;
                    transition: background-color 0.2s;">
            Reset Password
          </a>
        </div>

        <!-- Security Notice -->
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
          <p style="font-size: 14px; color: #64748b; line-height: 20px; margin: 0;">
            This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account's security.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="font-size: 14px; color: #94a3b8; margin: 0;">
            © ${new Date().getFullYear()} Webmark. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
      });

      res.json({
        success: true,
        message: "Password reset email sent"
      });
    } catch (error) {
      console.error('Email sending error:', error);
      res.json({
        success: false,
        message: "Error sending password reset email"
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json({
      success: false,
      message: "Error in password reset process"
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Password reset token is invalid or has expired."
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password has been reset."
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.json({
      success: false,
      message: "Error resetting password"
    });
  }
};
// Export existing functions
export {
  loginUser,
  registerUser,
  userData,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
};