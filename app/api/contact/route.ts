import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/escape";

const TOPIC_LABELS: Record<string, string> = {
  custom: "Custom order",
  question: "Question about a piece",
  sizing: "Sizing help",
  other: "Something else",
};

const NAME_MAX = 120;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

// Very rough email shape check — Resend will reject anything truly invalid.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { topic, name, email, message } = body as Record<string, unknown>;

    // Type + length validation
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (
      trimmedName.length === 0 || trimmedName.length > NAME_MAX ||
      trimmedEmail.length === 0 || trimmedEmail.length > EMAIL_MAX ||
      trimmedMessage.length === 0 || trimmedMessage.length > MESSAGE_MAX
    ) {
      return NextResponse.json({ error: "Invalid input lengths" }, { status: 400 });
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const safeTopic = typeof topic === "string" && TOPIC_LABELS[topic]
      ? TOPIC_LABELS[topic]
      : "Other";

    const resend = new Resend(process.env.RESEND_API_KEY);
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "donnaupcyclesit@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "hello@donnaupcyclesit.com";

    // ALL user-supplied values are escaped before being interpolated into HTML
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);
    const safeSubjectName = trimmedName.replace(/[\r\n]/g, " ").slice(0, 80);
    const safeSubjectTopic = safeTopic.replace(/[\r\n]/g, " ");

    await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      replyTo: trimmedEmail,
      subject: `New message: ${safeSubjectTopic} — from ${safeSubjectName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fffaf0; color: #1a1a1a;">
          <h1 style="font-size: 32px; margin: 0 0 8px; letter-spacing: -0.5px;">New message ✿</h1>
          <p style="font-size: 15px; color: #5a5236; margin: 0 0 32px;">via the contact form on donnaupcyclesit.com</p>

          <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
              <tr><td style="padding: 4px 0; color: #5a5236; width: 100px;"><strong>Topic</strong></td><td>${escapeHtml(safeTopic)}</td></tr>
              <tr><td style="padding: 4px 0; color: #5a5236;"><strong>Name</strong></td><td>${safeName}</td></tr>
              <tr><td style="padding: 4px 0; color: #5a5236;"><strong>Email</strong></td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            </table>
          </div>

          <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px;">
            <h2 style="font-size: 18px; margin: 0 0 12px;">Message</h2>
            <p style="font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>

          <p style="font-size: 13px; color: #5a5236; margin: 24px 0 0;">Hit reply to respond directly to ${safeName}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
