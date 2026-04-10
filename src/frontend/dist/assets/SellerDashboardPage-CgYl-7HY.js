import { c as createLucideIcon, j as jsxRuntimeExports, b as useNavigate, e as useAuth, w as useActor, y as useQuery, O as OrderStatus, L as LoadingSpinner, B as Button, v as ShoppingBag, p as Link, t as Card, m as Separator, q as ChevronRight } from "./index-BB5MO6AH.js";
import { C as CategoryBadge } from "./CategoryBadge-C-c7VCmE.js";
import { O as OrderStatusBadge } from "./OrderStatusBadge-B1xXgmxU.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { S as SellerGuard } from "./RoleGuard-HKtImsB6.js";
import { b as useSellerProducts } from "./useProducts-DGvB3Evu.js";
import { P as Plus } from "./plus-B6TX10v5.js";
import { P as Package } from "./package-tpYs1vsX.js";
import "./truck-DD76cO_y.js";
import "./clock-wutncOHm.js";
import "./EmptyState-C9TLmdj8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5 border border-border bg-card", "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-6 h-6 ${colorClass}` })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground font-display", children: value })
    ] })
  ] }) });
}
function SellerDashboardContent() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { actor, isFetching } = useActor();
  const { data: products, isLoading: productsLoading } = useSellerProducts();
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySellerOrders();
    },
    enabled: !!actor && !isFetching
  });
  const totalProducts = (products == null ? void 0 : products.length) ?? 0;
  const activeProducts = (products == null ? void 0 : products.filter((p) => p.isActive).length) ?? 0;
  const totalOrders = (orders == null ? void 0 : orders.length) ?? 0;
  const pendingOrders = (orders == null ? void 0 : orders.filter(
    (o) => o.status === OrderStatus.pending || o.status === OrderStatus.confirmed
  ).length) ?? 0;
  if (productsLoading || ordersLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Seller Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
          "Welcome back,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: (profile == null ? void 0 : profile.displayName) ?? "Seller" }),
          " ",
          "👋 Here's your store overview."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => navigate({ to: "/seller/products/new" }),
          className: "gap-2",
          "data-ocid": "seller-add-product-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Product"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Package,
          label: "Total Products",
          value: totalProducts,
          colorClass: "text-secondary",
          bgClass: "bg-secondary/10",
          ocid: "stat-total-products"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: PackageCheck,
          label: "Active Listings",
          value: activeProducts,
          colorClass: "text-chart-3",
          bgClass: "bg-chart-3/10",
          ocid: "stat-active-products"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: ShoppingBag,
          label: "Total Orders",
          value: totalOrders,
          colorClass: "text-primary",
          bgClass: "bg-primary/10",
          ocid: "stat-total-orders"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: TrendingUp,
          label: "Pending Orders",
          value: pendingOrders,
          colorClass: "text-accent",
          bgClass: "bg-accent/10",
          ocid: "stat-pending-orders"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/seller/products", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-smooth cursor-pointer group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Manage Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add, edit, or remove listings" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/seller/orders", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-smooth cursor-pointer group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Manage Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "View and update order status" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "My Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/seller/products", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1 text-xs hover:text-primary",
              children: [
                "View All ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: !products || products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-3", children: "No products yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => navigate({ to: "/seller/products/new" }),
              "data-ocid": "seller-first-product-btn",
              children: "Add Your First Product"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.slice(0, 5).map((p) => {
          var _a, _b, _c;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3",
              "data-ocid": `seller-product-row-${p.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: ((_c = (_b = (_a = p.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.getDirectURL) == null ? void 0 : _c.call(_b)) ?? "/assets/images/placeholder.svg",
                    alt: p.title,
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      e.target.src = "/assets/images/placeholder.svg";
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: p.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CategoryBadge,
                      {
                        category: p.category,
                        size: "sm",
                        showIcon: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: p.price, size: "sm" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/seller/products/$id/edit",
                    params: { id: p.id.toString() },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 hover:text-primary",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                      }
                    )
                  }
                )
              ]
            },
            p.id.toString()
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Recent Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/seller/orders", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1 text-xs hover:text-primary",
              children: [
                "View All ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: !orders || orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center py-8", children: "No orders yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.slice(0, 5).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3",
            "data-ocid": `seller-order-row-${order.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "Order #",
                  order.id.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  order.items.length,
                  " item(s)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OrderStatusBadge,
                  {
                    status: order.status,
                    showIcon: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PriceDisplay,
                  {
                    amount: order.total,
                    size: "sm",
                    className: "justify-end"
                  }
                )
              ] })
            ]
          },
          order.id.toString()
        )) }) })
      ] })
    ] })
  ] });
}
function SellerDashboardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SellerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerDashboardContent, {}) });
}
export {
  SellerDashboardPage as default
};
