import { type ReactNode } from "react";

type Variant = "info" | "warning" | "danger" | "success";

type Props = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
};

const variantStyles: Record<Variant, { bg: string; border: string; icon: string; title: string }> = {
  info: {
    bg: "bg-blue-50",
    border: "border-info",
    icon: "ℹ️",
    title: "text-info",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-warning",
    icon: "⚠️",
    title: "text-yellow-700",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-danger",
    icon: "🚨",
    title: "text-danger",
  },
  success: {
    bg: "bg-green-50",
    border: "border-success",
    icon: "✅",
    title: "text-success",
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
}: Props) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`my-6 rounded-xl border-l-4 ${styles.border} ${styles.bg} p-4`}
    >
      {title && (
        <p className={`mb-1 flex items-center gap-2 font-bold ${styles.title}`}>
          <span>{styles.icon}</span>
          {title}
        </p>
      )}
      <div className="text-sm leading-relaxed text-neutral-900">{children}</div>
    </div>
  );
}
