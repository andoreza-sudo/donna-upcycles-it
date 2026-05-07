import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { topic, name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "donnaupcyclesit@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "hello@donnaupcyclesit.com";

    const topicLabels: Record<string, string> = {
      custom: "Custom order",
      question: "Question about a piece",
      sizing: "Sizing help",
      other: "Something else",
    };

    await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      replyTo: email,
      subject: `New message: ${topicLabels[topic] || topic} — from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fffaf0; color: #1a1a1a;">
          <h1 style="font-size: 32px; margin: 0 0 8px; letter-spacing: -0.5px;">New message ✿</h1>
          <p style="font-size: 15px; color: #5a5236; margin: 0 0 32px;">via the contact form on donnaupcyclesit.com</p>

          <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
              <tr><td style="padding: 4px 0; color: #5a5236; width: 100px;"><strong>Topic</strong></td><td>${topicLabels[topic] || topic}</td></tr>
              <tr><td style="padding: 4px 0; color: #5a5236;"><strong>Name</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 4px 0; color: #5a5236;"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            </table>
          </div>

          <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px;">
            <h2 style="font-size: 18px; margin: 0 0 12px;">Message</h2>
            <p style="font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="font-size: 13px; color: #5a5236; margin: 24px 0 0;">Hit reply to respond directly to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
