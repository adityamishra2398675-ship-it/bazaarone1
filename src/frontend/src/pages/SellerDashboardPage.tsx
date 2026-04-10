import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Package,
  PackageCheck,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { CategoryBadge } from "../components/CategoryBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { PriceDisplay } from "../components/PriceDisplay";
import { SellerGuard } from "../components/RoleGuard";
import { useAuth } from "../hooks/useAuth";
import { useActor } from "../hooks/useBackend";
import { useSellerProducts } from "../hooks/useProducts";
import type { Order } from "../types";
import { OrderStatus } from "../types";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
  ocid: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
  ocid,
}: StatCardProps) {
  return (
    <Card className="p-5 border border-border bg-card" data-ocid={ocid}>
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}
        >
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground font-display">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function SellerDashboardContent() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { actor, isFetching } = useActor();
  const { data: products, isLoading: productsLoading } = useSellerProducts();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySellerOrders() as Promise<Order[]>;
    },
    enabled: !!actor && !isFetching,
  });

  const totalProducts = products?.length ?? 0;
  const activeProducts = products?.filter((p) => p.isActive).length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const pendingOrders =
    orders?.filter(
      (o) =>
        o.status === OrderStatus.pending || o.status === OrderStatus.confirmed,
    ).length ?? 0;

  if (productsLoading || ordersLoading)
    return <LoadingSpinner variant="fullscreen" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {profile?.displayName ?? "Seller"}
            </span>{" "}
            👋 Here's your store overview.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/seller/products/new" })}
          className="gap-2"
          data-ocid="seller-add-product-btn"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts}
          colorClass="text-secondary"
          bgClass="bg-secondary/10"
          ocid="stat-total-products"
        />
        <StatCard
          icon={PackageCheck}
          label="Active Listings"
          value={activeProducts}
          colorClass="text-chart-3"
          bgClass="bg-chart-3/10"
          ocid="stat-active-products"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          colorClass="text-primary"
          bgClass="bg-primary/10"
          ocid="stat-total-orders"
        />
        <StatCard
          icon={TrendingUp}
          label="Pending Orders"
          value={pendingOrders}
          colorClass="text-accent"
          bgClass="bg-accent/10"
          ocid="stat-pending-orders"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/seller/products">
          <Card className="p-4 border border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-smooth cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Manage Products
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add, edit, or remove listings
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
          </Card>
        </Link>
        <Link to="/seller/orders">
          <Card className="p-4 border border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-smooth cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Manage Orders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    View and update order status
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
          </Card>
        </Link>
      </div>

      <Separator className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card className="border border-border bg-card">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="font-semibold text-foreground">My Products</h2>
            <Link to="/seller/products">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs hover:text-primary"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <Separator />
          <div className="p-5">
            {!products || products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-3">
                  No products yet
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/seller/products/new" })}
                  data-ocid="seller-first-product-btn"
                >
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p) => (
                  <div
                    key={p.id.toString()}
                    className="flex items-center gap-3"
                    data-ocid={`seller-product-row-${p.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img
                        src={
                          p.images?.[0]?.getDirectURL?.() ??
                          "/assets/images/placeholder.svg"
                        }
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/images/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CategoryBadge
                          category={p.category}
                          size="sm"
                          showIcon={false}
                        />
                        <PriceDisplay amount={p.price} size="sm" />
                      </div>
                    </div>
                    <Link
                      to="/seller/products/$id/edit"
                      params={{ id: p.id.toString() }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-primary"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="border border-border bg-card">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link to="/seller/orders">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs hover:text-primary"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <Separator />
          <div className="p-5">
            {!orders || orders.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id.toString()}
                    className="flex items-center justify-between gap-3"
                    data-ocid={`seller-order-row-${order.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Order #{order.id.toString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <OrderStatusBadge
                        status={order.status}
                        showIcon={false}
                      />
                      <PriceDisplay
                        amount={order.total}
                        size="sm"
                        className="justify-end"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <SellerGuard>
      <SellerDashboardContent />
    </SellerGuard>
  );
}
