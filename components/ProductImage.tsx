import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ProductPlaceholder } from "./ProductPlaceholder";

type Tone = "denim" | "indigo" | "cream" | "rust" | "sage" | "coral" | "bone";

interface Photo {
  asset?: { _ref?: string };
  alt?: string;
}

interface ProductImageProps {
  photo?: Photo;
  alt?: string;
  aspect?: string;
  placeholderTone?: Tone;
  placeholderLabel?: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

export function ProductImage({
  photo,
  alt = "product photo",
  aspect = "4 / 5",
  placeholderTone = "denim",
  placeholderLabel = "product photo",
  className = "",
  width = 800,
  height = 1000,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProductImageProps) {
  if (photo?.asset?._ref) {
    return (
      <div className={className} style={{ aspectRatio: aspect, position: "relative", width: "100%" }}>
        <Image
          src={urlFor(photo).width(width).height(height).url()}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <ProductPlaceholder
      label={placeholderLabel}
      tone={placeholderTone}
      aspect={aspect}
      className={className}
    />
  );
}
