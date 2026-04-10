import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: bigint | number;
  originalAmount?: bigint | number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  amount,
  originalAmount,
  className,
  size = "md",
}: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(amount));

  const originalFormatted = originalAmount
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Number(originalAmount),
      )
    : null;

  const discount =
    originalAmount && Number(originalAmount) > Number(amount)
      ? Math.round(
          ((Number(originalAmount) - Number(amount)) / Number(originalAmount)) *
            100,
        )
      : null;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn("font-mono font-bold text-foreground", sizeClasses[size])}
      >
        ₹{formatted}
      </span>
      {originalFormatted && (
        <span className="text-muted-foreground line-through text-sm font-mono">
          ₹{originalFormatted}
        </span>
      )}
      {discount && (
        <span className="text-xs font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
          {discount}% off
        </span>
      )}
    </div>
  );
}
