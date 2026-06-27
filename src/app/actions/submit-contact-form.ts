"use server";

import { headers } from "next/headers";
import { resolveSiteUrl } from "@/lib/site-url";

// Email delivery via Resend (HTTPS API - not SMTP, so DigitalOcean port blocks don't apply).

// Env vars needed in .env.local / production:
//   RESEND_API_KEY=re_xxxxxxxxxxxx        (from resend.com → API Keys)
//   CONTACT_FORM_TO=madhu.kumar245@gmail.com
//   CONTACT_FORM_FROM=noreply@madhudadi.in  (optional; requires domain verified on Resend)

type SubmitResult =
  | { success: true; data?: { submittedAt: string } }
  | { success: false; error: string };

// Basic in-memory rate limiting for contact form
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    if (record) rateLimitMap.delete(ip); // Evict expired

    // Bounded eviction: cap memory usage on long-lived servers.
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      const evictCount = MAX_RATE_LIMIT_ENTRIES >> 2; // evict 25%
      let evicted = 0;
      for (const key of rateLimitMap.keys()) {
        if (evicted >= evictCount) break;
        rateLimitMap.delete(key);
        evicted++;
      }
    }

    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend API error ${res.status}: ${body}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}) {
  const name = escapeHtml(opts.name);
  const email = escapeHtml(opts.email);
  const subject = escapeHtml(opts.subject);
  const submittedAt = opts.submittedAt;
  const escapedMessage = escapeHtml(opts.message).replace(/\n/g, "<br>");

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
                   <p style="margin:0;font-size:12px;color:#aaa;">Sent via the contact form on <a href="${resolveSiteUrl()}/" style="color:#6366f1;text-decoration:none;">${resolveSiteUrl().replace(/^https?:\/\//, "")}</a></p>
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
  // Honeypot - bots fill hidden fields. Check before rate limiting so bots
  // don't waste rate-limit slots on real users.
  if (formData.get("hp_field")) {
    return { success: true };
  }

  // When hosted behind a proxy, x-forwarded-for may contain multiple IPs. Extract the first one.
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";

  if (isRateLimited(ip)) {
    return {
      success: false,
      error: "Too many submissions. Please try again in 10 minutes.",
    };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (name.length > 200) {
    return {
      success: false,
      error: "Name is too long. Maximum 200 characters.",
    };
  }

  if (subject.length > 300) {
    return {
      success: false,
      error: "Subject is too long. Maximum 300 characters.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (message.length > 5000) {
    return {
      success: false,
      error: "Message is too long. Maximum 5000 characters.",
    };
  }

  const submittedAt = new Date().toISOString();

  console.info("[contact-form] submission", {
    submittedAt,
    messageLength: message.length,
  });

  const toEmail = process.env.CONTACT_FORM_TO;
  const fromEmail =
    process.env.CONTACT_FORM_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY || !toEmail) {
    return {
      success: false,
      error:
        "Contact delivery is not configured on this environment. Please reach out directly via email or LinkedIn.",
    };
  }

  try {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional control-char stripping for email header injection prevention
    const sanitizedName = name.replace(/[\r\n<>"\x00-\x1f]/g, "");
    // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional control-char stripping for email header injection prevention
    const sanitizedEmail = email.replace(/[\r\n<>"\x00-\x1f]/g, "");
    // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional control-char stripping for email header injection prevention
    const sanitizedSubject = subject.replace(/[\r\n<>"\x00-\x1f]/g, "").trim();

    await sendViaResend({
      from: fromEmail,
      to: [toEmail],
      reply_to: `${sanitizedName} <${sanitizedEmail}>`,
      subject: sanitizedSubject
        ? `[madhudadi.in] ${sanitizedSubject}`
        : `[madhudadi.in] New message from ${sanitizedName}`,
      html: buildEmailHtml({ name, email, subject, message, submittedAt }),
    });
    console.info("[contact-form] email sent via Resend to", toEmail);
  } catch (err) {
    console.error("[contact-form] Resend delivery failed", err);
    return {
      success: false,
      error:
        "Message could not be sent right now. Please try again later or contact directly via email.",
    };
  }

  return { success: true, data: { submittedAt } };
}
