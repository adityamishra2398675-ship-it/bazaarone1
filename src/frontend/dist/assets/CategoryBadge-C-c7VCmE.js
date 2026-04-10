import { j as jsxRuntimeExports, k as Badge, i as CATEGORY_LABELS, h as CATEGORY_ICONS, C as Category } from "./index-BB5MO6AH.js";
const CATEGORY_COLORS = {
  [Category.electronics]: "bg-secondary/10 text-secondary border-secondary/20",
  [Category.clothes]: "bg-accent/10 text-accent border-accent/20",
  [Category.books]: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  [Category.groceries]: "bg-primary/10 text-primary border-primary/20",
  [Category.essentials]: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  [Category.others]: "bg-muted text-muted-foreground border-border"
};
function CategoryBadge({
  category,
  size = "md",
  showIcon = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `font-medium border ${CATEGORY_COLORS[category]} ${size === "sm" ? "text-xs px-1.5 py-0" : "text-xs px-2 py-0.5"}`,
      "data-ocid": `category-badge-${category}`,
      children: [
        showIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: CATEGORY_ICONS[category] }),
        CATEGORY_LABELS[category]
      ]
    }
  );
}
export {
  CategoryBadge as C
};
