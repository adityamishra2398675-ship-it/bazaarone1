import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend.d";
import { CategoryBadge } from "../components/CategoryBadge";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "../types";

const CATEGORIES = [
  Category.electronics,
  Category.clothes,
  Category.books,
  Category.groceries,
  Category.essentials,
  Category.others,
];

const HERO_SLIDES = [
  {
    title: "Shop Everything",
    subtitle:
      "From fresh groceries to the latest electronics — all in one place",
    cta: "Shop Now",
    bg: "from-primary/90 to-primary/60",
  },
  {
    title: "Quick Delivery",
    subtitle:
      "Get daily essentials delivered in minutes, right to your doorstep",
    cta: "Order Groceries",
    bg: "from-secondary/90 to-secondary/60",
  },
  {
    title: "Best Deals Daily",
    subtitle: "Discover top offers on electronics, clothes, books and more",
    cta: "See Deals",
    bg: "from-accent/80 to-primary/70",
  },
];

const CATEGORY_CARDS = [
  {
    cat: Category.electronics,
    color: "bg-secondary/10 border-secondary/20 hover:bg-secondary/20",
  },
  {
    cat: Category.clothes,
    color: "bg-accent/10 border-accent/20 hover:bg-accent/20",
  },
  {
    cat: Category.books,
    color: "bg-chart-3/10 border-chart-3/20 hover:bg-chart-3/20",
  },
  {
    cat: Category.groceries,
    color: "bg-primary/10 border-primary/20 hover:bg-primary/20",
  },
  {
    cat: Category.essentials,
    color: "bg-chart-5/10 border-chart-5/20 hover:bg-chart-5/20",
  },
  { cat: Category.others, color: "bg-muted border-border hover:bg-muted/80" },
];

