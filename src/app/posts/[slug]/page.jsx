import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import "./page.css"
import Image from "next/image";
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (!data || data.length === 0) return [];

  return data.map((item) => ({
    slug: item.slug,
  }));
}
export async function generateMetadata({
  params,
}) {
const slug = params?.slug;
if (!slug) return notFound();
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
    title:
      data.meta_title ||
      data.title,

    description:
      data.meta_description ||
      data.description,

    alternates: {
      canonical: `https://thammyvienhisu.online/posts/${data.slug}`,
    },

    openGraph: {
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
      .maybeSingle();

  if (error || !data) {
    return (
      <div>
        ❌ Không tìm thấy bài viết
      </div>
    );
  }

return (
  <div className="postPage">
    
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
    fill
    priority
    sizes="100vw"
    style={{
      objectFit: "cover",
    }}
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