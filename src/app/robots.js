export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap:
      "https://nhangoc.vercel.app/sitemap.xml",
  };
}