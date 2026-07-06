import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["sanity", "@sanity/vision"],
  async redirects() {
    return [
      { source: "/works", destination: "/index/works", permanent: true },
      {
        source: "/exhibitions",
        destination: "/index/exhibitions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
