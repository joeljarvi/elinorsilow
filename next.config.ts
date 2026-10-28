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
  // The index and info are views of the home page ("/?view=…"). Done here,
  // not as pages calling redirect(): those prerender to no .html, which
  // breaks the Vercel build (ENOENT …/index/exhibitions.html).
  async redirects() {
    return [
      { source: "/index", destination: "/", permanent: false },
      {
        source: "/index/works",
        destination: "/?view=works",
        permanent: false,
      },
      {
        source: "/index/exhibitions",
        destination: "/?view=exhibitions",
        permanent: false,
      },
      { source: "/info", destination: "/?view=info", permanent: false },
      { source: "/works", destination: "/?view=works", permanent: true },
      {
        source: "/exhibitions",
        destination: "/?view=exhibitions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
