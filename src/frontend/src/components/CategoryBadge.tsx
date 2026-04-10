import { Badge } from "@/components/ui/badge";
import { CATEGORY_ICONS, CATEGORY_LABELS, Category } from "../types";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const CATEGORY_COLORS: Record<Category, string> = {
  [Category.electronics]: "bg-secondary/10 text-secondary border-secondary/20",
  [Category.clothes]: "bg-accent/10 text-accent border-accent/20",
  [Category.books]: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  [Category.groceries]: "bg-primary/10 text-primary border-primary/20",
  [Category.essentials]: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  [Category.others]: "bg-muted text-muted-foreground border-border",
};

export function CategoryBadge({
  category,
  size = "md",
  showIcon = true,
}: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`font-medium border ${CATEGORY_COLORS[category]} ${size === "sm" ? "text-xs px-1.5 py-0" : "text-xs px-2 py-0.5"}`}
      data-ocid={`category-badge-${category}`}
    >
      {showIcon && <span className="mr-1">{CATEGORY_ICONS[category]}</span>}
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}
