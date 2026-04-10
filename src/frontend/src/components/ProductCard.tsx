import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star, Zap } from "lucide-react";
import type { Product } from "../types";
import { CategoryBadge } from "./CategoryBadge";
import { PriceDisplay } from "./PriceDisplay";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  showAddToCart = true,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0n;
  const isQuickDelivery =
    product.deliveryEstimate.toLowerCase().includes("min") ||
    product.deliveryEstimate.toLowerCase().includes("hour");
  const imageUrl =
    product.images?.[0]?.getDirectURL?.() ?? "/assets/images/placeholder.svg";

  return (
    <Card
      className="group overflow-hidden border border-border bg-card shadow-card hover:shadow-elevated transition-marketplace hover:-translate-y-0.5 cursor-pointer"
      data-ocid={`product-card-${product.id}`}
    >
      <Link
        to="/product/$id"
        params={{ id: product.id.toString() }}
        className="block"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-marketplace"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}
          {isQuickDelivery && !isOutOfStock && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-secondary text-secondary-foreground text-xs gap-1">
                <Zap className="w-3 h-3" />
                Quick
              </Badge>
            </div>
          )}
          {product.rating >= 4.5 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-accent text-accent-foreground text-xs">
                Bestseller
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground text-sm line-clamp-2 leading-tight flex-1 min-w-0">
              {product.title}
            </h3>
          </div>

          <CategoryBadge category={product.category} size="sm" />

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" />
                {product.rating.toFixed(1)}
              </div>
            </div>
          )}

          {/* Price */}
          <PriceDisplay
            amount={product.price}
            className="text-base font-bold"
          />

          {/* Delivery */}
          <p className="text-xs text-muted-foreground truncate">
            {product.deliveryEstimate}
          </p>
        </div>
      </Link>

      {/* Add to Cart */}
      {showAddToCart && !isOutOfStock && onAddToCart && (
        <div className="px-3 pb-3">
          <Button
            size="sm"
            className="w-full gap-1.5 transition-marketplace"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            data-ocid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
