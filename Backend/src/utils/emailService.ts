import nodemailer from 'nodemailer';
import { logger } from './logger';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set');
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - CoinVista',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your CoinVista account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          This link will expire in 1 hour for security reasons.
        </p>
        <p style="font-size: 14px; color: #666;">
          If you didn't request this password reset, please ignore this email and your password will remain unchanged.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          This email was sent by CoinVista. Please do not reply to this email.
        </p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hello,
      
      You have requested to reset your password for your CoinVista account.
      
      Please visit the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email and your password will remain unchanged.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${email}`);
  } catch (error) {
    logger.error(error, 'Error sending password reset email');
    throw new Error('Failed to send password reset email');
  }
}