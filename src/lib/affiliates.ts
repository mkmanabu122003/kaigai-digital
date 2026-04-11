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
  /** 編集部による実利用期間 (E-E-A-T シグナル) */
  editorUsage?: string;
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
    editorUsage: "編集部が検証用2年プラン契約・複数国でテスト",
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
    editorUsage: "編集部が21日間無料トライアル後継続利用",
  },
  airalo: {
    id: "airalo",
    name: "Airalo",
    url: "https://airalo.com/?ref=XXXXX",
    logo: "/images/services/airalo.png",
    price: "$3.50〜",
    rating: 4.5,
    features: ["200カ国以上対応", "即日利用可能", "アプリで簡単設定"],
    bestFor: "海外eSIMの定番、短期旅行に最適",
    category: "esim",
    rank: 1,
    editorUsage: "編集部が10カ国以上で実利用・速度測定済み",
  },
  trifa: {
    id: "trifa",
    name: "トリファ",
    url: "https://px.a8.net/svt/ejp?a8mat=4B1ILK+ATZ1VE+5UDW+5ZMCH",
    logo: "/images/services/trifa.png",
    price: "1GB ¥390〜",
    rating: 4.6,
    features: ["世界200カ国対応", "日本語アプリで簡単設定", "充実の日本語サポート", "海外eSIMアプリNo.1"],
    bestFor: "初めての海外eSIMで日本語サポートを重視する人",
    category: "esim",
    rank: 2,
    editorUsage: "編集部が日本語UIとサポート品質を確認",
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
    editorUsage: "編集部が3年以上利用・毎月の海外送金で実コスト検証",
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
