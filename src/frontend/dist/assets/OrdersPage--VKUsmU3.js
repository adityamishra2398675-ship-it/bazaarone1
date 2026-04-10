import { j as jsxRuntimeExports, b as useNavigate, w as useActor, y as useQuery, L as LoadingSpinner, p as Link, t as Card, q as ChevronRight, B as Button } from "./index-BB5MO6AH.js";
import { E as EmptyState } from "./EmptyState-C9TLmdj8.js";
import { O as OrderStatusBadge } from "./OrderStatusBadge-B1xXgmxU.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { B as BuyerGuard } from "./RoleGuard-HKtImsB6.js";
import { P as Package } from "./package-tpYs1vsX.js";
import { C as CalendarDays } from "./calendar-days-CL95fBiT.js";
import "./truck-DD76cO_y.js";
import "./clock-wutncOHm.js";
function formatDate(timestamp) {
  return new Date(Number(timestamp) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function OrdersContent() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  const sortedOrders = orders ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "My Orders" }),
      sortedOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        sortedOrders.length,
        " order",
        sortedOrders.length !== 1 ? "s" : ""
      ] })
    ] }),
    sortedOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        emoji: "📦",
        title: "No orders yet",
        description: "You haven't placed any orders. Start shopping to see your orders here!",
        action: { label: "Shop Now", onClick: () => navigate({ to: "/" }) }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "orders-list", children: sortedOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/orders/$id",
        params: { id: order.id.toString() },
        "data-ocid": `order-row-${order.id}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border bg-card hover:shadow-elevated transition-marketplace cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                  "Order #",
                  order.id.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.createdAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    order.items.length,
                    " item",
                    order.items.length !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PriceDisplay,
                  {
                    amount: order.total,
                    size: "sm",
                    className: "justify-end"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 flex items-center justify-between sm:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: order.total, size: "sm" })
          ] })
        ] })
      },
      order.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        onClick: () => navigate({ to: "/" }),
        "data-ocid": "continue-shopping-btn",
        children: "Continue Shopping"
      }
    ) })
  ] });
}
function OrdersPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BuyerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersContent, {}) });
}
export {
  OrdersPage as default
};
