// emailConfig.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'ZOHO_EMAIL_USERNAME',
  'ZOHO_EMAIL_PASSWORD'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create transporter with Zoho configuration
const createTransporter = () => {
  // Enable detailed debug logging
  const debugLog = (info) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('SMTP Debug:', info);
    }
  };

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', // Use .in domain for better reliability in India
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.ZOHO_EMAIL_USERNAME,
      pass: process.env.ZOHO_EMAIL_PASSWORD,
    },
    debug: true, // Enable debug logs
    logger: true, // Enable built-in logger
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
      // Specify minimum TLS version
      minVersion: 'TLSv1.2',
    }
  });

  // Add debug event listeners
  transporter.on('token', token => {
    debugLog('Token updated');
    debugLog(token);
  });

  // Verify transporter with detailed logging
  return new Promise((resolve, reject) => {
    debugLog('Attempting to verify transporter...');
    debugLog(`Using email: ${process.env.ZOHO_EMAIL_USERNAME}`);

    transporter.verify((error, success) => {
      if (error) {
        debugLog('Transporter verification failed:');
        debugLog(error);
        reject(error);
      } else {
        debugLog('Transporter verified successfully');
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

// Enhanced email sending utility
export const sendEmail = async (options) => {
  try {
    const transporter = await getTransporter();

    const emailOptions = {
      from: `"Webmark" <${process.env.ZOHO_EMAIL_USERNAME}>`,
      ...options,
    };

    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};