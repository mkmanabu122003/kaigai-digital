export type AffiliateCategory =
  | "vpn"
  | "esim"
  | "remittance"
  | "insurance"
  | "sim"
  | "wifi"
  | "credit-card";

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
  ctaText?: { top?: string; middle?: string; bottom?: string };
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
    ctaText: {
      top: "NordVPNを30日間リスクなしで試す",
      middle: "30日以内なら全額返金で試す",
      bottom: "NordVPNを試す（30日以内全額返金）",
    },
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
    ctaText: {
      top: "Surfsharkを30日返金保証で試す（月額$1.99〜）",
      middle: "Surfsharkを月額$1.99〜で始める",
      bottom: "Surfsharkを30日返金保証で試す",
    },
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
    ctaText: {
      top: "トリファを1GB ¥390〜で始める（日本語サポート）",
      middle: "トリファのeSIMを購入する",
      bottom: "トリファを1GB ¥390〜で試す",
    },
  },
  epos: {
    id: "epos",
    name: "エポスカード",
    url: "https://px.a8.net/svt/ejp?a8mat=4B1ILK+5K1RWA+38L8+61C2P",
    logo: "/images/services/epos.png",
    price: "年会費永年無料",
    rating: 4.5,
    features: ["海外旅行保険が自動で充実", "疾病治療270万円（年会費無料カード最高水準）", "海外ATMキャッシング対応", "即日発行可能"],
    bestFor: "海外渡航者のサブカードに最適。年会費無料で旅行保険が充実",
    category: "credit-card",
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
    ctaText: {
      top: "Wiseに無料登録する（紹介で最大¥11,000獲得）",
      middle: "Wiseを無料で始める",
      bottom: "Wise公式サイトで登録する",
    },
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
