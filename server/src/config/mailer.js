import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(env.SMTP_PORT) || 587,
  auth: {
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log(`✉️ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Mailer error sending to ${to}:`, error.message);
    // Silent fail in dev if SMTP credentials are mock
    if (env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] Mock Mail content for ${to}:\nSubject: ${subject}\nHTML: ${html}`);
    } else {
      throw error;
    }
  }
};
