export type Author = {
  id: string;
  name: string;
  displayName: string;
  jobTitle: string;
  shortBio: string;
  longBio: string;
  expertise: string[];
  experience: string[];
  url: string;
};

export const authors: Record<string, Author> = {
  k: {
    id: "k",
    name: "K",
    displayName: "海外デジタル研究家 K",
    jobTitle: "海外デジタル研究家 / ITコンサルタント",
    shortBio:
      "IT・コンサルティング業界で10年以上の経験を持つ海外デジタル研究家。アメリカ、オーストラリア、欧州、南米など10カ国以上の渡航経験から、海外でのネット環境・通信・送金の実情を発信している。",
    longBio: `IT・コンサルティング業界で10年以上のキャリアを持つ海外デジタル研究家。アメリカ、オーストラリア、ヨーロッパ複数国、南米各国など10カ国以上の渡航・滞在経験を持ち、各国のネット規制・通信インフラ・決済事情を実体験から把握している。

特にVPN・eSIM・海外送金サービスの実測比較を専門領域とし、「机上の知識ではなく、実際に使ったうえで本当におすすめできるか」を基準に情報発信を行う。

本サイトでは、海外渡航者が直面するデジタル面の不安をゼロにすることを目的に、記事の執筆・監修・実測テストを担当している。

プライバシー保護のためペンネームで活動しているが、記事内の体験談・データはすべて実体験・実測に基づくものである。`,
    expertise: [
      "海外生活のITインフラ",
      "VPN・eSIM・海外送金の実測比較",
      "海外赴任のデジタル準備",
      "グローバル通信事情",
    ],
    experience: [
      "IT・コンサル業界 10年以上",
      "渡航経験: アメリカ、オーストラリア、欧州、南米など10カ国以上",
      "VPN・eSIM・海外送金サービスの実利用者",
    ],
    url: "/authors/k",
  },
};

export function getAuthor(id: string): Author | undefined {
  return authors[id];
}

export const defaultAuthor = authors.k;
