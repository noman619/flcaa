import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden
          className={
            i <= Math.round(rating)
              ? "fill-accent-400 text-accent-400"
              : "fill-ink-200 text-ink-200"
          }
        />
      ))}
    </div>
  );
}
