import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create a transporter using SMTP
// For Gmail, users might need an App Password if 2FA is on
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"WanderWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your WanderWallet Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Welcome to WanderWallet! 🧳</h2>
                <p>Hello,</p>
                <p>Thank you for signing up. Please verify your email address to activate your account and start planning your dream trips.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                </div>
                <p style="font-size: 12px; color: #666; text-align: center;">If the button doesn't work, copy this link: <br> ${verificationUrl}</p>
                <p style="text-align: center; color: #888;">&copy; ${new Date().getFullYear()} WanderWallet</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"WanderWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your WanderWallet Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Need a password reset? 🔒</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to choose a new one.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="font-size: 14px; text-align: center; color: #555;">This link expires in 1 hour.</p>
                <p style="font-size: 12px; color: #666; text-align: center;">If you didn't ask for this, ignore this email.</p>
                <p style="text-align: center; color: #888;">&copy; ${new Date().getFullYear()} WanderWallet</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
