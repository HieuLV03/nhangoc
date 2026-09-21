import { supabase } from "@/lib/supabase";

export const revalidate = 600;

const BASE_URL = "https://nhangoc.vercel.app";

function safeDate(dateString) {
  if (!dateString) {
    return new Date();
  }

  const date = new Date(dateString);

  return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap() {
  // =========================
  // POSTS
  // =========================
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");

  // =========================
  // PRODUCTS
  // =========================
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "published");

  // =========================
  // ERROR
  // =========================
  if (postError || productError) {
    console.error("Sitemap error:", {
      postError,
      productError,
    });

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }

  // =========================
  // POSTS
  // =========================
  const postUrls = (posts || []).map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: safeDate(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // =========================
  // PRODUCTS
  // =========================
  const productUrls = (products || []).map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: safeDate(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // =========================
  // STATIC PAGES
  // =========================
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/booking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // =========================
  // RETURN
  // =========================
  return [
    ...staticUrls,
    ...postUrls,
    ...productUrls,
  ];
}