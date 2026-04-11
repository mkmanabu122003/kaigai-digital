import Link from "next/link";
import type { Author } from "@/lib/authors";
import AuthorAvatar from "./AuthorAvatar";

type Props = {
  author: Author;
};

export default function AuthorBio({ author }: Props) {
  return (
    <aside className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      <div className="flex items-start gap-4">
        <AuthorAvatar initial={author.name} size="md" />
        <div className="flex-1">
          <p className="text-xs font-medium text-neutral-700">この記事の執筆者</p>
          <Link
            href={author.url}
            className="block font-bold text-neutral-900 hover:text-primary-700 hover:underline"
          >
            {author.displayName}
          </Link>
          <p className="mt-1 text-xs text-neutral-700">{author.jobTitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            {author.shortBio}
          </p>
          <Link
            href={author.url}
            className="mt-3 inline-block text-xs font-medium text-primary-700 hover:underline"
          >
            執筆者プロフィールを見る →
          </Link>
        </div>
      </div>
    </aside>
  );
}
