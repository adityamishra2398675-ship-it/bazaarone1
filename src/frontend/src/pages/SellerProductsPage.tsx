import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ExternalBlob as ExternalBlobImpl } from "../backend";
import { CategoryBadge } from "../components/CategoryBadge";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriceDisplay } from "../components/PriceDisplay";
import { SellerGuard } from "../components/RoleGuard";
import { useActor } from "../hooks/useBackend";
import { useSellerProducts } from "../hooks/useProducts";
import type { Product } from "../types";

const LOW_STOCK_THRESHOLD = 5;

function StockBadge({ stock }: { stock: bigint }) {
  const stockNum = Number(stock);
  if (stockNum === 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
        <AlertTriangle className="w-3 h-3" />
        Out of Stock
      </span>
    );
  }
  if (stockNum < LOW_STOCK_THRESHOLD) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-accent">
        <AlertTriangle className="w-3 h-3" />
        Low: {stockNum}
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground font-medium">
      Stock: {stockNum}
    </span>
  );
}

function ProductRow({
  product,
  onDelete,
  onToggleActive,
}: {
  product: Product;
  onDelete: (id: bigint, title: string) => void;
  onToggleActive: (product: Product) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-4"
      data-ocid={`seller-product-${product.id}`}
    >
      {/* Image */}
      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
        <img
          src={
            product.images?.[0]?.getDirectURL?.() ??
            "/assets/images/placeholder.svg"
          }
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate text-sm">
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <CategoryBadge
            category={product.category}
            size="sm"
            showIcon={false}
          />
          <PriceDisplay amount={product.price} size="sm" />
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Active Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={product.isActive}
                onCheckedChange={() => onToggleActive(product)}
                data-ocid={`toggle-active-${product.id}`}
                aria-label={
                  product.isActive ? "Deactivate product" : "Activate product"
                }
              />
              <Badge
                variant={product.isActive ? "outline" : "secondary"}
                className={`text-xs shrink-0 ${product.isActive ? "border-chart-3/30 text-chart-3 bg-chart-3/10" : ""}`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {product.isActive
              ? "Click to deactivate listing"
              : "Click to activate listing"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          to="/seller/products/$id/edit"
          params={{ id: product.id.toString() }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary hover:bg-primary/10 transition-marketplace"
            data-ocid={`edit-product-${product.id}`}
            aria-label="Edit product"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-marketplace"
          onClick={() => onDelete(product.id, product.title)}
          data-ocid={`delete-product-${product.id}`}
          aria-label="Delete product"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function SellerProductsContent() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useSellerProducts();

  const deleteProduct = useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const toggleActive = useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        deliveryEstimate: product.deliveryEstimate,
        currency: product.currency,
        isActive: !product.isActive,
        images: product.images.map((img) =>
          ExternalBlobImpl.fromURL(img.getDirectURL()),
        ),
      });
    },
    onSuccess: (_, product) => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      toast.success(
        `Product ${!product.isActive ? "activated" : "deactivated"}`,
      );
    },
    onError: () => toast.error("Failed to update product status"),
  });

  const handleDelete = (productId: bigint, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteProduct.mutate(productId);
  };

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            My Products
          </h1>
          {products && products.length > 0 && (
            <p className="text-muted-foreground text-sm mt-0.5">
              {products.length} product{products.length !== 1 ? "s" : ""} •{" "}
              {products.filter((p) => p.isActive).length} active
            </p>
          )}
        </div>
        <Button
          onClick={() => navigate({ to: "/seller/products/new" })}
          className="gap-2"
          data-ocid="seller-products-add-btn"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="No products listed yet"
          description="Start selling on One Bajar by adding your first product. Reach thousands of buyers!"
          action={{
            label: "Add Product",
            onClick: () => navigate({ to: "/seller/products/new" }),
          }}
        />
      ) : (
        <Card
          className="border border-border bg-card overflow-hidden"
          data-ocid="seller-products-list"
        >
          {/* Table Header */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 bg-muted/40 border-b border-border">
            <div className="w-14 shrink-0" />
            <p className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Product
            </p>
            <p className="w-40 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:block">
              Status
            </p>
            <p className="w-20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Actions
            </p>
          </div>

          {products.map((product, idx) => (
            <div key={product.id.toString()}>
              <ProductRow
                product={product}
                onDelete={handleDelete}
                onToggleActive={(p) => toggleActive.mutate(p)}
              />
              {idx < products.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <SellerGuard>
      <SellerProductsContent />
    </SellerGuard>
  );
}
