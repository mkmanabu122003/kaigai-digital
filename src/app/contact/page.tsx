import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata = generateSeoMetadata({
  title: "お問い合わせ",
  description: `${siteConfig.name}へのお問い合わせ方法。記事に関するご質問・誤情報のご指摘・取材依頼などを受け付けています。`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        お問い合わせ
      </h1>

      <div className="article-content">
        <p>
          {siteConfig.name}へのお問い合わせは、以下のフォームよりお願いいたします。
          記事に関するご質問、誤情報のご指摘、取材・寄稿のご依頼など、
          内容に応じて対応いたします。
        </p>

        <h2 id="form">お問い合わせフォーム</h2>
        <p>
          以下のGoogleフォームよりお問い合わせください。
        </p>
        <p>
          <strong>
            <a
              href="https://forms.gle/kaigai-digital-contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              お問い合わせフォームを開く（Googleフォーム）
            </a>
          </strong>
        </p>
        <p>
          ※ フォームは現在準備中です。お急ぎの場合は、X（旧Twitter）またはメールでもご連絡を受け付けております。
        </p>

        <h2 id="response">返信について</h2>
        <ul>
          <li>原則として、お問い合わせから3〜5営業日以内に返信いたします</li>
          <li>内容によっては、返信に時間をいただく場合があります</li>
          <li>すべてのお問い合わせに返信できない場合がございます。あらかじめご了承ください</li>
        </ul>

        <h2 id="topics">よくあるお問い合わせ内容</h2>

        <h3 id="article-question">記事に関するご質問</h3>
        <p>
          記事の内容について不明な点がある場合、該当記事のURLとあわせてご質問内容をお送りください。
          可能な範囲で回答いたします。
        </p>

        <h3 id="error-report">誤情報のご指摘</h3>
        <p>
          記事内の情報に誤りを発見された場合、該当箇所と正しい情報をお知らせください。
          確認のうえ、速やかに修正いたします。
          編集方針については<Link href="/editorial-policy">編集ポリシー</Link>をご覧ください。
        </p>

        <h3 id="business">取材・寄稿・業務提携のご依頼</h3>
        <p>
          メディア取材、寄稿のご依頼、業務提携のご相談などは、
          会社名・ご担当者名・ご用件を明記のうえお問い合わせください。
        </p>

        <h3 id="advertise">広告掲載のご依頼</h3>
        <p>
          広告掲載のご依頼は、商材の概要・希望掲載期間・予算規模を明記のうえお問い合わせください。
          当サイトの<Link href="/editorial-policy">編集ポリシー</Link>に沿った内容である場合のみ、
          掲載を検討いたします。
        </p>

        <h2 id="not-accept">お受けできないお問い合わせ</h2>
        <ul>
          <li>個別の法律相談・税務相談</li>
          <li>個別の渡航計画に関する詳細な相談</li>
          <li>当サイトで取り扱っていないテーマに関するお問い合わせ</li>
          <li>誹謗中傷・営業目的のご連絡</li>
        </ul>

        <p className="mt-8 text-sm text-neutral-700">
          運営: {siteConfig.name} 編集部
        </p>
      </div>
    </div>
  );
}
