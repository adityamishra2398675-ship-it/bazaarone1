import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  variant?: "spinner" | "skeleton-grid" | "skeleton-list" | "fullscreen";
  count?: number;
  className?: string;
}

function ProductSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export function LoadingSpinner({
  variant = "spinner",
  count = 8,
  className,
}: LoadingSpinnerProps) {
  if (variant === "fullscreen") {
    return (
      <div
        className={cn(
          "flex-1 flex items-center justify-center min-h-[400px]",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (variant === "skeleton-grid") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
          className,
        )}
      >
        {Array.from({ length: count }, (_, i) => i).map((i) => (
          <ProductSkeleton key={`skel-grid-${i}`} />
        ))}
      </div>
    );
  }

  if (variant === "skeleton-list") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card overflow-hidden",
          className,
        )}
      >
        {Array.from({ length: count }, (_, i) => i).map((i) => (
          <ListSkeleton key={`skel-list-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
