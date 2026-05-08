import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const body = await req.json().catch(() => null);
    const slug = body && typeof body === "object" ? (body as { slug?: unknown }).slug : null;

    if (typeof slug !== "string" || slug.length === 0 || slug.length > 200) {
      return NextResponse.json({ error: "Invalid product slug" }, { status: 400 });
    }

    const product = await getProduct(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.status === "sold" || product.status === "reserved") {
      return NextResponse.json({ error: "Product is no longer available" }, { status: 410 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Build the Stripe-facing image URL via the official Sanity image
    // builder rather than hand-assembling CDN paths (the previous approach
    // could break for non-jpg/png assets and double-encoded refs).
    let primaryImage: string | undefined;
    const firstPhoto = product.photos?.[0];
    if (firstPhoto?.asset?._ref) {
      try {
        primaryImage = urlFor(firstPhoto).width(800).height(1000).url();
      } catch {
        primaryImage = undefined;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title || "Donna Upcycles It Product",
              description: product.description?.slice(0, 500),
              images: primaryImage ? [primaryImage] : [],
            },
            unit_amount: Math.round((product.price || 0) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: product._id,
        productSlug: slug,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      success_url: `${siteUrl}/shop/${encodeURIComponent(slug)}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/${encodeURIComponent(slug)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
