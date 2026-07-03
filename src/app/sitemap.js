import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

function safeDate(dateString) {
  if (!dateString) return new Date().toISOString();

  const date = new Date(dateString);

  return isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

export default async function sitemap() {
  // POSTS
  const { data: posts, error: postError } =
    await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

  const {
    data: products,
    error: productError,
  } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "published");

  // ERROR
  if (postError || productError) {
    return [
      {
      url: "https://nhangoc.vercel.app",
        lastModified: new Date().toISOString(),
      },
    ];
  }

  // POSTS URLS
  const postUrls = (posts || []).map((post) => ({
    url: `https://nhangoc.vercel.app/posts/${post.slug}`,
    lastModified: safeDate(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productUrls = (products || []).map((product) => ({
    url: `https://nhangoc.vercel.app/products/${product.slug}`,
    lastModified: safeDate(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

return [
  {
    url: "https://nhangoc.vercel.app",
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 1,
  },

  {
    url: "https://nhangoc.vercel.app/about",
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  },

  {
    url: "https://nhangoc.vercel.app/contact",
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  },

  {
    url: "https://nhangoc.vercel.app/booking",
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    url: "https://nhangoc.vercel.app/posts",
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.9,
  },

  {
    url: "https://nhangoc.vercel.app/products",
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.9,
  },

  ...postUrls,
  ...productUrls,
];
}