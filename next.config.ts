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
      // ── 記事統廃合による301（2026-08-06）──
      // 同一トピックで重複していた記事を統合。統合元の評価を統合先へ引き継ぐ。
      { source: "/korea/esim-chiebukuro", destination: "/korea/sim-chiebukuro", permanent: true },
      { source: "/guide/korea-esim-chiebukuro", destination: "/korea/sim-chiebukuro", permanent: true },
      { source: "/taiwan/sim-chiebukuro", destination: "/taiwan/esim-chiebukuro", permanent: true },
      { source: "/china/line-chiebukuro", destination: "/china/line-vpn", permanent: true },
      { source: "/china/banking-chiebukuro", destination: "/china/banking-access", permanent: true },
      { source: "/guide/japan-streaming-abroad", destination: "/compare/streaming-vpn", permanent: true },
      { source: "/guide/free-wifi-danger-chiebukuro", destination: "/guide/hotel-wifi-safety", permanent: true },
    ];
  },
};

export default nextConfig;
