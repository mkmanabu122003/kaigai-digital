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
    url: "https://px.a8.net/svt/ejp?a8mat=3TF1IO+GGEFJU+3YFI+674EQ",
    logo: "/images/services/nordvpn.png",
    price: "月額$3.39〜",
    rating: 4.8,
    features: ["7,000+サーバー", "10台同時接続", "30日返金保証"],
    bestFor: "総合力No.1、初めてのVPNに最適",
    category: "vpn",
    rank: 1,
  },
  surfshark: {
    id: "surfshark",
    name: "Surfshark",
    url: "https://get.surfshark.net/aff_c?offer_id=926&aff_id=45656",
    logo: "/images/services/surfshark.png",
    price: "月額$1.99〜",
    rating: 4.6,
    features: ["100カ国対応", "無制限台数", "30日返金保証"],
    bestFor: "コスパ最強、家族で使うならこれ",
    category: "vpn",
    rank: 2,
  },
  kabeneko: {
    id: "kabeneko",
    name: "かべネコVPN",
    url: "https://kabeneko.biz/afsys/res.php?i=KA62&t=",
    logo: "/images/services/kabeneko.png",
    price: "月額¥480〜",
    rating: 4.3,
    features: ["日本語完全対応", "中国特化", "4台同時接続"],
    bestFor: "中国駐在の日本人に最適",
    category: "vpn",
    rank: 3,
  },
  trifa: {
    id: "trifa",
    name: "トリファ",
    url: "https://px.a8.net/svt/ejp?a8mat=4B1ILK+ATZ1VE+5UDW+5ZMCH",
    logo: "/images/services/trifa.png",
    price: "1GB ¥390〜",
    rating: 4.7,
    features: ["世界200カ国対応", "日本語アプリで簡単設定", "充実の日本語サポート", "海外eSIMアプリNo.1"],
    bestFor: "海外eSIMの総合力No.1。日本語サポートで初心者でも安心",
    category: "esim",
    rank: 1,
  },
  wise: {
    id: "wise",
    name: "Wise",
    url: "https://wise.com/invite/dic/vsnmxhi",
    logo: "/images/services/wise.png",
    price: "送金手数料0.5%〜",
    rating: 4.7,
    features: ["実質為替レート", "50通貨以上対応", "マルチカレンシー口座", "紹介で最大¥11,000獲得"],
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
