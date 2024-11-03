// emailConfig.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USERNAME', 'EMAIL_PASSWORD', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create transporter with validation
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    // Add debug option to help troubleshoot connection issues
    debug: process.env.NODE_ENV !== 'production'
  });

  // Verify transporter
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter verification failed:', error);
        reject(error);
      } else {
        console.log('Server is ready to send emails');
        resolve(transporter);
      }
    });
  });
};

// Export async function to get verified transporter
export const getTransporter = async () => {
  try {
    return await createTransporter();
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    throw error;
  }
};

// Utility function to send emails
export const sendEmail = async (options) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(options);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};