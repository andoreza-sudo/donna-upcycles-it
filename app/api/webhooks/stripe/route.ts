import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { client } from "@/lib/sanity";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

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
        await client
          .patch(productId)
          .set({ status: "sold" })
          .commit();
      } catch (err) {
        console.error("Failed to mark product sold in Sanity:", err);
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "donnaupcyclesit@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "hello@donnaupcyclesit.com";

    const customerDetails = session.customer_details;
    const shippingDetails = (session as Stripe.Checkout.Session & { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }).shipping_details;

    try {
      await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `🎉 New order — ${productSlug || "product"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fffaf0; color: #1a1a1a;">
            <h1 style="font-size: 36px; margin: 0 0 8px; letter-spacing: -0.5px;">New order! ✿</h1>
            <p style="font-size: 16px; color: #5a5236; margin: 0 0 32px;">Someone just bought a piece.</p>

            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Product</h2>
              <p style="margin: 0; font-size: 15px;"><strong>Slug:</strong> ${productSlug}</p>
              <p style="margin: 4px 0 0; font-size: 15px;"><strong>Amount paid:</strong> $${((session.amount_total || 0) / 100).toFixed(2)}</p>
            </div>

            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Buyer</h2>
              <p style="margin: 0; font-size: 15px;"><strong>Name:</strong> ${customerDetails?.name || "N/A"}</p>
              <p style="margin: 4px 0 0; font-size: 15px;"><strong>Email:</strong> ${customerDetails?.email || "N/A"}</p>
            </div>

            ${shippingDetails ? `
            <div style="background: #fff; border: 2px solid #1a1a1a; border-radius: 16px; padding: 24px;">
              <h2 style="font-size: 20px; margin: 0 0 16px;">Ship to</h2>
              <p style="margin: 0; font-size: 15px;">${shippingDetails.name}</p>
              <p style="margin: 4px 0 0; font-size: 15px;">${shippingDetails.address?.line1}</p>
              ${shippingDetails.address?.line2 ? `<p style="margin: 4px 0 0; font-size: 15px;">${shippingDetails.address.line2}</p>` : ""}
              <p style="margin: 4px 0 0; font-size: 15px;">${shippingDetails.address?.city}, ${shippingDetails.address?.state} ${shippingDetails.address?.postal_code}</p>
              <p style="margin: 4px 0 0; font-size: 15px;">${shippingDetails.address?.country}</p>
            </div>
            ` : ""}
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send order notification email:", err);
    }
  }

  return NextResponse.json({ received: true });
}
