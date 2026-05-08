import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,80})$/i;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const provided = req.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected || !provided || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type: string | undefined = body?._type;
    const rawSlug: unknown = body?.slug?.current;
    const slug = typeof rawSlug === "string" && SLUG_RE.test(rawSlug) ? rawSlug : null;

    if (type === "product") {
      revalidatePath("/");
      revalidatePath("/shop");
      if (slug) revalidatePath(`/shop/${slug}`);
    } else if (type === "journalPost") {
      revalidatePath("/");
      revalidatePath("/journal");
      if (slug) revalidatePath(`/journal/${slug}`);
    } else if (type === "siteSettings") {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/contact");
    } else {
      revalidatePath("/", "layout");
    }

    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, type, slug });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
