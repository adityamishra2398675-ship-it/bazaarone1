import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { PriceDisplay } from "../components/PriceDisplay";
import { useActor } from "../hooks/useBackend";
import type { Order } from "../types";

// Search params for this page
interface OrderConfirmationSearch {
  orderId?: string;
  estimated?: string;
}

const ORDER_STEPS = [
  { icon: CheckCircle2, label: "Order Confirmed", done: true },
  { icon: Package, label: "Processing", done: false },
  { icon: Truck, label: "Shipped", done: false },
  { icon: MapPin, label: "Delivered", done: false },
];

export default function OrderConfirmationPage() {
  // search params from navigation
  const search = useSearch({ strict: false }) as OrderConfirmationSearch;
  const { actor, isFetching: actorFetching } = useActor();

  const orderId = search.orderId ?? "—";
  const estimatedDelivery = search.estimated ?? "3–5 business days";
  const orderIdBigInt = orderId !== "—" ? BigInt(orderId) : null;

  // Fetch the placed order to get item titles
  const { data: order } = useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor || orderIdBigInt === null) return null;
      return actor.getOrder(orderIdBigInt) as Promise<Order | null>;
    },
    enabled: !!actor && !actorFetching && orderIdBigInt !== null,
  });

  const items = order?.items ?? [];

  return (
    <div className="min-h-[70vh] bg-background flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Success Header */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-card">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for shopping with One Bajar. Your order has been received
            and is being processed.
          </p>

          <div className="mt-5 bg-muted/40 rounded-xl px-5 py-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold text-foreground text-xs bg-muted px-2 py-1 rounded">
                #{orderId}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium text-foreground text-sm">
                {estimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Progress */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wide">
            Order Status
          </h2>
          <div className="relative flex items-start justify-between">
            {/* Track line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-primary transition-smooth"
              style={{ width: "0%" }}
            />
            {ORDER_STEPS.map((step) => (
              <div
                key={step.label}
                className="flex flex-col items-center gap-2 relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-smooth ${
                    step.done
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium text-center max-w-[60px] leading-tight ${
                    step.done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Items Summary */}
        {order && items.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Items Ordered
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId.toString()}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-foreground">
                      {item.title}
                      <span className="text-muted-foreground ml-1.5">
                        × {item.quantity.toString()}
                      </span>
                    </span>
                  </div>
                  <PriceDisplay
                    amount={item.priceAtOrder * item.quantity}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-foreground">Total Paid</span>
              <PriceDisplay
                amount={items.reduce(
                  (sum, item) => sum + item.priceAtOrder * item.quantity,
                  0n,
                )}
                size="md"
              />
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/orders" className="flex-1">
            <Button
              variant="outline"
              className="w-full gap-2"
              data-ocid="order-confirm-view-orders"
            >
              <Package className="w-4 h-4" />
              View My Orders
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button
              className="w-full gap-2"
              data-ocid="order-confirm-continue-shopping"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
