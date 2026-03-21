export const siteConfig = {
  name: "Kaigai Digital",
  nameJa: "海外デジタル",
  url: "https://kaigai-digital.com",
  description:
    "海外渡航者のネット・デジタル環境を国別に完全ガイド。VPN・eSIM・送金・保険を徹底比較。",
  author: {
    name: "編集部",
    role: "Kaigai Digital 編集部",
    bio: "海外渡航のデジタル環境に精通した編集チーム。VPN・eSIM・送金・保険などを実地検証し、最新情報をお届けします。",
  },
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXXX",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://kaigai-digital.com",
} as const;
