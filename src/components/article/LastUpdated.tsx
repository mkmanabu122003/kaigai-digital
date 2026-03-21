type Props = {
  date: string;
};

export default function LastUpdated({ date }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <time dateTime={date}>最終更新: {date}</time>
    </div>
  );
}
