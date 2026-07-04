import { supabase } from "@/lib/supabase";
import "./page.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton/BackButton";
import Link from "next/link";

// FIX CACHE
export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "available");

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
    data.name;

  const description =
    data.description;

  const url = `/products/${data.slug}`;

  return {
    metadataBase: new URL(
      "https://nhangoc.vercel.app"
    ),

    title:name,

    description,

    authors: [
      {
        name: "Nhà Ngọc",
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
      title:name,

      description,

      url,

      siteName:
        "Nhà Ngọc",

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

      title:name,

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
        data.description,

      image: [data.image],

      url: `https://nhangoc.vercel.app/products/${data.slug}`,

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
          "Nhà Ngọc",

        url:
          "https://nhangoc.vercel.app",

        logo: {
          "@type":
            "ImageObject",

          url:
            "https://nhangoc.vercel.app/logo.png",
        },
      },
offers: {
  "@type": "Offer",
  price: data.sale_price || data.price || 0,

        priceCurrency:
          "VND",

  availability:
data.status === "available"
? "https://schema.org/InStock"
: "https://schema.org/OutOfStock",
      },

      mainEntityOfPage: {
        "@type":
          "WebPage",

        "@id": `https://nhangoc.vercel.app/products/${data.slug}`,
      },
    }),
  }}
/>
      <BackButton />

      <h1 className="title">
        {data.name}
      </h1>

  <p className="desc">
  {data.description}
</p>

{/* PRICE */}
{data.price && (
<div className="priceBox">

  {data.sale_price !== null &&
  Number(data.sale_price) > 0 ? (
    <>
      <span className="priceLabel">
        Giá khuyến mãi
      </span>

      <div className="priceRow">

        <div className="priceSale">
          {Number(data.sale_price).toLocaleString("vi-VN")}
          <span className="currency">đ</span>
        </div>

        <div className="priceOld">
          {Number(data.price).toLocaleString("vi-VN")}đ
        </div>

      </div>
    </>
  ) : (
    <>
      <span className="priceLabel">
        Giá
      </span>

      <div className="priceSale">
        {Number(data.price).toLocaleString("vi-VN")}
        <span className="currency">đ</span>
      </div>
    </>
  )}

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