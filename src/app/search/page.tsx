import { buildSearchIndex } from "@/lib/search";
import SearchBar from "@/components/layout/SearchBar";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata = generateSeoMetadata({
  title: "記事検索",
  description: "海外デジタルの記事を検索できます。VPN、eSIM、海外送金など、海外渡航に役立つ情報を見つけましょう。",
  path: "/search",
  noindex: true,
});

export default function SearchPage() {
  const searchItems = buildSearchIndex();

  return (
    <div className="mx-auto max-w-[740px] px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary-700 lg:text-3xl">
        記事検索
      </h1>
      <SearchBar items={searchItems} />
      <p className="mt-4 text-sm text-neutral-700">
        キーワードを入力して、VPN・eSIM・海外送金などの記事を検索できます。
      </p>
    </div>
  );
}
