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
  // The works / exhibitions / info views live at /works, /exhibitions and
  // /info. They used to be under /index/…, which can't work on Vercel (its
  // Next.js runtime reads "/index/x" as "/x" and 404s). Old /index/… links
  // are rewritten, not redirected: browsers may have cached the old
  // permanent /works → /index/works redirect, and a redirect back would loop.
  async redirects() {
    return [{ source: "/index", destination: "/works", permanent: false }];
  },
  async rewrites() {
    return [
      {
        source: "/index/:view(works|exhibitions|info)",
        destination: "/:view",
      },
    ];
  },
};

export default nextConfig;
