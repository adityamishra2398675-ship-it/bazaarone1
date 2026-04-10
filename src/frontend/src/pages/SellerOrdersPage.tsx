import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Eye, MapPin, Package, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { PriceDisplay } from "../components/PriceDisplay";
import { SellerGuard } from "../components/RoleGuard";
import { useActor } from "../hooks/useBackend";
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
  PAYMENT_METHOD_LABELS,
} from "../types";
import type { Order } from "../types";

const UPDATABLE_STATUSES = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.shipped,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
];

function OrderDetailModal({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  const orderDate = new Date(Number(order.createdAt) / 1_000_000);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order #{order.id.toString()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status & Date */}
          <div className="flex items-center justify-between">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-muted-foreground">
              {orderDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              Order Items
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.productId.toString()}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40"
                >
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
                  <PriceDisplay
                    amount={item.priceAtOrder * item.quantity}
                    size="sm"
                    className="shrink-0 ml-3"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <PriceDisplay amount={order.total} size="md" />
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Delivery Address
            </h4>
            <div className="p-3 rounded-lg bg-muted/40 text-sm">
              <p className="font-semibold text-foreground">
                {order.deliveryAddress.name}
              </p>
              <p className="text-muted-foreground">
                {order.deliveryAddress.phone}
              </p>
              <p className="text-muted-foreground mt-1">
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2
                  ? `, ${order.deliveryAddress.addressLine2}`
                  : ""}
              </p>
              <p className="text-muted-foreground">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} —{" "}
                {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment & Delivery Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Payment Method
              </p>
              <Badge variant="outline" className="text-xs">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-1 text-foreground text-xs">
                <Truck className="w-3 h-3 text-muted-foreground" />
                {order.estimatedDelivery}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SellerOrdersContent() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySellerOrders() as Promise<Order[]>;
    },
    enabled: !!actor && !isFetching,
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;

  const pendingCount =
    orders?.filter(
      (o) =>
        o.status === OrderStatus.pending || o.status === OrderStatus.confirmed,
    ).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Manage Orders
          </h1>
          {orders && orders.length > 0 && (
            <p className="text-muted-foreground text-sm mt-0.5">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
              {pendingCount > 0 && (
                <span className="ml-2 text-accent font-semibold">
                  • {pendingCount} need attention
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="No orders yet"
          description="Orders from buyers will appear here once they purchase your products."
          action={{
            label: "View Products",
            onClick: () => navigate({ to: "/seller/products" }),
          }}
        />
      ) : (
        <div className="space-y-4" data-ocid="seller-orders-list">
          {orders.map((order) => {
            const orderDate = new Date(Number(order.createdAt) / 1_000_000);
            const isTerminal =
              order.status === OrderStatus.delivered ||
              order.status === OrderStatus.cancelled;

            return (
              <Card
                key={order.id.toString()}
                className="border border-border bg-card"
                data-ocid={`seller-order-${order.id}`}
              >
                <div className="p-5">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Order #{order.id.toString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {orderDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          • {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <PriceDisplay amount={order.total} size="sm" />
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {order.items.map((item) => (
                      <span
                        key={item.productId.toString()}
                        className="text-xs bg-muted/60 text-muted-foreground px-2 py-1 rounded-md"
                      >
                        {item.title} × {item.quantity.toString()}
                      </span>
                    ))}
                  </div>

                  {/* Delivery address preview */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} —{" "}
                      {order.deliveryAddress.pincode}
                    </span>
                  </div>

                  <Separator className="mb-4" />

                  {/* Actions Row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs hover:text-primary hover:border-primary/40"
                      onClick={() => setSelectedOrder(order)}
                      data-ocid={`view-order-detail-${order.id}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>

                    {!isTerminal && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Update Status:
                        </span>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: v as OrderStatus,
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger
                            className="w-48 h-8 text-xs"
                            data-ocid={`update-status-${order.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {UPDATABLE_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {ORDER_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <SellerGuard>
      <SellerOrdersContent />
    </SellerGuard>
  );
}
