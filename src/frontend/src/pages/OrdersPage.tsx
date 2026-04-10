import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Package } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { PriceDisplay } from "../components/PriceDisplay";
import { BuyerGuard } from "../components/RoleGuard";
import { useActor } from "../hooks/useBackend";
import type { Order } from "../types";

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrdersContent() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders() as Promise<Order[]>;
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;

  // Sort by date descending
  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          My Orders
        </h1>
        {sortedOrders.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {sortedOrders.length} order{sortedOrders.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {sortedOrders.length === 0 ? (
        <EmptyState
          emoji="📦"
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your orders here!"
          action={{ label: "Shop Now", onClick: () => navigate({ to: "/" }) }}
        />
      ) : (
        <div className="space-y-3" data-ocid="orders-list">
          {sortedOrders.map((order) => (
            <Link
              key={order.id.toString()}
              to="/orders/$id"
              params={{ id: order.id.toString() }}
              data-ocid={`order-row-${order.id}`}
            >
              <Card className="p-4 border border-border bg-card hover:shadow-elevated transition-marketplace cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm">
                        Order #{order.id.toString()}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        <span>{formatDate(order.createdAt)}</span>
                        <span className="text-border">•</span>
                        <span>
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status + Price + Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:flex flex-col items-end gap-1">
                      <OrderStatusBadge status={order.status} />
                      <PriceDisplay
                        amount={order.total}
                        size="sm"
                        className="justify-end"
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Mobile: Status row */}
                <div className="mt-2.5 flex items-center justify-between sm:hidden">
                  <OrderStatusBadge status={order.status} />
                  <PriceDisplay amount={order.total} size="sm" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          data-ocid="continue-shopping-btn"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <BuyerGuard>
      <OrdersContent />
    </BuyerGuard>
  );
}
