type Props = {
  flag: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export default function CountryFlag({ flag, name, size = "md" }: Props) {
  return (
    <span role="img" aria-label={`${name}の国旗`} className={sizeClasses[size]}>
      {flag}
    </span>
  );
}
