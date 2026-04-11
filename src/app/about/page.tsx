import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "運営者情報",
  description: `${siteConfig.name}の運営者情報・サイトのミッション・編集体制について紹介します。`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        運営者情報
      </h1>

      <div className="article-content">
        <h2 id="mission">サイトのミッション</h2>
        <p>
          {siteConfig.name}（{siteConfig.nameJa}）は、海外渡航者のデジタル面での不安をゼロにすることを目的としたメディアです。
          海外赴任・留学・出張・旅行で日本人が直面するネット環境、通信、決済、送金などの問題に対し、
          各サービスの公式情報と公開されている第三者情報を整理し、選び方を解説しています。
        </p>

        <h2 id="content">取り扱うテーマ</h2>
        <ul>
          <li>海外で使えるVPNサービスの比較・選び方</li>
          <li>海外向けeSIM・SIMカードの選び方</li>
          <li>海外送金サービス（Wise・PayPal・銀行送金）の手数料比較</li>
          <li>海外赴任・留学のデジタル準備チェックリスト</li>
          <li>国別のネット規制・通信事情の解説</li>
          <li>海外から日本のサービス（Netflix・TVer・ABEMA等）を利用する方法</li>
        </ul>

        <h2 id="editorial">編集体制</h2>
        <p>
          {siteConfig.name}は、海外渡航者向けのデジタル情報を専門に扱う編集チームが運営しています。
          記事は各サービスの公式情報・公開仕様・第三者公開レビューを整理する形で作成し、編集部による校正・ファクトチェックを経て公開しています。
        </p>
        <p>
          執筆者の詳細は<Link href="/authors/k">執筆者プロフィール</Link>をご覧ください。
        </p>

        <h2 id="policy">編集方針</h2>
        <p>
          記事の品質を担保するため、以下の方針で運営しています。
        </p>
        <ul>
          <li>料金・機能の記述は各サービスの公式情報を確認のうえ掲載する</li>
          <li>編集部による独自の計測・実測値の掲載は行わない</li>
          <li>アフィリエイトリンクの有無に関わらず、デメリットも正直に記載する</li>
          <li>情報が古くなった場合は速やかに更新する</li>
        </ul>
        <p>
          詳細は<Link href="/editorial-policy">編集ポリシー</Link>をご覧ください。
        </p>

        <h2 id="affiliate">アフィリエイトについて</h2>
        <p>
          当サイトは記事内でアフィリエイトリンクを使用しています。
          リンクを経由して商品・サービスを購入された場合、当サイトに報酬が発生することがあります。
          ただし、これにより記事の評価や順位が変わることはありません。
          詳細は<Link href="/affiliate-disclosure">アフィリエイト開示</Link>をご覧ください。
        </p>

        <h2 id="contact">お問い合わせ</h2>
        <p>
          記事に関するご質問・誤情報のご指摘・取材依頼などは
          <Link href="/contact">お問い合わせページ</Link>からお願いします。
        </p>

        <h2 id="site-info">サイト情報</h2>
        <table>
          <tbody>
            <tr>
              <th>サイト名</th>
              <td>{siteConfig.name}（{siteConfig.nameJa}）</td>
            </tr>
            <tr>
              <th>URL</th>
              <td>{siteConfig.url}</td>
            </tr>
            <tr>
              <th>運営開始</th>
              <td>2026年3月</td>
            </tr>
            <tr>
              <th>運営</th>
              <td>{siteConfig.name} 編集部</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
