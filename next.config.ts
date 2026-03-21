import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kaigai-digital.com" }],
        destination: "https://kaigai-digital.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
