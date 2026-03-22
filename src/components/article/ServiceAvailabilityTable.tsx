import Link from "next/link";

type ServiceStatus = "available" | "limited" | "blocked";

type ServiceEntry = {
  category: string;
  services: string;
  status: ServiceStatus;
  statusLabel: string;
};

type Props = {
  countryName: string;
  entries: ServiceEntry[];
  vpnCompareLink?: string;
};

const statusConfig: Record<
  ServiceStatus,
  { symbol: string; dotColor: string; textColor: string }
> = {
  available: {
    symbol: "◯",
    dotColor: "bg-green-500",
    textColor: "text-green-600",
  },
  limited: {
    symbol: "△",
    dotColor: "bg-amber-500",
    textColor: "text-amber-600",
  },
  blocked: {
    symbol: "×",
    dotColor: "bg-red-500",
    textColor: "text-red-600",
  },
};

export default function ServiceAvailabilityTable({
  entries,
  vpnCompareLink = "/compare/best-vpn",
}: Props) {
  const hasLimited = entries.some((e) => e.status === "limited");

  return (
    <div className="my-8">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1e3a5f]">
              <th className="w-[20%] py-3 px-4 text-left text-sm font-semibold text-white md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs">
                カテゴリ
              </th>
              <th className="w-[45%] py-3 px-4 text-left text-sm font-semibold text-white md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs">
                サービス
              </th>
              <th className="w-[35%] py-3 px-4 text-left text-sm font-semibold text-white md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs">
                利用可否
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const config = statusConfig[entry.status];
              return (
                <tr
                  key={`${entry.category}-${entry.services}-${i}`}
                  className={`border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs">
                    {entry.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs">
                    {entry.services}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm font-medium md:py-3 md:px-4 max-md:py-2 max-md:px-2.5 max-md:text-xs ${config.textColor}`}
                  >
                    <span className="hidden items-center gap-1.5 md:inline-flex">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${config.dotColor}`}
                      />
                      {config.symbol} {entry.statusLabel}
                    </span>
                    <span className="md:hidden">
                      {config.symbol} {entry.statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasLimited && (
        <p className="mt-3 text-sm text-gray-600">
          △のサービスはVPNを使えば日本と同じように利用できます。
          <Link
            href={vpnCompareLink}
            className="ml-1 font-medium text-[#1e3a5f] hover:underline"
          >
            → おすすめVPN比較はこちら
          </Link>
        </p>
      )}
    </div>
  );
}
