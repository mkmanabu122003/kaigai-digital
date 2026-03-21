type Props = {
  rating: number;
  max?: number;
};

export default function StarRating({ rating, max = 5 }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center text-yellow-400" aria-label={`${rating}/${max}点`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {hasHalf && <span>★</span>}
      {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
        <span key={`empty-${i}`} className="text-neutral-200">
          ★
        </span>
      ))}
    </span>
  );
}
