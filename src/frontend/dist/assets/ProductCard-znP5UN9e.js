import { c as createLucideIcon, j as jsxRuntimeExports, t as Card, p as Link, k as Badge, B as Button, s as ShoppingCart } from "./index-BB5MO6AH.js";
import { C as CategoryBadge } from "./CategoryBadge-C-c7VCmE.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function ProductCard({
  product,
  onAddToCart,
  showAddToCart = true
}) {
  var _a, _b, _c;
  const isOutOfStock = product.stock === 0n;
  const isQuickDelivery = product.deliveryEstimate.toLowerCase().includes("min") || product.deliveryEstimate.toLowerCase().includes("hour");
  const imageUrl = ((_c = (_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.getDirectURL) == null ? void 0 : _c.call(_b)) ?? "/assets/images/placeholder.svg";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "group overflow-hidden border border-border bg-card shadow-card hover:shadow-elevated transition-marketplace hover:-translate-y-0.5 cursor-pointer",
      "data-ocid": `product-card-${product.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/product/$id",
            params: { id: product.id.toString() },
            className: "block",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden bg-muted", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: product.title,
                    className: "w-full h-full object-cover group-hover:scale-105 transition-marketplace",
                    onError: (e) => {
                      e.target.src = "/assets/images/placeholder.svg";
                    }
                  }
                ),
                isOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs font-semibold", children: "Out of Stock" }) }),
                isQuickDelivery && !isOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-secondary text-secondary-foreground text-xs gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                  "Quick"
                ] }) }),
                product.rating >= 4.5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent text-accent-foreground text-xs", children: "Bestseller" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground text-sm line-clamp-2 leading-tight flex-1 min-w-0", children: product.title }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: product.category, size: "sm" }),
                product.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-current" }),
                  product.rating.toFixed(1)
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PriceDisplay,
                  {
                    amount: product.price,
                    className: "text-base font-bold"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: product.deliveryEstimate })
              ] })
            ]
          }
        ),
        showAddToCart && !isOutOfStock && onAddToCart && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "w-full gap-1.5 transition-marketplace",
            onClick: (e) => {
              e.preventDefault();
              onAddToCart(product);
            },
            "data-ocid": `add-to-cart-${product.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5" }),
              "Add to Cart"
            ]
          }
        ) })
      ]
    }
  );
}
export {
  ProductCard as P,
  Star as S,
  Zap as Z
};
