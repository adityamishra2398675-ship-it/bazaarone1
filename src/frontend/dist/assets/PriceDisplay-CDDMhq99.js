import { j as jsxRuntimeExports, a as cn } from "./index-BB5MO6AH.js";
function PriceDisplay({
  amount,
  originalAmount,
  className,
  size = "md"
}) {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(amount));
  const originalFormatted = originalAmount ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(originalAmount)
  ) : null;
  const discount = originalAmount && Number(originalAmount) > Number(amount) ? Math.round(
    (Number(originalAmount) - Number(amount)) / Number(originalAmount) * 100
  ) : null;
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-baseline gap-2 flex-wrap", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: cn("font-mono font-bold text-foreground", sizeClasses[size]),
        children: [
          "₹",
          formatted
        ]
      }
    ),
    originalFormatted && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground line-through text-sm font-mono", children: [
      "₹",
      originalFormatted
    ] }),
    discount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded", children: [
      discount,
      "% off"
    ] })
  ] });
}
export {
  PriceDisplay as P
};
