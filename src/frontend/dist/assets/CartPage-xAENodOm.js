import { j as jsxRuntimeExports, b as useNavigate, f as useCart, L as LoadingSpinner, v as ShoppingBag, B as Button, t as Card, m as Separator, g as ue } from "./index-BB5MO6AH.js";
import { E as EmptyState } from "./EmptyState-C9TLmdj8.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { B as BuyerGuard } from "./RoleGuard-HKtImsB6.js";
import { u as useProducts } from "./useProducts-DGvB3Evu.js";
import { M as Minus } from "./minus-DhYXvzNT.js";
import { P as Plus } from "./plus-B6TX10v5.js";
import { T as Trash2 } from "./trash-2-CBGZQd1s.js";
const DELIVERY_FEE = 49n;
const FREE_DELIVERY_THRESHOLD = 499n;
function CartContent() {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, updateCartItem, totalAmount } = useCart();
  const { data: allProducts } = useProducts();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  const productMap = new Map(
    (allProducts ?? []).map((p) => [p.id.toString(), p])
  );
  const items = (cart == null ? void 0 : cart.items) ?? [];
  const deliveryFee = totalAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0n : DELIVERY_FEE;
  const grandTotal = totalAmount + deliveryFee;
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        emoji: "🛒",
        title: "Your cart is empty",
        description: "Add items from our catalog and they'll appear here. Start exploring amazing deals!",
        action: {
          label: "Start Shopping",
          onClick: () => navigate({ to: "/" })
        },
        "data-ocid": "cart-empty"
      }
    ) });
  }
  const handleRemove = async (productId) => {
    try {
      await removeFromCart.mutateAsync(productId);
      ue.success("Item removed from cart");
    } catch {
      ue.error("Failed to remove item");
    }
  };
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) {
      await handleRemove(productId);
      return;
    }
    try {
      await updateCartItem.mutateAsync({
        productId,
        quantity: BigInt(newQty)
      });
    } catch {
      ue.error("Failed to update quantity");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground mb-6", children: [
      "Shopping Cart",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-lg", children: [
        "(",
        items.length,
        " ",
        items.length === 1 ? "item" : "items",
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 bg-card rounded-xl border border-border divide-y divide-border overflow-hidden", children: items.map((item) => {
        var _a, _b, _c;
        const product = productMap.get(item.productId.toString());
        const imageUrl = ((_c = (_b = (_a = product == null ? void 0 : product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.getDirectURL) == null ? void 0 : _c.call(_b)) ?? null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-4 p-4 hover:bg-muted/30 transition-marketplace",
            "data-ocid": `cart-item-${item.productId}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-lg bg-muted shrink-0 flex items-center justify-center border border-border overflow-hidden", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imageUrl,
                  alt: (product == null ? void 0 : product.title) ?? "Product",
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm leading-snug truncate", children: (product == null ? void 0 : product.title) ?? `Product #${item.productId.toString()}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PriceDisplay,
                  {
                    amount: item.priceAtAdd,
                    className: "mt-1",
                    size: "sm"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border rounded-lg overflow-hidden", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 rounded-none hover:bg-muted",
                        onClick: () => handleQuantityChange(
                          item.productId,
                          Number(item.quantity) - 1
                        ),
                        disabled: updateCartItem.isPending,
                        "aria-label": "Decrease quantity",
                        "data-ocid": `cart-qty-decrease-${item.productId}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-semibold select-none", children: item.quantity.toString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 rounded-none hover:bg-muted",
                        onClick: () => handleQuantityChange(
                          item.productId,
                          Number(item.quantity) + 1
                        ),
                        disabled: updateCartItem.isPending,
                        "aria-label": "Increase quantity",
                        "data-ocid": `cart-qty-increase-${item.productId}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                      onClick: () => handleRemove(item.productId),
                      disabled: removeFromCart.isPending,
                      "aria-label": "Remove item",
                      "data-ocid": `cart-remove-${item.productId}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-right pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceDisplay,
                {
                  amount: item.priceAtAdd * item.quantity,
                  size: "sm"
                }
              ) })
            ]
          },
          item.productId.toString()
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Order Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Subtotal (",
              items.length,
              " ",
              items.length === 1 ? "item" : "items",
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: totalAmount, size: "sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery Fee" }),
            deliveryFee === 0n ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: deliveryFee, size: "sm" })
          ] }),
          deliveryFee > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed", children: [
            "Add ₹",
            (FREE_DELIVERY_THRESHOLD - totalAmount).toString(),
            " more for free delivery"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center font-bold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: grandTotal, size: "md" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            className: "w-full gap-2",
            onClick: () => navigate({ to: "/checkout" }),
            "data-ocid": "cart-checkout-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5" }),
              "Proceed to Checkout"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            className: "w-full text-sm",
            onClick: () => navigate({ to: "/" }),
            children: "Continue Shopping"
          }
        )
      ] }) })
    ] })
  ] });
}
function CartPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BuyerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CartContent, {}) });
}
export {
  CartPage as default
};
