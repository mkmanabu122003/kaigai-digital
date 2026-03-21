import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: Props) {
  const allItems = [{ label: "ホーム", href: "/" }, ...items];

  return (
    <nav aria-label="パンくずリスト" className="py-3 text-sm text-neutral-700">
      <ol className="flex flex-wrap items-center gap-1">
        {allItems.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-neutral-400">/</span>}
            {item.href && i < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="text-primary-600 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
