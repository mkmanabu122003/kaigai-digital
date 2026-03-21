type Props = {
  pros: string[];
  cons: string[];
};

export default function ProConsList({ pros, cons }: Props) {
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h4 className="mb-3 flex items-center gap-2 font-bold text-success">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-sm text-white">
            ✓
          </span>
          メリット
        </h4>
        <ul className="space-y-2 text-sm">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-success">●</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h4 className="mb-3 flex items-center gap-2 font-bold text-danger">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger text-sm text-white">
            ✗
          </span>
          デメリット
        </h4>
        <ul className="space-y-2 text-sm">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-danger">●</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