function HeroBanner({ onShopNow }: { onShopNow: () => void }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      4000,
    );
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="relative overflow-hidden rounded-2xl min-h-[280px] md:min-h-[360px]">
      <img
        src="/assets/generated/hero-marketplace.dim_1200x500.jpg"
        alt="One Bajar marketplace"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${current.bg} transition-smooth`}
      />
      <div className="relative z-10 flex flex-col justify-center h-full px-8 py-12 md:px-16 min-h-[280px] md:min-h-[360px]">
        <Badge className="mb-4 w-fit bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs">
          🇮🇳 India's All-in-One Marketplace
        </Badge>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-3 leading-tight max-w-lg">
          {current.title}
        </h1>
        <p className="text-primary-foreground/85 text-base md:text-lg mb-6 max-w-md leading-relaxed">
          {current.subtitle}
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated"
            onClick={onShopNow}
            data-ocid="hero-shop-now-btn"
          >
            {current.cta}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onShopNow}
            data-ocid="hero-explore-btn"
          >
            Explore Categories
          </Button>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
        {HERO_SLIDES.map((slideItem, i) => (
          <button
            type="button"
            key={slideItem.title}
            onClick={() => setSlide(i)}
            onKeyDown={(e) => e.key === "Enter" && setSlide(i)}
            className={`h-2 rounded-full transition-smooth ${i === slide ? "w-4 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  keyword: string;
  setKeyword: (v: string) => void;
  selectedCategory: Category | undefined;
  setSelectedCategory: (v: Category | undefined) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  keyword,
  setKeyword,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  onClearAll,
}: FilterSidebarProps) {
  const hasFilters =
    !!selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground h-6 px-2"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Keywords..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-8 text-sm"
            data-ocid="filter-keyword-input"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="absolute right-2.5 top-2.5"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Category
        </Label>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setSelectedCategory(undefined)}
            className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-marketplace ${!selectedCategory ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}
            data-ocid="filter-category-all"
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? undefined : cat)
              }
              className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-marketplace flex items-center gap-2 ${selectedCategory === cat ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}
              data-ocid={`filter-category-${cat}`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Price Range
        </Label>
        <div className="px-1">
          <Slider
            min={0}
            max={50000}
            step={500}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            className="w-full"
            data-ocid="filter-price-slider"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Min Rating
        </Label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {([0, 3, 3.5, 4, 4.5] as number[]).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-0.5 px-2 py-1 rounded text-xs border transition-marketplace ${minRating === r ? "bg-accent/10 border-accent/30 text-accent font-medium" : "border-border text-muted-foreground hover:border-accent/30"}`}
              data-ocid={`filter-rating-${r}`}
            >
              {r === 0 ? (
                "Any"
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock-toggle" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
        <Switch
          id="in-stock-toggle"
          checked={inStockOnly}
          onCheckedChange={setInStockOnly}
          data-ocid="filter-instock-toggle"
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as {
    category?: Category;
    q?: string;
  };
  const { isAuthenticated, isBuyer } = useAuth();

  const [keyword, setKeyword] = useState(searchParams.q ?? "");
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(searchParams.category);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.category);
  }, [searchParams.category]);

  const { data: allProducts = [], isLoading } = useProducts({
    inStockOnly: false,
  });
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(
    async (product: Product) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate({ to: "/login" });
        return;
      }
      if (!isBuyer) {
        toast.error("Only buyers can add items to cart");
        return;
      }
      try {
        await addToCart.mutateAsync({ productId: product.id, quantity: 1n });
        toast.success(`${product.title} added to cart!`);
      } catch {
        toast.error("Failed to add to cart");
      }
    },
    [addToCart, isAuthenticated, isBuyer, navigate],
  );

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (
        keyword &&
        !p.title.toLowerCase().includes(keyword.toLowerCase()) &&
        !p.description.toLowerCase().includes(keyword.toLowerCase())
      )
        return false;
      if (Number(p.price) < priceRange[0] || Number(p.price) > priceRange[1])
        return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (inStockOnly && p.stock === 0n) return false;
      return true;
    });
  }, [
    allProducts,
    selectedCategory,
    keyword,
    priceRange,
    minRating,
    inStockOnly,
  ]);

  const featuredProducts = useMemo(
    () =>
      allProducts.filter((p) => p.rating >= 4.0 && p.stock > 0n).slice(0, 8),
    [allProducts],
  );

  const clearFilters = () => {
    setKeyword("");
    setSelectedCategory(undefined);
    setPriceRange([0, 50000]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    !!selectedCategory ||
    !!keyword ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000 ||
    minRating > 0 ||
    inStockOnly;
  const isSearching = hasActiveFilters;

  const scrollToProducts = () =>
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      {!isSearching && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <HeroBanner onShopNow={scrollToProducts} />
        </section>
      )}

      {/* Category Grid */}
      {!isSearching && (
        <section className="bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl text-foreground mb-5">
              Shop by Category
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORY_CARDS.map(({ cat, color }) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${color} transition-marketplace group cursor-pointer`}
                  data-ocid={`category-card-${cat}`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-smooth select-none">
                    {CATEGORY_ICONS[cat]}
                  </span>
                  <span className="text-xs font-semibold text-foreground text-center leading-tight">
                    {CATEGORY_LABELS[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {!isSearching && featuredProducts.length > 0 && (
        <section className="py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-2xl text-foreground">
                🔥 Trending Now
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToProducts}
                className="text-primary border-primary/30 hover:bg-primary/5"
              >
                See All
              </Button>
            </div>
            {isLoading ? (
              <LoadingSpinner variant="skeleton-grid" count={8} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id.toString()}
                    product={product}
                    onAddToCart={handleAddToCart}
                    showAddToCart={isAuthenticated && isBuyer}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Products with Filters */}
      <section id="products-section" className="bg-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                {selectedCategory
                  ? CATEGORY_LABELS[selectedCategory]
                  : "All Products"}
              </h2>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory && (
                <CategoryBadge category={selectedCategory} />
              )}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-1.5"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                data-ocid="mobile-filter-btn"
              >
                <Filter className="w-3.5 h-3.5" /> Filters
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
                <FilterSidebar
                  keyword={keyword}
                  setKeyword={setKeyword}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  onClearAll={clearFilters}
                />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                <button
                  type="button"
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                  aria-label="Close filters"
                  onClick={() => setShowMobileFilters(false)}
                />
                <dialog
                  open
                  className="relative bg-card border-t border-border rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto w-full m-0"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg">
                      Filters
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <FilterSidebar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(v) => {
                      setSelectedCategory(v);
                      setShowMobileFilters(false);
                    }}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    onClearAll={() => {
                      clearFilters();
                      setShowMobileFilters(false);
                    }}
                  />
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Show {filteredProducts.length} Results
                  </Button>
                </dialog>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <LoadingSpinner variant="skeleton-grid" count={12} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  emoji="🔍"
                  title="No products found"
                  description={
                    hasActiveFilters
                      ? "Try adjusting your filters to see more results."
                      : "Check back later for new arrivals!"
                  }
                  action={
                    hasActiveFilters
                      ? { label: "Clear Filters", onClick: clearFilters }
                      : undefined
                  }
                />
              ) : (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  data-ocid="product-grid"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      onAddToCart={handleAddToCart}
                      showAddToCart={isAuthenticated && isBuyer}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      {!isSearching && (
        <section className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Fast Delivery",
                  desc: "Groceries in 30 mins",
                },
                {
                  icon: "💳",
                  title: "Secure Payments",
                  desc: "UPI, Card, COD",
                },
                {
                  icon: "↩️",
                  title: "Easy Returns",
                  desc: "7-day return policy",
                },
                { icon: "🏆", title: "Top Sellers", desc: "Verified quality" },
              ].map((badge) => (
                <div key={badge.title} className="flex items-center gap-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {badge.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
