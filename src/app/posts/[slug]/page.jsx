import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import "./page.css"
import Image from "next/image";
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  return data.map((item) => ({
    slug: item.slug,
  }));
}
export async function generateMetadata({
  params,
}) {
  const { slug } = params;

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    return {
      title: "Không tìm thấy bài viết",
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
    data.description,

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: `/posts/${data.slug}`,
  },

  openGraph: {
    title:
      data.meta_title ||
      data.title,

    description:
      data.meta_description ||
      data.description,

    url: `/posts/${data.slug}`,

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
      data.description,

    images: data.image
      ? [data.image]
      : [],
  },
};
}

export default async function PostPage({
  params,
}) {
  const { slug } = params;

  const { data, error } =
    await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq(
        "status",
        "published"
      )
      .single();

  if (error || !data) {
    return (
      <div>
        ❌ Không tìm thấy bài viết
      </div>
    );
  }

return (
  <div className="postPage">
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image,
      author: {
        "@type": "Organization",
        name: "Thẩm mỹ viện HiSu",
      },
      publisher: {
        "@type": "Organization",
        name: "Thẩm mỹ viện HiSu",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://thammyvienhisu.online/posts/${data.slug}`,
      },
    }),
  }}
/>
    <BackButton />

    <div className="postContainer">

      <h1>{data.title}</h1>

      <p className="desc">
        {data.description}
      </p>

<div className="postImageWrap">
  <Image
    src={data.image}
    alt={data.title}
    width={1200}
    height={800}
    priority
    className="postImage"
  />
</div>
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: data.content || "",
        }}
      />
    </div>
  </div>
);
}