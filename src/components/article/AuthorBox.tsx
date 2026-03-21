import { siteConfig } from "@/lib/config";

export default function AuthorBox() {
  const { author } = siteConfig;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl">
          ✏️
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">{author.name}</p>
          <p className="mt-0.5 text-xs text-neutral-700">{author.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
