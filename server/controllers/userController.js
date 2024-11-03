import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail } from '../config/emailConfig.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// login user
const loginUser = async (req, res) => {
  const { login, password } = req.body; // 'login' can be either email or username
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

    const token = createToken(user._id);
    res.json({ success: true, token });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
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

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const userData = async (req, res) => {
  try {
    const userdata = await userModel.findById(req.body.userId);
    if (userdata) {
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
        subject: 'Password Reset Request',
        html: `
          <h1>You requested a password reset</h1>
          <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
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

export { loginUser, registerUser, userData, forgotPassword, resetPassword };