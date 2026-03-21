import Badge from "@/components/ui/Badge";

type Props = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isRecommended?: boolean;
};

export default function PricingCard({
  name,
  price,
  period = "月額",
  features,
  isRecommended,
}: Props) {
  return (
    <div
      className={`rounded-xl border-2 bg-white p-6 ${
        isRecommended
          ? "border-accent-500 shadow-md"
          : "border-neutral-200"
      }`}
    >
      {isRecommended && (
        <div className="mb-3">
          <Badge>おすすめ</Badge>
        </div>
      )}
      <h3 className="text-lg font-bold text-neutral-900">{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold text-primary-700">{price}</span>
        <span className="text-sm text-neutral-700">/{period}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-success">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
