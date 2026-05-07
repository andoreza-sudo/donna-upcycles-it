import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/queries";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Product slug required" }, { status: 400 });
    }

    const product = await getProduct(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.status === "sold" || product.status === "reserved") {
      return NextResponse.json({ error: "Product is no longer available" }, { status: 410 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
              images: product.photos?.[0]?.asset?._ref
                ? [`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${product.photos[0].asset._ref.replace("image-", "").replace(/-([a-z]+)$/, ".$1")}`]
                : [],
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
      success_url: `${siteUrl}/shop/${slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/${slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
