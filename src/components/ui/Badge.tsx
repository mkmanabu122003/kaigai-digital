import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
};

const variantClasses = {
  default: "bg-primary-100 text-primary-700",
  success: "bg-green-100 text-success",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-danger",
};

export default function Badge({ children, variant = "success" }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
