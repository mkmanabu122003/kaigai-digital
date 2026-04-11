import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "アフィリエイト開示",
  description: `${siteConfig.name}のアフィリエイト広告に関する開示。利益相反の管理、提携プログラム、報酬の取り扱いを明示します。`,
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        アフィリエイト開示
      </h1>

      <div className="article-content">
        <p>
          {siteConfig.name}は、消費者庁のステルスマーケティング規制および景品表示法に基づき、
          アフィリエイト広告について以下のとおり開示します。
        </p>

        <h2 id="disclosure">広告掲載の事実</h2>
        <p>
          <strong>当サイトの記事には、アフィリエイトリンク（広告）が含まれています。</strong>
        </p>
        <p>
          記事内のリンクを経由して商品・サービスを購入された場合、
          当サイトに販売元から成果報酬が支払われることがあります。
          この報酬は、サイトの運営費用および記事制作のためのコスト（リサーチ・編集等）に充てられています。
        </p>

        <h2 id="programs">提携している主な広告プログラム</h2>
        <p>当サイトは以下のアフィリエイトプログラムに参加しています。</p>
        <ul>
          <li>A8.net</li>
          <li>もしもアフィリエイト</li>
          <li>バリューコマース</li>
          <li>各サービスの個別アフィリエイトプログラム</li>
        </ul>

        <h2 id="services">アフィリエイトリンクを含む主なサービス</h2>
        <ul>
          <li>NordVPN（VPN）</li>
          <li>Surfshark（VPN）</li>
          <li>かべネコVPN（VPN）</li>
          <li>Airalo（eSIM）</li>
          <li>Wise（海外送金）</li>
        </ul>

        <h2 id="independence">編集の独立性</h2>
        <p>
          当サイトは、アフィリエイト報酬の有無や金額によって、
          記事内の評価・順位・推奨内容を変更することはありません。
        </p>
        <ul>
          <li>
            <strong>出典に基づく評価:</strong>{" "}
            紹介するサービスは、公式情報・公開仕様・第三者レビューを横断的にリサーチし、編集部の見解を整理したうえで掲載しています
          </li>
          <li>
            <strong>デメリットも明示:</strong>{" "}
            アフィリエイト対象のサービスでも、デメリットや注意点は正直に記載します
          </li>
          <li>
            <strong>競合サービスも公平に扱う:</strong>{" "}
            アフィリエイト報酬が発生しないサービスでも、優れていれば紹介します
          </li>
          <li>
            <strong>順位の操作なし:</strong>{" "}
            報酬単価が高いサービスを上位に配置するような順位操作は行いません
          </li>
        </ul>
        <p>
          編集方針の詳細は<Link href="/editorial-policy">編集ポリシー</Link>をご覧ください。
        </p>

        <h2 id="visible">広告表示について</h2>
        <p>
          当サイトでは、記事冒頭に「PR」表示を設置し、
          記事にアフィリエイト広告が含まれていることを明示しています。
          また、各記事内のアフィリエイトリンクは、リンク先の遷移を妨げない範囲で識別できるよう配慮しています。
        </p>

        <h2 id="responsibility">サービス利用の自己責任</h2>
        <p>
          当サイトで紹介するサービスの契約・利用は、ご自身の判断と責任において行ってください。
          サービスの利用に起因するいかなる損害についても、当サイトは責任を負いかねます。
          詳細は<Link href="/disclaimer">免責事項</Link>をご覧ください。
        </p>

        <h2 id="contact">本件に関するお問い合わせ</h2>
        <p>
          アフィリエイト開示・編集ポリシーに関するご質問は
          <Link href="/contact">お問い合わせページ</Link>からお願いします。
        </p>

        <p className="mt-8 text-sm text-neutral-700">
          制定日: 2026年4月11日<br />
          運営: {siteConfig.name} 編集部
        </p>
      </div>
    </div>
  );
}
