/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.elinorsilow.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
