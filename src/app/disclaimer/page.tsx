import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "免責事項",
  description: `${siteConfig.name}の免責事項です。`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        免責事項
      </h1>

      <div className="article-content">
        <h2 id="vpn">VPN利用に関する免責事項</h2>
        <p>
          VPNの利用は、渡航先の国・地域の法律に従い、自己責任で行ってください。
          一部の国ではVPNの利用が制限または禁止されている場合があります。
          当サイトは特定の国でのVPN利用を推奨するものではなく、
          VPN利用に起因するいかなる問題についても責任を負いません。
        </p>

        <h2 id="accuracy">情報の正確性について</h2>
        <p>
          当サイトに記載されている情報は、執筆時点のものです。
          サービスの料金・内容・提供状況等は予告なく変更される場合があります。
          最新の情報は各サービスの公式サイトをご確認ください。
        </p>

        <h2 id="affiliate-disclosure">アフィリエイト広告について</h2>
        <p>
          当サイトはアフィリエイト広告を利用しています。
          当サイトのリンクを経由して商品・サービスを購入された場合、
          当サイトが報酬を受け取ることがあります。
          ただし、これにより記事の内容や評価が影響を受けることはありません。
        </p>

        <h2 id="recommendation">サービス推奨について</h2>
        <p>
          当サイトは特定のサービスの利用を強制するものではありません。
          サービスの選択・利用は、ご自身の判断と責任において行ってください。
          当サイトで紹介しているサービスの利用に起因する
          いかなる損害についても責任を負いかねます。
        </p>

        <h2 id="links">外部リンクについて</h2>
        <p>
          当サイトから外部サイトへのリンクは、利用者の便宜のために設けたものです。
          リンク先のサイトの内容について、当サイトは一切の責任を負いません。
        </p>

        <p className="mt-8 text-sm text-neutral-700">
          制定日: 2026年4月1日<br />
          運営者: {siteConfig.author.name}
        </p>
      </div>
    </div>
  );
}
