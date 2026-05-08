import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { writeClient } from "@/lib/sanity";
import { escapeHtml } from "@/lib/escape";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;
    const productSlug = session.metadata?.productSlug;

    if (productId) {
      try {
        // Idempotency: if Stripe retries this webhook, the product is
        // already marked sold and we skip the notification email.
        const before = await writeClient.fetch<{ status?: string } | null>(
          `*[_id == $id][0]{ status }`,
          { id: productId },
        );

        if (before?.status === "sold") {
          return NextResponse.json({ received: true, idempotent: true });
        }

        await writeClient.patch(productId).set({ status: "sold" }).commit();
      } catch (err) {
        console.error("Failed to mark product sold in Sanity:", err);
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "donnaupcyclesit@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "hello@donnaupcyclesit.com";

    const customerDetails = session.customer_details;
    const shippingDetails = (
      session as Stripe.Checkout.Session & {
        shipping_details?: {
          name?: string;
          address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
          };
        };
      }
    ).shipping_details;

    // Stripe-supplied fields are largely trusted, but defence-in-depth:
    // escape every interpolated value so a malformed or attacker-influenced
    // field can't break the email layout or inject markup.
    const safeSlug = escapeHtml(productSlug || "product");
    const safeAmount = ((session.amount_total || 0) / 100).toFixed(2);
    const safeName = escapeHtml(customerDetails?.name || "N/A");
    const safeEmail = escapeHtml(customerDetails?.email || "N/A");

    const shipBlock = shippingDetails
      ? `
            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Ship to</h2>
              <p style="margin: 0; font-size: 15px;">${escapeHtml(shippingDetails.name)}</p>
              <p style="margin: 4px 0 0; font-size: 15px;">${escapeHtml(shippingDetails.address?.line1)}</p>
              ${shippingDetails.address?.line2 ? `<p style="margin: 4px 0 0; font-size: 15px;">${escapeHtml(shippingDetails.address.line2)}</p>` : ""}
              <p style="margin: 4px 0 0; font-size: 15px;">${escapeHtml(shippingDetails.address?.city)}, ${escapeHtml(shippingDetails.address?.state)} ${escapeHtml(shippingDetails.address?.postal_code)}</p>
              <p style="margin: 4px 0 0; font-size: 15px;">${escapeHtml(shippingDetails.address?.country)}</p>
            </div>
          `
      : "";

    try {
      await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `🎉 New order — ${(productSlug || "product").replace(/[\r\n]/g, " ").slice(0, 80)}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fffaf0; color: #1a1a1a;">
            <h1 style="font-size: 36px; margin: 0 0 8px; letter-spacing: -0.5px;">New order! ✿</h1>
            <p style="font-size: 16px; color: #5a5236; margin: 0 0 32px;">Someone just bought a piece.</p>

            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Product</h2>
              <p style="margin: 0; font-size: 15px;"><strong>Slug:</strong> ${safeSlug}</p>
              <p style="margin: 4px 0 0; font-size: 15px;"><strong>Amount paid:</strong> $${safeAmount}</p>
            </div>

            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Buyer</h2>
              <p style="margin: 0; font-size: 15px;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 4px 0 0; font-size: 15px;"><strong>Email:</strong> ${safeEmail}</p>
            </div>

            ${shipBlock}
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send order notification email:", err);
    }
  }

  return NextResponse.json({ received: true });
}
