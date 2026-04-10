import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Package,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryBadge } from "../components/CategoryBadge";
import { EmptyState } from "../components/EmptyState";
import { PriceDisplay } from "../components/PriceDisplay";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProduct, useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? "fill-accent text-accent" : "text-border"}`}
          />
        ))}
      </div>
      <span className="font-semibold text-sm text-foreground">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count} reviews)</span>
      )}
    </div>
  );
}

function ImageGallery({
  images,
  title,
}: { images: Product["images"]; title: string }) {
  const [active, setActive] = useState(0);

  const urls =
    images.length > 0
      ? images.map(
          (img) => img.getDirectURL?.() ?? "/assets/images/placeholder.svg",
        )
      : ["/assets/images/placeholder.svg"];

  const prev = () => setActive((a) => (a - 1 + urls.length) % urls.length);
  const next = () => setActive((a) => (a + 1) % urls.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border">
        <img
          src={urls[active]}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-marketplace shadow-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-marketplace shadow-card"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {urls.map((url, i) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-smooth ${i === active ? "w-4 h-2 bg-primary" : "w-2 h-2 bg-primary/30"}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {urls.map((url, i) => (
            <button
              type="button"
              key={url}
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-marketplace ${i === active ? "border-primary" : "border-border hover:border-primary/40"}`}
            >
              <img
                src={url}
                alt={`${title} view ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsSection() {
  const SAMPLE_REVIEWS = [
    {
      name: "Rahul S.",
      rating: 5,
      comment: "Excellent quality! Delivered on time. Highly recommend.",
      date: "2 days ago",
    },
    {
      name: "Priya M.",
      rating: 4,
      comment: "Good product, packaging was neat. Would buy again.",
      date: "1 week ago",
    },
    {
      name: "Amit K.",
      rating: 5,
      comment: "Super fast delivery and authentic product. Very happy!",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
        <div className="text-center shrink-0">
          <p className="font-display font-bold text-4xl text-foreground">4.3</p>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${s <= 4 ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">128 reviews</p>
        </div>
        <Separator orientation="vertical" className="h-16" />
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct =
              stars === 5
                ? 60
                : stars === 4
                  ? 25
                  : stars === 3
                    ? 10
                    : stars === 2
                      ? 3
                      : 2;
            return (
              <div
                key={stars}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="w-4">{stars}★</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        {SAMPLE_REVIEWS.map((review) => (
          <div
            key={review.name}
            className="border border-border rounded-xl p-4 bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {review.name}
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= review.rating ? "fill-accent text-accent" : "text-border"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {review.date}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();
  const productId = id ? BigInt(id) : null;

  const { data: product, isLoading } = useProduct(productId);
  const { data: allProducts = [] } = useProducts({ inStockOnly: false });
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          emoji="📦"
          title="Product not found"
          description="This product may no longer be available."
          action={{
            label: "Browse Products",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0n;
  const isQuickDelivery =
    product.deliveryEstimate.toLowerCase().includes("min") ||
    product.deliveryEstimate.toLowerCase().includes("hour");
  const maxQty = Math.min(Number(product.stock), 10);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate({ to: "/login" });
      return;
    }
    if (!isBuyer) {
      toast.error("Only buyers can add to cart");
      return;
    }
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
      });
      toast.success(`${product.title} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    await handleAddToCart();
    navigate({ to: "/checkout" });
  };

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.category === product.category && p.id !== product.id && p.stock > 0n,
    )
    .slice(0, 4);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link
            to="/"
            className="hover:text-primary transition-colors duration-200"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            to="/"
            search={{ category: product.category }}
            className="hover:text-primary transition-colors duration-200 capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-foreground font-medium line-clamp-1">
            {product.title}
          </span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">
          <ImageGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge category={product.category} />
                  {isQuickDelivery && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs gap-1">
                      <Zap className="w-3 h-3" /> Quick Delivery
                    </Badge>
                  )}
                  {product.rating >= 4.5 && (
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                      ⭐ Bestseller
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  aria-label="Share product"
                  data-ocid="share-product-btn"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight">
                {product.title}
              </h1>
            </div>

            {product.rating > 0 && (
              <StarRating rating={product.rating} count={128} />
            )}

            <div className="bg-muted/30 rounded-xl p-4">
              <PriceDisplay amount={product.price} size="lg" />
              <p className="text-xs text-muted-foreground mt-1">
                Inclusive of all taxes
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package
                  className={`w-4 h-4 ${isOutOfStock ? "text-destructive" : "text-accent"}`}
                />
                {isOutOfStock ? (
                  <span className="text-destructive font-medium">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-accent font-medium">
                    In Stock{" "}
                    <span className="text-muted-foreground font-normal">
                      ({Number(product.stock)} units left)
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isQuickDelivery ? (
                  <Zap className="w-4 h-4 text-secondary shrink-0" />
                ) : (
                  <Truck className="w-4 h-4 shrink-0" />
                )}
                <span>{product.deliveryEstimate}</span>
              </div>
            </div>

            <Separator />

            {!isOutOfStock && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-2 hover:bg-muted disabled:opacity-40 transition-marketplace"
                      aria-label="Decrease quantity"
                      data-ocid="qty-decrease-btn"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center border-x border-border">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(maxQty, q + 1))
                      }
                      disabled={quantity >= maxQty}
                      className="px-3 py-2 hover:bg-muted disabled:opacity-40 transition-marketplace"
                      aria-label="Increase quantity"
                      data-ocid="qty-increase-btn"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Max {maxQty} per order
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2 border-primary text-primary hover:bg-primary/5"
                disabled={isOutOfStock || addToCart.isPending}
                onClick={handleAddToCart}
                data-ocid="product-add-to-cart-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAuthenticated
                  ? addToCart.isPending
                    ? "Adding..."
                    : "Add to Cart"
                  : "Login to Buy"}
              </Button>
              {isAuthenticated && isBuyer && (
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  data-ocid="buy-now-btn"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { Icon: ShieldCheck, label: "Secure Checkout" },
                { Icon: Truck, label: "Fast Delivery" },
                { Icon: Clock, label: "Easy Returns" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-2 bg-muted/30 rounded-lg text-center"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <Tabs defaultValue="description">
            <TabsList className="mb-4" data-ocid="product-tabs">
              <TabsTrigger value="description" data-ocid="tab-description">
                Description
              </TabsTrigger>
              <TabsTrigger value="reviews" data-ocid="tab-reviews">
                Reviews (128)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description ||
                    "No description available for this product."}
                </p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <CategoryBadge category={product.category} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Currency
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {product.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Delivery
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {product.deliveryEstimate}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewsSection />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-foreground">
                Similar Products
              </h2>
              <Link to="/" search={{ category: product.category }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary/30"
                >
                  See All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id.toString()}
                  product={related}
                  onAddToCart={async (p) => {
                    if (!isAuthenticated) {
                      navigate({ to: "/login" });
                      return;
                    }
                    if (!isBuyer) {
                      toast.error("Only buyers can add to cart");
                      return;
                    }
                    try {
                      await addToCart.mutateAsync({
                        productId: p.id,
                        quantity: 1n,
                      });
                      toast.success(`${p.title} added to cart!`);
                    } catch {
                      toast.error("Failed to add to cart");
                    }
                  }}
                  showAddToCart={isAuthenticated && isBuyer}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
