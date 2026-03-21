export type AffiliateCategory =
  | "vpn"
  | "esim"
  | "remittance"
  | "insurance"
  | "sim"
  | "wifi";

export type AffiliateService = {
  id: string;
  name: string;
  url: string;
  logo: string;
  price: string;
  rating: number;
  features: string[];
  bestFor: string;
  category: AffiliateCategory;
  rank?: number;
};

export const affiliateLinks: Record<string, AffiliateService> = {
  nordvpn: {
    id: "nordvpn",
    name: "NordVPN",
    url: "https://nordvpn.com/ja/?ref=XXXXX",
    logo: "/images/services/nordvpn.png",
    price: "月額$3.49〜",
    rating: 4.8,
    features: ["5,000+サーバー", "6台同時接続", "30日返金保証"],
    bestFor: "総合力No.1、初めてのVPNに最適",
    category: "vpn",
    rank: 1,
  },
  surfshark: {
    id: "surfshark",
    name: "Surfshark",
    url: "https://surfshark.com/ja/?ref=XXXXX",
    logo: "/images/services/surfshark.png",
    price: "月額$2.49〜",
    rating: 4.6,
    features: ["100カ国対応", "無制限台数", "30日返金保証"],
    bestFor: "コスパ最強、家族で使うならこれ",
    category: "vpn",
    rank: 2,
  },
  kabeneko: {
    id: "kabeneko",
    name: "かべネコVPN",
    url: "https://kabeneko.com/?ref=XXXXX",
    logo: "/images/services/kabeneko.png",
    price: "月額¥480〜",
    rating: 4.3,
    features: ["日本語完全対応", "中国特化", "4台同時接続"],
    bestFor: "中国駐在の日本人に最適",
    category: "vpn",
    rank: 3,
  },
  airalo: {
    id: "airalo",
    name: "Airalo",
    url: "https://airalo.com/?ref=XXXXX",
    logo: "/images/services/airalo.png",
    price: "$4.50〜",
    rating: 4.5,
    features: ["200カ国以上対応", "即日利用可能", "アプリで簡単設定"],
    bestFor: "海外eSIMの定番、短期旅行に最適",
    category: "esim",
    rank: 1,
  },
  wise: {
    id: "wise",
    name: "Wise",
    url: "https://wise.com/?ref=XXXXX",
    logo: "/images/services/wise.png",
    price: "送金手数料0.5%〜",
    rating: 4.7,
    features: ["実質為替レート", "50通貨以上対応", "マルチカレンシー口座"],
    bestFor: "海外送金の手数料を最安に抑えたい人",
    category: "remittance",
    rank: 1,
  },
};

export function getServicesByCategory(
  category: AffiliateCategory
): AffiliateService[] {
  return Object.values(affiliateLinks)
    .filter((s) => s.category === category)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}

export function getServiceById(id: string): AffiliateService | undefined {
  return affiliateLinks[id];
}
