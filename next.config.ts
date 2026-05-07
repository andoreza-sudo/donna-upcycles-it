import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  // Required for Sanity Studio embed
  transpilePackages: ["next-sanity"],
};

export default nextConfig;
