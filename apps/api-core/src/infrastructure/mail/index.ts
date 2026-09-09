import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAILPIT_HOST || 'mailpit',
  port: parseInt(process.env.MAILPIT_PORT || '1025', 10),
  secure: false,
});

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `no-reply@${process.env.BASE_URL || 'example.com'}`,
    to,
    subject,
    html,
  });
}
