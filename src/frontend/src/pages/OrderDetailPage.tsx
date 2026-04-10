import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  CreditCard,
  Home,
  MapPin,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { OrderStatus } from "../backend.d";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { PriceDisplay } from "../components/PriceDisplay";
import { BuyerGuard } from "../components/RoleGuard";
import { useActor } from "../hooks/useBackend";
import { PAYMENT_METHOD_LABELS } from "../types";
import type { Order } from "../types";

const STATUS_STEPS = [
  { status: OrderStatus.confirmed, label: "Confirmed", icon: CheckCircle },
  { status: OrderStatus.shipped, label: "Shipped", icon: Package },
  {
    status: OrderStatus.outForDelivery,
    label: "Out for Delivery",
    icon: Truck,
  },
  { status: OrderStatus.delivered, label: "Delivered", icon: Home },
];

const STATUS_ORDER = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.shipped,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
];

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderDetailContent() {
  const { id } = useParams({ from: "/layout/orders/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(BigInt(id)) as Promise<Order | null>;
    },
    enabled: !!actor && !isFetching,
  });

  const reorder = useMutation({
    mutationFn: async () => {
      if (!actor || !order) throw new Error("No actor");
      return actor.reorder(order.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Items added to cart!");
      navigate({ to: "/cart" });
    },
    onError: () => toast.error("Failed to reorder"),
  });

  const cancelOrder = useMutation({
    mutationFn: async () => {
      if (!actor || !order) throw new Error("No actor");
      return actor.cancelOrder(order.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled");
    },
    onError: () => toast.error("Failed to cancel order"),
  });

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;
  if (!order)
    return (
      <EmptyState
        emoji="😕"
        title="Order not found"
        description="This order doesn't exist or you don't have access to it."
        action={{
          label: "My Orders",
          onClick: () => navigate({ to: "/orders" }),
        }}
      />
    );

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === OrderStatus.cancelled;
  const canCancel =
    order.status === OrderStatus.pending ||
    order.status === OrderStatus.confirmed;

  const deliveryFee = BigInt(0);
  const subtotal = order.total - deliveryFee;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 -ml-2 mb-2 text-muted-foreground"
            onClick={() => navigate({ to: "/orders" })}
            data-ocid="back-to-orders-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            My Orders
          </Button>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Order #{order.id.toString()}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Placed on {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className="shrink-0 mt-7">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelled ? (
        <Card className="p-5 border border-border bg-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Order Status</h2>
            <p className="text-xs text-muted-foreground">
              Est. delivery:{" "}
              <span className="font-medium text-foreground">
                {order.estimatedDelivery}
              </span>
            </p>
          </div>
          <div className="flex items-start">
            {STATUS_STEPS.map((step, i) => {
              const stepIndex = STATUS_ORDER.indexOf(step.status);
              const isCompleted = currentStatusIndex >= stepIndex;
              const isCurrent = currentStatusIndex === stepIndex;
              return (
                <div key={step.status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs mt-1.5 text-center leading-tight max-w-[60px] ${
                        isCompleted
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                        currentStatusIndex > stepIndex
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-4 border border-destructive/20 bg-destructive/5 mb-4">
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Order Cancelled</p>
              <p className="text-sm opacity-80">
                This order has been cancelled.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Order Items */}
      <Card className="p-5 border border-border bg-card mb-4">
        <h2 className="font-semibold text-foreground mb-4">
          Items Ordered ({order.items.length})
        </h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.productId.toString()}
              className="flex items-center justify-between gap-3"
              data-ocid={`order-item-${item.productId}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity.toString()} ×{" "}
                    <span className="font-mono">
                      ₹{Number(item.priceAtOrder).toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              </div>
              <PriceDisplay
                amount={item.priceAtOrder * item.quantity}
                size="sm"
                className="shrink-0"
              />
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              Subtotal ({order.items.length} item
              {order.items.length !== 1 ? "s" : ""})
            </span>
            <PriceDisplay amount={subtotal} size="sm" />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span className="text-accent font-medium">FREE</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-foreground text-base">
            <span>Total</span>
            <PriceDisplay amount={order.total} size="md" />
          </div>
        </div>
      </Card>

      {/* Delivery + Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card className="p-4 border border-border bg-card">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Delivery Address
          </h2>
          <div className="text-sm space-y-0.5">
            <p className="font-medium text-foreground">
              {order.deliveryAddress.name}
            </p>
            <p className="text-muted-foreground">
              {order.deliveryAddress.addressLine1}
            </p>
            {order.deliveryAddress.addressLine2 && (
              <p className="text-muted-foreground">
                {order.deliveryAddress.addressLine2}
              </p>
            )}
            <p className="text-muted-foreground">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} —{" "}
              {order.deliveryAddress.pincode}
            </p>
            <p className="text-muted-foreground mt-1">
              📱 +91 {order.deliveryAddress.phone}
            </p>
          </div>
        </Card>

        <Card className="p-4 border border-border bg-card">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Payment
          </h2>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium text-foreground">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Amount Paid:</span>
              <PriceDisplay amount={order.total} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-accent font-medium text-xs bg-accent/10 px-2 py-0.5 rounded">
                {isCancelled ? "Refund Pending" : "Confirmed"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="gap-2 flex-1"
          onClick={() => reorder.mutate()}
          disabled={reorder.isPending}
          data-ocid="order-reorder-btn"
        >
          <RotateCcw className="w-4 h-4" />
          {reorder.isPending ? "Adding..." : "Reorder"}
        </Button>
        {canCancel && (
          <Button
            variant="destructive"
            className="gap-2 flex-1"
            onClick={() => cancelOrder.mutate()}
            disabled={cancelOrder.isPending}
            data-ocid="order-cancel-btn"
          >
            <XCircle className="w-4 h-4" />
            {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <BuyerGuard>
      <OrderDetailContent />
    </BuyerGuard>
  );
}
