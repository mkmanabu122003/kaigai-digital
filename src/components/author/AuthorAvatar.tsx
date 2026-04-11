type Props = {
  initial: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-10 w-10 text-base",
  md: "h-14 w-14 text-xl",
  lg: "h-20 w-20 text-3xl",
};

export default function AuthorAvatar({ initial, size = "md" }: Props) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-700 font-bold text-white ${sizeMap[size]}`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
