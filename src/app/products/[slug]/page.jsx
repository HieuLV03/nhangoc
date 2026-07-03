import { supabase } from "@/lib/supabase";
import "./page.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton/BackButton";
import Link from "next/link";

// FIX CACHE
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published");

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    slug: item.slug,
  }));
}
export async function generateMetadata({
  params,
}) {
  const { slug } = params;

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (!data) {
    return {
      name: "Không tìm thấy sản phẩm",
    };
  }

  const name =
    data.meta_name || data.name;

  const description =
    data.meta_description ||
    data.short_description;

  const url = `/products/${data.slug}`;

  return {
    metadataBase: new URL(
      "https://thammyvienhisu.online"
    ),

    name,

    description,

    keywords: [
      data.name,
      "phun môi",
      "phun mày",
      "phun xăm thẩm mỹ",
      "thẩm mỹ viện HISU",
      "phun môi collagen",
      "phun môi TP.HCM",
    ],

    authors: [
      {
        name: "HISU Beauty",
      },
    ],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      name,

      description,

      url,

      siteName:
        "Thẩm mỹ viện HiSu",

      locale: "vi_VN",

      type: "article",

      publishedTime:
        data.created_at,

      modifiedTime:
        data.updated_at,

      images: data.image
        ? [
            {
              url: data.image,
              width: 1200,
              height: 630,
              alt: data.name,
            },
          ]
        : [],
    },

    twitter: {
      card:
        "summary_large_image",

      name,

      description,

      images: data.image
        ? [data.image]
        : [],
    },
  };
}

export default async function Page({
  params,
}) {
  const { slug } = params;

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "available")
      .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="page">
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context":
        "https://schema.org",

      "@type": "Product",

      name: data.name,

      description:
        data.short_description,

      image: [data.image],

      url: `https://thammyvienhisu.online/products/${data.slug}`,

      productType:
        data.name,

      areaProducted: {
        "@type": "City",
        name: "TP.HCM",
      },

      provider: {
        "@type":
          "BeautySalon",

        name:
          "Thẩm mỹ viện HiSu",

        url:
          "https://thammyvienhisu.online",

        logo: {
          "@type":
            "ImageObject",

          url:
            "https://thammyvienhisu.online/logo.png",
        },
      },

      offers: {
        "@type": "Offer",

        price:
          data.price || 0,

        priceCurrency:
          "VND",

        availability:
          "https://schema.org/InStock",
      },

      mainEntityOfPage: {
        "@type":
          "WebPage",

        "@id": `https://thammyvienhisu.online/products/${data.slug}`,
      },
    }),
  }}
/>
      <BackButton />

      <h1 className="name">
        {data.name}
      </h1>

  <p className="desc">
  {data.short_description}
</p>

{/* PRICE */}
{data.price && (
  <div className="priceBox">
    <span className="priceLabel">
      Giá chỉ
    </span>

    <div className="priceValue">
      {Number(data.price).toLocaleString("vi-VN")}

      <span className="currency">
        đ
      </span>
    </div>
  </div>
)}
{data.image && (
  <div className="productImageWrap">
    <Image
      src={data.image}
      alt={data.name}
      width={1200}
      height={800}
      priority
      className="productImage"
    />
  </div>
)}
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html:
            data.content || "",
        }}
      />
    </div>
  );
}