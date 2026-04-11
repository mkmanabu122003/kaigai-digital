"use client";

import { type AffiliateService } from "@/lib/affiliates";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import AffiliateButton from "./AffiliateButton";

type Props = {
  services: AffiliateService[];
  articleSlug: string;
};

export default function ComparisonTable({ services, articleSlug }: Props) {
  return (
    <div className="my-8">
      {/* PC: テーブル表示 */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm">
          <thead>
            <tr className="bg-primary-100">
              <th className="px-4 py-3 text-left font-bold text-primary-700" />
              {services.map((s) => (
                <th
                  key={s.id}
                  className="px-4 py-3 text-center font-bold text-primary-700"
                >
                  <div className="flex flex-col items-center gap-1">
                    {s.name}
                    {s.rank === 1 && <Badge>おすすめ</Badge>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-neutral-200">
              <td className="px-4 py-3 font-medium text-neutral-900">月額</td>
              {services.map((s) => (
                <td key={s.id} className="px-4 py-3 text-center">
                  {s.price}
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-200 bg-neutral-50">
              <td className="px-4 py-3 font-medium text-neutral-900">特徴</td>
              {services.map((s) => (
                <td key={s.id} className="px-4 py-3 text-center">
                  {s.features[0]}
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-200">
              <td className="px-4 py-3 font-medium text-neutral-900">
                おすすめポイント
              </td>
              {services.map((s) => (
                <td key={s.id} className="px-4 py-3 text-center text-xs">
                  {s.bestFor}
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-200 bg-neutral-50">
              <td className="px-4 py-3 font-medium text-neutral-900">評価</td>
              {services.map((s) => (
                <td key={s.id} className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <StarRating rating={s.rating} />
                    <span className="text-sm font-medium">{s.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-200 bg-amber-50">
              <td className="px-4 py-3 font-medium text-neutral-900">
                編集部の利用実績
              </td>
              {services.map((s) => (
                <td
                  key={s.id}
                  className="px-4 py-3 text-center text-xs text-neutral-700"
                >
                  {s.editorUsage || "—"}
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-200">
              <td className="px-4 py-3" />
              {services.map((s) => (
                <td key={s.id} className="px-4 py-3">
                  <AffiliateButton
                    serviceId={s.id}
                    placement="middle"
                    articleSlug={articleSlug}
                    text={`${s.name}公式へ`}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* SP: カード表示 */}
      <div className="space-y-4 lg:hidden">
        {services.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            {s.rank === 1 && (
              <div className="mb-2">
                <Badge>おすすめ</Badge>
              </div>
            )}
            <h3 className="text-lg font-bold text-neutral-900">{s.name}</h3>
            <div className="mt-2 flex items-center gap-1">
              <StarRating rating={s.rating} />
              <span className="text-sm font-medium">{s.rating}</span>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-700">月額</dt>
                <dd className="font-medium">{s.price}</dd>
              </div>
              {s.features.map((f, i) => (
                <div key={i} className="flex justify-between">
                  <dt className="text-neutral-700">特徴{i + 1}</dt>
                  <dd className="font-medium">{f}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-neutral-700">{s.bestFor}</p>
            {s.editorUsage && (
              <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-neutral-700">
                <span className="font-medium">編集部:</span> {s.editorUsage}
              </p>
            )}
            <AffiliateButton
              serviceId={s.id}
              placement="middle"
              articleSlug={articleSlug}
              text={`${s.name}を見る`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
