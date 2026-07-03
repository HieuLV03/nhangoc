/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crmznirqgmumozfmuyiv.supabase.co",
      },
    ],
  },
};

export default nextConfig;