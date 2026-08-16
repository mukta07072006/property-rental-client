// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWelcomeEmailProps {
  to: string;
  userName: string;
  appName?: string;
  verificationUrl?: string;
}

export async function sendWelcomeEmail({
  to,
  userName,
  appName = "YourAppName",
  verificationUrl,
}: SendWelcomeEmailProps) {
  try {
    const data = await resend.emails.send({
      from: `${appName} <onboarding@resend.dev>`,
      to: [to],
      subject: `Welcome to ${appName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Welcome to ${appName}, ${userName}!</h2>
              <p>You have successfully created an account on <strong>${appName}</strong>.</p>
              ${
                verificationUrl
                  ? `<p>Please confirm your account by clicking the link below:</p>
                     <p><a href="${verificationUrl}" style="background-color: #2563eb; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>`
                  : `<p>We're excited to have you on board!</p>`
              }
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">If you didn't request this email, you can safely ignore it.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}