import { d as useSearch, w as useActor, y as useQuery, j as jsxRuntimeExports, v as ShoppingBag, m as Separator, p as Link, B as Button } from "./index-BB5MO6AH.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { C as CircleCheck } from "./circle-check-oHOG3ZEt.js";
import { P as Package } from "./package-tpYs1vsX.js";
import { T as Truck } from "./truck-DD76cO_y.js";
import { M as MapPin } from "./map-pin-B2kX2mGb.js";
const ORDER_STEPS = [
  { icon: CircleCheck, label: "Order Confirmed", done: true },
  { icon: Package, label: "Processing", done: false },
  { icon: Truck, label: "Shipped", done: false },
  { icon: MapPin, label: "Delivered", done: false }
];
function OrderConfirmationPage() {
  const search = useSearch({ strict: false });
  const { actor, isFetching: actorFetching } = useActor();
  const orderId = search.orderId ?? "—";
  const estimatedDelivery = search.estimated ?? "3–5 business days";
  const orderIdBigInt = orderId !== "—" ? BigInt(orderId) : null;
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor || orderIdBigInt === null) return null;
      return actor.getOrder(orderIdBigInt);
    },
    enabled: !!actor && !actorFetching && orderIdBigInt !== null
  });
  const items = (order == null ? void 0 : order.items) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[70vh] bg-background flex items-start justify-center py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 text-center shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-accent" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground mb-2", children: "Order Placed Successfully! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Thank you for shopping with One Bajar. Your order has been received and is being processed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 bg-muted/40 rounded-xl px-5 py-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Order ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground text-xs bg-muted px-2 py-1 rounded", children: [
            "#",
            orderId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Estimated Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm", children: estimatedDelivery })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground mb-5 text-sm uppercase tracking-wide", children: "Order Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-5 left-5 right-5 h-0.5 bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-5 left-5 h-0.5 bg-primary transition-smooth",
            style: { width: "0%" }
          }
        ),
        ORDER_STEPS.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-2 relative z-10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-smooth ${step.done ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-medium text-center max-w-[60px] leading-tight ${step.done ? "text-foreground" : "text-muted-foreground"}`,
                  children: step.label
                }
              )
            ]
          },
          step.label
        ))
      ] })
    ] }),
    order && items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 text-primary" }),
        "Items Ordered"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex justify-between items-center text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                item.title,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1.5", children: [
                  "× ",
                  item.quantity.toString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                amount: item.priceAtOrder * item.quantity,
                size: "sm"
              }
            )
          ]
        },
        item.productId.toString()
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Total Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PriceDisplay,
          {
            amount: items.reduce(
              (sum, item) => sum + item.priceAtOrder * item.quantity,
              0n
            ),
            size: "md"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "w-full gap-2",
          "data-ocid": "order-confirm-view-orders",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }),
            "View My Orders"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "w-full gap-2",
          "data-ocid": "order-confirm-continue-shopping",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
            "Continue Shopping"
          ]
        }
      ) })
    ] })
  ] }) });
}
export {
  OrderConfirmationPage as default
};
