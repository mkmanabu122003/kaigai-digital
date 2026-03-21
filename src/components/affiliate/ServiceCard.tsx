import { type AffiliateService } from "@/lib/affiliates";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import AffiliateButton from "./AffiliateButton";

type Props = {
  service: AffiliateService;
  articleSlug: string;
};

export default function ServiceCard({ service, articleSlug }: Props) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          {service.rank === 1 && (
            <div className="mb-2">
              <Badge>おすすめ</Badge>
            </div>
          )}
          <h3 className="text-xl font-bold text-neutral-900">{service.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={service.rating} />
          <span className="text-sm font-medium">{service.rating}</span>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-700">{service.bestFor}</p>

      <ul className="mt-4 space-y-2">
        {service.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-success">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-lg font-bold text-primary-700">
          {service.price}
        </span>
      </div>

      <AffiliateButton
        serviceId={service.id}
        placement="middle"
        articleSlug={articleSlug}
      />
    </div>
  );
}
