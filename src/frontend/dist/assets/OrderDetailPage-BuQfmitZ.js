import { c as createLucideIcon, j as jsxRuntimeExports, n as useParams, b as useNavigate, w as useActor, x as useQueryClient, y as useQuery, z as useMutation, L as LoadingSpinner, O as OrderStatus, B as Button, t as Card, m as Separator, A as PAYMENT_METHOD_LABELS, g as ue } from "./index-BB5MO6AH.js";
import { E as EmptyState } from "./EmptyState-C9TLmdj8.js";
import { O as OrderStatusBadge, C as CircleCheckBig, H as House, a as CircleX } from "./OrderStatusBadge-B1xXgmxU.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { B as BuyerGuard } from "./RoleGuard-HKtImsB6.js";
import { A as ArrowLeft } from "./arrow-left-JP4hwmqH.js";
import { C as CalendarDays } from "./calendar-days-CL95fBiT.js";
import { P as Package } from "./package-tpYs1vsX.js";
import { T as Truck } from "./truck-DD76cO_y.js";
import { M as MapPin } from "./map-pin-B2kX2mGb.js";
import { C as CreditCard } from "./credit-card-HB-D2bDq.js";
import "./clock-wutncOHm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const STATUS_STEPS = [
  { status: OrderStatus.confirmed, label: "Confirmed", icon: CircleCheckBig },
  { status: OrderStatus.shipped, label: "Shipped", icon: Package },
  {
    status: OrderStatus.outForDelivery,
    label: "Out for Delivery",
    icon: Truck
  },
  { status: OrderStatus.delivered, label: "Delivered", icon: House }
];
const STATUS_ORDER = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.shipped,
  OrderStatus.outForDelivery,
  OrderStatus.delivered
];
function formatDate(timestamp) {
  return new Date(Number(timestamp) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function OrderDetailContent() {
  const { id } = useParams({ from: "/layout/orders/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(BigInt(id));
    },
    enabled: !!actor && !isFetching
  });
  const reorder = useMutation({
    mutationFn: async () => {
      if (!actor || !order) throw new Error("No actor");
      return actor.reorder(order.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      ue.success("Items added to cart!");
      navigate({ to: "/cart" });
    },
    onError: () => ue.error("Failed to reorder")
  });
  const cancelOrder = useMutation({
    mutationFn: async () => {
      if (!actor || !order) throw new Error("No actor");
      return actor.cancelOrder(order.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      ue.success("Order cancelled");
    },
    onError: () => ue.error("Failed to cancel order")
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  if (!order)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        emoji: "😕",
        title: "Order not found",
        description: "This order doesn't exist or you don't have access to it.",
        action: {
          label: "My Orders",
          onClick: () => navigate({ to: "/orders" })
        }
      }
    );
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === OrderStatus.cancelled;
  const canCancel = order.status === OrderStatus.pending || order.status === OrderStatus.confirmed;
  const deliveryFee = BigInt(0);
  const subtotal = order.total - deliveryFee;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-1.5 -ml-2 mb-2 text-muted-foreground",
            onClick: () => navigate({ to: "/orders" }),
            "data-ocid": "back-to-orders-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
              "My Orders"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground", children: [
          "Order #",
          order.id.toString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Placed on ",
            formatDate(order.createdAt)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 mt-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }) })
    ] }),
    !isCancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Order Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Est. delivery:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: order.estimatedDelivery })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start", children: STATUS_STEPS.map((step, i) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const isCompleted = currentStatusIndex >= stepIndex;
        const isCurrent = currentStatusIndex === stepIndex;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs mt-1.5 text-center leading-tight max-w-[60px] ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`,
                children: step.label
              }
            )
          ] }),
          i < STATUS_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-1 h-0.5 mx-1 mb-5 transition-colors ${currentStatusIndex > stepIndex ? "bg-primary" : "bg-border"}`
            }
          )
        ] }, step.status);
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border border-destructive/20 bg-destructive/5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Order Cancelled" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-80", children: "This order has been cancelled." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground mb-4", children: [
        "Items Ordered (",
        order.items.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-3",
          "data-ocid": `order-item-${item.productId}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Qty: ",
                  item.quantity.toString(),
                  " ×",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    "₹",
                    Number(item.priceAtOrder).toLocaleString("en-IN")
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                amount: item.priceAtOrder * item.quantity,
                size: "sm",
                className: "shrink-0"
              }
            )
          ]
        },
        item.productId.toString()
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Subtotal (",
            order.items.length,
            " item",
            order.items.length !== 1 ? "s" : "",
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: subtotal, size: "sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "FREE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-foreground text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: order.total, size: "md" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
          "Delivery Address"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: order.deliveryAddress.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: order.deliveryAddress.addressLine1 }),
          order.deliveryAddress.addressLine2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: order.deliveryAddress.addressLine2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            order.deliveryAddress.city,
            ", ",
            order.deliveryAddress.state,
            " —",
            " ",
            order.deliveryAddress.pincode
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1", children: [
            "📱 +91 ",
            order.deliveryAddress.phone
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
          "Payment"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Method:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: PAYMENT_METHOD_LABELS[order.paymentMethod] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Amount Paid:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: order.total, size: "sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium text-xs bg-accent/10 px-2 py-0.5 rounded", children: isCancelled ? "Refund Pending" : "Confirmed" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "gap-2 flex-1",
          onClick: () => reorder.mutate(),
          disabled: reorder.isPending,
          "data-ocid": "order-reorder-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
            reorder.isPending ? "Adding..." : "Reorder"
          ]
        }
      ),
      canCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "destructive",
          className: "gap-2 flex-1",
          onClick: () => cancelOrder.mutate(),
          disabled: cancelOrder.isPending,
          "data-ocid": "order-cancel-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
            cancelOrder.isPending ? "Cancelling..." : "Cancel Order"
          ]
        }
      )
    ] })
  ] });
}
function OrderDetailPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BuyerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderDetailContent, {}) });
}
export {
  OrderDetailPage as default
};
