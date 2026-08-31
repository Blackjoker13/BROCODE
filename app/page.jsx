import { getStorefrontData } from "@/lib/storefront/getStorefrontData";
import StorefrontHome from "@/components/storefront/StorefrontHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const data = await getStorefrontData();
  const title =
    data.settings?.store_title ||
    "BROCODE — Param Collection // Merch That Hits Different";
  const description =
    data.settings?.store_tagline ||
    "Luxury oversized streetwear. Brocode Param Collection live now. 3D interactive preview.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/images/pink_floyd_banner.jpg",
          width: 1200,
          height: 630,
          alt: "Brocode Merch",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/pink_floyd_banner.jpg"],
    },
  };
}

export default function Page() {
  return <StorefrontHome />;
}
