import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriceDisplay } from "../components/PriceDisplay";
import { BuyerGuard } from "../components/RoleGuard";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

const DELIVERY_FEE = 49n;
const FREE_DELIVERY_THRESHOLD = 499n;

function CartContent() {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, updateCartItem, totalAmount } =
    useCart();
  const { data: allProducts } = useProducts();

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;

  // Build a lookup map: productId (string) → Product
  const productMap = new Map<string, Product>(
    (allProducts ?? []).map((p) => [p.id.toString(), p]),
  );

  const items = cart?.items ?? [];
  const deliveryFee =
    totalAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0
      ? 0n
      : DELIVERY_FEE;
  const grandTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          description="Add items from our catalog and they'll appear here. Start exploring amazing deals!"
          action={{
            label: "Start Shopping",
            onClick: () => navigate({ to: "/" }),
          }}
          data-ocid="cart-empty"
        />
      </div>
    );
  }

  const handleRemove = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (productId: bigint, newQty: number) => {
    if (newQty <= 0) {
      await handleRemove(productId);
      return;
    }
    try {
      await updateCartItem.mutateAsync({
        productId,
        quantity: BigInt(newQty),
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6">
        Shopping Cart{" "}
        <span className="text-muted-foreground font-normal text-lg">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
          {items.map((item) => {
            const product = productMap.get(item.productId.toString());
            const imageUrl = product?.images?.[0]?.getDirectURL?.() ?? null;
            return (
              <div
                key={item.productId.toString()}
                className="flex gap-4 p-4 hover:bg-muted/30 transition-marketplace"
                data-ocid={`cart-item-${item.productId}`}
              >
                {/* Product image */}
                <div className="w-20 h-20 rounded-lg bg-muted shrink-0 flex items-center justify-center border border-border overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product?.title ?? "Product"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm leading-snug truncate">
                    {product?.title ?? `Product #${item.productId.toString()}`}
                  </p>
                  <PriceDisplay
                    amount={item.priceAtAdd}
                    className="mt-1"
                    size="sm"
                  />

                  <div className="flex items-center gap-3 mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            Number(item.quantity) - 1,
                          )
                        }
                        disabled={updateCartItem.isPending}
                        aria-label="Decrease quantity"
                        data-ocid={`cart-qty-decrease-${item.productId}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold select-none">
                        {item.quantity.toString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            Number(item.quantity) + 1,
                          )
                        }
                        disabled={updateCartItem.isPending}
                        aria-label="Increase quantity"
                        data-ocid={`cart-qty-increase-${item.productId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(item.productId)}
                      disabled={removeFromCart.isPending}
                      aria-label="Remove item"
                      data-ocid={`cart-remove-${item.productId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right pt-1">
                  <PriceDisplay
                    amount={item.priceAtAdd * item.quantity}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="sticky top-24">
          <Card className="p-5 border border-border bg-card space-y-4">
            <h2 className="font-semibold text-foreground">Order Summary</h2>
            <Separator />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal ({items.length}{" "}
                  {items.length === 1 ? "item" : "items"})
                </span>
                <PriceDisplay amount={totalAmount} size="sm" />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                {deliveryFee === 0n ? (
                  <span className="font-semibold text-accent">FREE</span>
                ) : (
                  <PriceDisplay amount={deliveryFee} size="sm" />
                )}
              </div>
              {deliveryFee > 0n && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
                  Add ₹{(FREE_DELIVERY_THRESHOLD - totalAmount).toString()} more
                  for free delivery
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center font-bold text-foreground">
              <span>Total</span>
              <PriceDisplay amount={grandTotal} size="md" />
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate({ to: "/checkout" })}
              data-ocid="cart-checkout-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              Proceed to Checkout
            </Button>

            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => navigate({ to: "/" })}
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <BuyerGuard>
      <CartContent />
    </BuyerGuard>
  );
}
