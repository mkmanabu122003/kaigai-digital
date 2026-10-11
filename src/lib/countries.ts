export type Country = {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  region: string;
  internetRestriction: number; // 1-5 (5=最も厳しい)
  description: string;
  vpnNotice?: {
    heading: string;
    body: string;
    serviceId: string;
    ctaText?: string;
  };
};

export const countries: Country[] = [
  {
    id: "china",
    name: "中国",
    nameEn: "China",
    flag: "🇨🇳",
    region: "アジア",
    internetRestriction: 5,
    description:
      "グレートファイアウォールにより、Google・LINE・YouTube等が規制。VPN必須。",
    vpnNotice: {
      heading: "中国ではVPNが必須",
      body: "中国ではLINE・Google・YouTubeなどが規制されている。渡航前にVPNを準備しよう。かべネコVPNなら21日間無料で試せる（クレカ不要・自動課金なし）。",
      serviceId: "kabeneko",
      ctaText: "かべネコVPNを21日間無料で試す（クレカ不要）",
    },
  },
  {
    id: "thailand",
    name: "タイ",
    nameEn: "Thailand",
    flag: "🇹🇭",
    region: "アジア",
    internetRestriction: 2,
    description:
      "基本的に自由。一部サイトのブロックあり。eSIM・現地SIMが便利。",
  },
  {
    id: "vietnam",
    name: "ベトナム",
    nameEn: "Vietnam",
    flag: "🇻🇳",
    region: "アジア",
    internetRestriction: 3,
    description:
      "SNSは利用可能だが一部規制あり。VPNがあると安心。eSIMも普及中。",
  },
  {
    id: "korea",
    name: "韓国",
    nameEn: "South Korea",
    flag: "🇰🇷",
    region: "アジア",
    internetRestriction: 1,
    description: "ネット環境は自由で高速。eSIM・Wi-Fiレンタルが便利。",
  },
  {
    id: "taiwan",
    name: "台湾",
    nameEn: "Taiwan",
    flag: "🇹🇼",
    region: "アジア",
    internetRestriction: 1,
    description:
      "ネット規制なし。現地SIM・eSIMが安くて便利。フリーWi-Fiも充実。",
  },
  {
    id: "uae",
    name: "UAE（ドバイ）",
    nameEn: "UAE",
    flag: "🇦🇪",
    region: "中東",
    internetRestriction: 4,
    description:
      "VoIP通話（LINE通話等）が規制。VPNで回避可能だが法的グレーゾーン。",
    vpnNotice: {
      heading: "UAEでは通話アプリに注意",
      body: "UAEではLINE・WhatsAppなどの音声・ビデオ通話（VoIP）が規制されている。メッセージ送信やWeb閲覧は基本的に利用できる。VPNの利用には法的なグレーゾーンがあるため、現地の規制を確認したうえで準備しよう。",
      serviceId: "nordvpn",
    },
  },
];

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function getCountriesByRegion(region: string): Country[] {
  return countries.filter((c) => c.region === region);
}
