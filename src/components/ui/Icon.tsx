import type { SVGProps } from "react";

type IconName =
  | "shield"
  | "mobile"
  | "currency"
  | "check"
  | "plane"
  | "briefcase"
  | "home";

const paths: Record<IconName, { d: string; strokeWidth?: number }> = {
  shield: {
    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  mobile: {
    d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  currency: {
    d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  check: {
    d: "M5 13l4 4L19 7",
    strokeWidth: 3,
  },
  plane: {
    d: "M3 12l18-6-6 18-3-8-9-4z",
  },
  briefcase: {
    d: "M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM9 5h6v2H9V5z",
  },
  home: {
    d: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10",
  },
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export default function Icon({ name, className, ...rest }: IconProps) {
  const { d, strokeWidth = 2 } = paths[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}
