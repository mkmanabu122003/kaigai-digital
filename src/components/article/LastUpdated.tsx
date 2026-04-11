type Props = {
  date: string;
  publishedAt?: string;
};

export default function LastUpdated({ date, publishedAt }: Props) {
  // Format date as "2026年4月時点" for visibility
  const yearMonth = date.match(/^(\d{4})-(\d{2})/);
  const displayMonth = yearMonth
    ? `${yearMonth[1]}年${parseInt(yearMonth[2], 10)}月時点の情報`
    : date;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <div className="flex items-center gap-1.5 text-neutral-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="font-medium">編集部が確認: {displayMonth}</span>
      </div>
      {publishedAt && publishedAt !== date && (
        <span className="text-xs text-neutral-500">
          初回公開: <time dateTime={publishedAt}>{publishedAt}</time>
        </span>
      )}
      <time dateTime={date} className="text-xs text-neutral-500">
        最終更新: {date}
      </time>
    </div>
  );
}
