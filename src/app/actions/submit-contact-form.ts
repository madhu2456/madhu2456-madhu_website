"use server";

// Email delivery via Resend (HTTPS API — not SMTP, so DigitalOcean port blocks don't apply).
// Setup: pnpm add resend
// Env vars needed in .env.local / production:
//   RESEND_API_KEY=re_xxxxxxxxxxxx        (from resend.com → API Keys)
//   CONTACT_FORM_TO=madhu.kumar245@gmail.com
//   CONTACT_FORM_FROM=noreply@madhudadi.in  (optional; requires domain verified on Resend)

type SubmitResult =
  | { success: true; data?: { submittedAt: string } }
  | { success: false; error: string };

type ResendPayload = {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
};

async function sendViaResend(payload: ResendPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

function buildEmailHtml(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}) {
  const { name, email, subject, message, submittedAt } = opts;
  const escapedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0f0f0f;padding:28px 32px;">
            <p style="margin:0;font-size:13px;color:#888;letter-spacing:0.05em;text-transform:uppercase;">Portfolio Contact</p>
            <h1 style="margin:4px 0 0;font-size:22px;font-weight:600;color:#ffffff;">New message from ${name}</h1>
          </td>
        </tr>
        <!-- Details -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;width:90px;color:#888;font-size:13px;vertical-align:top;">From</td>
                <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">
                  <strong>${name}</strong> &nbsp;<a href="mailto:${email}" style="color:#6366f1;text-decoration:none;">${email}</a>
                </td>
              </tr>
              ${
                subject
                  ? `<tr>
                <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;vertical-align:top;">Subject</td>
                <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">${subject}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;vertical-align:top;">Received</td>
                <td style="padding:8px 0;font-size:14px;color:#111;">${new Date(submittedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Message body -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <div style="background:#f9f9f9;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:16px 20px;font-size:15px;line-height:1.7;color:#333;">
              ${escapedMessage}
            </div>
          </td>
        </tr>
        <!-- Reply CTA -->
        <tr>
          <td style="padding:0 32px 32px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || `Your message to madhudadi.in`)}"
               style="display:inline-block;background:#0f0f0f;color:#fff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px;">
              Reply to ${name} &rarr;
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:12px;color:#aaa;">Sent via the contact form on <a href="https://madhudadi.in" style="color:#6366f1;text-decoration:none;">madhudadi.in</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function submitContactForm(
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — bots fill hidden fields
  if (formData.get("hp_field")) {
    return { success: true };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  const submittedAt = new Date().toISOString();

  console.info("[contact-form] submission", {
    submittedAt,
    name,
    email,
    subject,
    messageLength: message.length,
  });

  const toEmail = process.env.CONTACT_FORM_TO;
  const fromEmail =
    process.env.CONTACT_FORM_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (process.env.RESEND_API_KEY && toEmail) {
    try {
      await sendViaResend({
        from: fromEmail,
        to: [toEmail],
        reply_to: `${name} <${email}>`,
        subject: subject
          ? `[madhudadi.in] ${subject}`
          : `[madhudadi.in] New message from ${name}`,
        html: buildEmailHtml({ name, email, subject, message, submittedAt }),
      });
      console.info("[contact-form] email sent via Resend to", toEmail);
    } catch (err) {
      // Log but don't surface the error to the visitor — form still succeeds.
      console.error("[contact-form] Resend delivery failed", err);
    }
  } else {
    console.warn(
      "[contact-form] RESEND_API_KEY or CONTACT_FORM_TO not set — email skipped",
    );
  }

  return { success: true, data: { submittedAt } };
}
