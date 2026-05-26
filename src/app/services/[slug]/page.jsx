import { supabase } from "@/lib/supabase";
import "./page.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton/BackButton";

// FIX CACHE
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("status", "published");

  return data.map((item) => ({
    slug: item.slug,
  }));
}
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
      .eq("status", "published")
    .maybeSingle();

  if (!data) {
    return {
      title: "Không tìm thấy dịch vụ",
    };
  }
return {
  metadataBase: new URL(
    "https://thammyvienhisu.online"
  ),

  title:
    data.meta_title ||
    data.title,

  description:
    data.meta_description ||
    data.short_description,

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: `/services/${data.slug}`,
  },

  openGraph: {
    title:
      data.meta_title ||
      data.title,

    description:
      data.meta_description ||
      data.short_description,

    url: `/services/${data.slug}`,

    siteName:
      "Thẩm mỹ viện HiSu",

    locale: "vi_VN",

    type: "article",

    images: data.image
      ? [
          {
            url: data.image,
            width: 1200,
            height: 630,
          },
        ]
      : [],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      data.meta_title ||
      data.title,

    description:
      data.meta_description ||
      data.short_description,

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
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
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
      "@context": "https://schema.org",
      "@type": "Service",

      name: data.title,

      description:
        data.short_description,

      image: data.image,

      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://thammyvienhisu.online/services/${data.slug}`,
      },

      provider: {
        "@type": "BeautySalon",

        name: "Thẩm mỹ viện HiSu",

        url: "https://thammyvienhisu.online",
      },

      areaServed: {
        "@type": "Country",
        name: "Việt Nam",
      },
    }),
  }}
/>
      <BackButton />

      <h1 className="title">
        {data.title}
      </h1>

  <p className="desc">
  {data.short_description}
</p>

{/* PRICE */}
{data.price && (
  <div className="priceBox">
    <span className="priceLabel">
      Giá dịch vụ
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
  <div className="detailImageWrap">
    <Image
      src={data.image}
      alt={data.title}
      width={1200}
      height={800}
      priority
      className="detailImage"
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