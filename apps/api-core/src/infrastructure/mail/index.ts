import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAILPIT_HOST || 'mailpit',
  port: parseInt(process.env.MAILPIT_PORT || '1025', 10),
  secure: false,
});

export async function sendMail(to: string, subject: string, text: string) {
  try {
    await transporter.sendMail({
      from: 'no-reply@kurajber.com',
      to,
      subject,
      text,
    });
  } catch (e) {
    throw new Error('Failed to send email');
  }
}
