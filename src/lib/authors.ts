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
    displayName: "海外デジタル編集部 K",
    jobTitle: "海外デジタル編集部 編集者",
    shortBio:
      "海外渡航者向けデジタル情報の編集を担当。VPN・eSIM・海外送金など、各サービスの公式情報・公開仕様・第三者レビューを整理し、海外でのネット環境・通信・送金にまつわる選び方を解説している。",
    longBio: `海外渡航者向けのデジタル情報を整理・解説する編集者。各サービスの公式サイト・公開仕様・第三者レビュー・ユーザーの声などの公開情報を読み込み、海外でのネット環境・通信・送金で迷う読者向けに「どの情報を見れば判断できるか」を整理して発信している。

特にVPN・eSIM・海外送金サービスは選択肢が多く、料金体系・対応国・機能差が分かりにくいジャンル。本サイトでは、各社の公開情報を横並びで比較し、用途別の選び方を解説することを役割としている。

本サイトでは、海外渡航者が直面するデジタル面の疑問をできる限り早く解消できるよう、記事の執筆・編集・更新を担当している。

プライバシー保護のためペンネームで活動している。記事内の数値・仕様は各サービスの公式情報および第三者公開情報に基づき、執筆時点の内容を整理したものである。`,
    expertise: [
      "海外渡航者向けデジタル情報の整理・解説",
      "VPN・eSIM・海外送金サービスの公開情報比較",
      "海外赴任のデジタル準備の解説",
      "国別ネット規制・通信事情の整理",
    ],
    experience: [
      "海外渡航者向けデジタルメディアの編集",
      "VPN・eSIM・海外送金サービスの公式情報・第三者レビューの整理",
      "国別ネット規制情報の整理・更新",
    ],
    url: "/authors/k",
  },
};

export function getAuthor(id: string): Author | undefined {
  return authors[id];
}

export const defaultAuthor = authors.k;
