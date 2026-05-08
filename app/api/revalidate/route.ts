import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type: string = body._type;
    const slug: string | undefined = body.slug?.current;

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
      // Unknown type — revalidate everything
      revalidatePath("/", "layout");
    }

    // Always revalidate the sitemap
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, type, slug });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
