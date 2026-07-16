import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

import "./page.css"
import Image from "next/image";
export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("posts")
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
            name: "Trà sữa Nhà Ngọc",
          },
          publisher: {
            "@type": "Organization",
            name: "Trà Sữa Nhà Ngọc",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://nhangoc.vercel.app/posts/${data.slug}`,
          },
        }),
      }}
    />


    <BackButton />


    <div className="postContainer">


      <ScrollReveal>

        <h1>
          {data.title}
        </h1>


        <p className="desc">
          {data.description}
        </p>

      </ScrollReveal>



      <ScrollReveal delay={0.15}>


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


      </ScrollReveal>



      <ScrollReveal delay={0.25}>


        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html:data.content || "",
          }}
        />


      </ScrollReveal>



    </div>


  </div>
);
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
        name: "Trà sữa Nhà Ngọc",
      },
      publisher: {
        "@type": "Organization",
        name: "Trà sữa Nhà Ngọc",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://nhangoc.vercel.app/posts/${data.slug}`,
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