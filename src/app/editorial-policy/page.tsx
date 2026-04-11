import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "編集ポリシー",
  description: `${siteConfig.name}の編集ポリシー。記事制作・ファクトチェック・アフィリエイト取り扱いに関する方針を明示します。`,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        編集ポリシー
      </h1>

      <div className="article-content">
        <p>
          {siteConfig.name}は、海外渡航者にとって信頼できる情報源であることを目指しています。
          以下の方針に基づき、記事の制作・編集・公開を行っています。
        </p>

        <h2 id="experience">1. 実体験ベースの情報発信</h2>
        <p>
          記事内で紹介するサービス・商品は、原則として執筆者または編集部が実際に使用・検証したものに限ります。
          「机上の知識」「他サイトの情報の寄せ集め」ではなく、実体験に基づく情報を提供します。
        </p>
        <ul>
          <li>VPNサービスは実際に契約・接続テストを行う</li>
          <li>eSIMは実際に渡航先で利用し、速度・接続安定性を確認する</li>
          <li>海外送金サービスは実際に送金し、手数料・着金時間を実測する</li>
        </ul>

        <h2 id="fact-check">2. ファクトチェック</h2>
        <p>
          記事内の数値情報（料金、対応国数、機能等）は、執筆時点で公式サイトを確認のうえ掲載しています。
          サービスの料金・仕様は変更される可能性があるため、最終的な確認は各サービスの公式サイトで行ってください。
        </p>
        <p>
          記事には<strong>最終更新日</strong>を表示しており、定期的に内容を見直しています。
          情報が古くなった場合は速やかに更新します。
        </p>

        <h2 id="affiliate">3. アフィリエイトの取り扱い</h2>
        <p>
          当サイトはアフィリエイトリンクを使用していますが、以下の方針を遵守します。
        </p>
        <ul>
          <li>
            <strong>リンクの有無で評価を変えない:</strong>{" "}
            アフィリエイト報酬の有無や金額によって、記事内のサービス評価や順位を変えることはありません
          </li>
          <li>
            <strong>デメリットも明示する:</strong>{" "}
            おすすめするサービスでも、デメリットや注意点を必ず記載します
          </li>
          <li>
            <strong>競合サービスも公平に扱う:</strong>{" "}
            報酬が発生しないサービスでも、優れていれば紹介します
          </li>
          <li>
            <strong>広告であることを明示する:</strong>{" "}
            アフィリエイトリンクを含む記事には、その旨を読者に明示します
          </li>
        </ul>
        <p>
          詳細は<Link href="/affiliate-disclosure">アフィリエイト開示</Link>をご覧ください。
        </p>

        <h2 id="quality">4. 品質基準</h2>
        <p>記事の品質を担保するため、以下の基準を設けています。</p>
        <ul>
          <li>独自の体験談・データを含むこと</li>
          <li>読者の悩みに対する明確な解決策を提示すること</li>
          <li>他サイトのコピーではなく、独自の視点で書かれていること</li>
          <li>情報の出典が明確であること</li>
        </ul>

        <h2 id="correction">5. 訂正・修正の方針</h2>
        <p>
          誤った情報を掲載していることが判明した場合、以下の対応を行います。
        </p>
        <ul>
          <li>速やかに正しい情報に修正する</li>
          <li>修正日を記事内に明示する</li>
          <li>重大な誤情報の場合は、訂正告知を行う</li>
        </ul>
        <p>
          誤情報のご指摘は<Link href="/contact">お問い合わせページ</Link>からお願いします。
        </p>

        <h2 id="ai">6. AI利用について</h2>
        <p>
          記事の制作過程で、構成案の作成や下書きにAIツールを活用する場合があります。
          ただし、最終的な記事内容は必ず人間（執筆者・編集者）が確認・編集し、
          実体験や独自の視点を加えたうえで公開しています。
        </p>
        <p>
          機械的な情報の寄せ集めや、ファクトチェックを経ていないAI生成コンテンツを公開することはありません。
        </p>

        <h2 id="privacy">7. 読者のプライバシー保護</h2>
        <p>
          読者のプライバシー保護に関する方針は、
          <Link href="/privacy-policy">プライバシーポリシー</Link>をご覧ください。
        </p>

        <p className="mt-8 text-sm text-neutral-700">
          制定日: 2026年4月11日<br />
          運営: {siteConfig.name} 編集部
        </p>
      </div>
    </div>
  );
}
