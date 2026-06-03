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

  // SERVICES
  const {
    data: services,
    error: serviceError,
  } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("status", "published");

  // ERROR
  if (postError || serviceError) {
    return [
      {
        url: "https://thammyvienhisu.online",
        lastModified: new Date().toISOString(),
      },
    ];
  }

  // POSTS URLS
  const postUrls = (posts || []).map((post) => ({
    url: `https://thammyvienhisu.online/posts/${post.slug}`,
    lastModified: safeDate(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // SERVICES URLS
  const serviceUrls = (services || []).map((service) => ({
    url: `https://thammyvienhisu.online/services/${service.slug}`,
    lastModified: safeDate(service.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: "https://thammyvienhisu.online",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: "https://thammyvienhisu.online/posts",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: "https://thammyvienhisu.online/services",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...postUrls,
    ...serviceUrls,
  ];
}