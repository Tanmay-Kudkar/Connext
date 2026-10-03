import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.SMTP_FROM || "noreply@connext.edu";

let transporter: nodemailer.Transporter | null = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Connext" <${fromEmail}>`,
        to,
        subject: "Your Connext Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; text-align: center;">
            <div style="background: #111; border-radius: 16px; padding: 40px;">
              <h2 style="color: #fff; margin-bottom: 8px;">Verify your academic identity</h2>
              <p style="color: #999; margin-bottom: 32px;">Your one-time verification code for Connext</p>
              <div style="font-size: 40px; letter-spacing: 12px; color: #fff; background: #222; padding: 20px; border-radius: 12px; font-family: monospace; font-weight: bold;">${otp}</div>
              <p style="color: #666; margin-top: 24px; font-size: 14px;">This code expires in 10 minutes. Do not share it.</p>
            </div>
          </div>
        `,
      });
      console.log(`[email] ✅ OTP sent to ${to} via SMTP`);
    } catch (err) {
      // Log the error but don't crash the request – fall through to console fallback
      console.error(`[email] ❌ SMTP failed, falling back to console:`, (err as Error).message);
      console.log("\n==============================================");
      console.log(`[EMAIL FALLBACK] To: ${to}`);
      console.log(`[EMAIL FALLBACK] Verification Code: ${otp}`);
      console.log("==============================================\n");
    }
  } else {
    // No SMTP configured – print to console
    console.log("\n==============================================");
    console.log(`[EMAIL MOCK] To: ${to}`);
    console.log(`[EMAIL MOCK] Verification Code: ${otp}`);
    console.log("==============================================\n");
  }
}
