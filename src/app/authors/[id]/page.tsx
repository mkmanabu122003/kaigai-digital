import { notFound } from "next/navigation";
import Link from "next/link";
import { authors, getAuthor } from "@/lib/authors";
import { generateSeoMetadata } from "@/lib/seo";
import AuthorAvatar from "@/components/author/AuthorAvatar";
import { siteConfig } from "@/lib/config";

export function generateStaticParams() {
  return Object.keys(authors).map((id) => ({ id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const author = getAuthor(id);
  if (!author) return {};

  return generateSeoMetadata({
    title: `${author.displayName} | 執筆者プロフィール`,
    description: author.shortBio,
    path: author.url,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = getAuthor(id);
  if (!author) notFound();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.displayName,
    jobTitle: author.jobTitle,
    description: author.shortBio,
    url: `${siteConfig.url}${author.url}`,
    knowsAbout: author.expertise,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <article className="mx-auto max-w-[740px] px-4 py-12">
        <header className="flex items-start gap-6 border-b border-neutral-200 pb-8">
          <AuthorAvatar initial={author.name} size="lg" />
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-700">執筆者</p>
            <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
              {author.displayName}
            </h1>
            <p className="mt-1 text-sm text-neutral-700">{author.jobTitle}</p>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-primary-700">プロフィール</h2>
          <div className="space-y-4 text-base leading-relaxed text-neutral-800">
            {author.longBio.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-primary-700">専門領域</h2>
          <ul className="space-y-2 text-base text-neutral-800">
            {author.expertise.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-700" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-primary-700">経歴・実績</h2>
          <ul className="space-y-2 text-base text-neutral-800">
            {author.experience.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-700" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-xl bg-neutral-50 p-6">
          <h2 className="mb-3 text-base font-bold text-primary-700">
            執筆方針について
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700">
            当サイトでは、編集ポリシーに基づいて記事を執筆・監修しています。
            アフィリエイトリンクの取り扱い、利益相反の管理については
            <Link
              href="/editorial-policy"
              className="text-primary-700 hover:underline"
            >
              編集ポリシー
            </Link>
            および
            <Link
              href="/affiliate-disclosure"
              className="text-primary-700 hover:underline"
            >
              アフィリエイト開示
            </Link>
            をご覧ください。
          </p>
        </section>
      </article>
    </>
  );
}
