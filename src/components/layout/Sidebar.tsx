import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Sidebar({ children }: Props) {
  return (
    <aside className="hidden w-[300px] shrink-0 lg:block">
      <div className="sticky top-20 space-y-6">{children}</div>
    </aside>
  );
}
