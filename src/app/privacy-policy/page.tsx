import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "プライバシーポリシー",
  description: `${siteConfig.name}のプライバシーポリシーです。`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        プライバシーポリシー
      </h1>

      <div className="article-content">
        <h2 id="cookie">Cookieの使用について</h2>
        <p>
          当サイトでは、Googleアナリティクス（GA4）を使用してアクセス情報を収集しています。
          Googleアナリティクスは、Cookieを使用してユーザーのアクセス情報を収集します。
          このアクセス情報は匿名で収集されており、個人を特定するものではありません。
        </p>
        <p>
          Googleアナリティクスの利用規約については、
          <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer">
            Google アナリティクス利用規約
          </a>
          をご覧ください。
        </p>

        <h2 id="personal-info">個人情報の取り扱いについて</h2>
        <p>
          当サイトでは、お問い合わせフォーム等を通じて個人情報をご提供いただく場合があります。
          取得した個人情報は、お問い合わせへの回答以外の目的では使用いたしません。
        </p>

        <h2 id="affiliate">広告について</h2>
        <p>
          当サイトでは、第三者配信の広告サービス（アフィリエイトプログラム）を利用しています。
          広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、
          Cookieを使用することがあります。
        </p>

        <h2 id="disclaimer">免責事項</h2>
        <p>
          当サイトに掲載されている情報の正確性には万全を期していますが、
          その内容について保証するものではありません。
          当サイトの利用によって生じたいかなる損害についても、責任を負いかねます。
        </p>

        <h2 id="changes">プライバシーポリシーの変更</h2>
        <p>
          当サイトは、必要に応じてプライバシーポリシーを変更することがあります。
          変更後のプライバシーポリシーは、当ページに掲載した時点から効力を生じるものとします。
        </p>

        <p className="mt-8 text-sm text-neutral-700">
          制定日: 2026年4月1日<br />
          運営者: {siteConfig.author.name}
        </p>
      </div>
    </div>
  );
}
