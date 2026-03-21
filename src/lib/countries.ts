export type Country = {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  region: string;
  internetRestriction: number; // 1-5 (5=最も厳しい)
  description: string;
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
  },
];

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function getCountriesByRegion(region: string): Country[] {
  return countries.filter((c) => c.region === region);
}
