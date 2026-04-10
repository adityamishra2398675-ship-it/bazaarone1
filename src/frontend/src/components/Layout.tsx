import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Category } from "../backend.d";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "../types";

const CATEGORIES = [
  Category.electronics,
  Category.clothes,
  Category.books,
  Category.groceries,
  Category.essentials,
  Category.others,
];

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Layout({ children, onSearch, searchValue = "" }: LayoutProps) {
  const { isAuthenticated, login, logout, profile, isSeller } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200">
                One Bajar
              </span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl hidden sm:flex"
            >
              <div className="flex w-full">
                <Input
                  type="search"
                  placeholder="Search products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none border-r-0 bg-input focus-visible:ring-1 focus-visible:ring-primary"
                  data-ocid="header-search-input"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="rounded-l-none shrink-0"
                  data-ocid="header-search-btn"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {/* Cart */}
              {isAuthenticated && !isSeller && (
                <Link to="/cart" data-ocid="header-cart-btn">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-marketplace hover:text-primary"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary">
                        {itemCount > 99 ? "99+" : itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* Auth / Profile */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={isSeller ? "/seller" : "/account"}
                    data-ocid="header-profile-btn"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 transition-marketplace hover:text-primary"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden md:inline max-w-[100px] truncate">
                        {profile?.displayName ?? "Account"}
                      </span>
                      <ChevronDown className="w-3 h-3 hidden md:inline" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                    className="hidden sm:flex"
                    data-ocid="header-logout-btn"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => login()}
                  className="gap-1.5"
                  data-ocid="header-login-btn"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-3">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0"
                data-ocid="mobile-search-input"
              />
              <Button
                type="submit"
                variant="default"
                className="rounded-l-none shrink-0"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Category Nav */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to="/"
                  search={{ category: cat }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-marketplace ${
                    currentPath === "/"
                      ? "hover:bg-primary-foreground/20"
                      : "hover:bg-primary-foreground/10"
                  } text-primary-foreground hover:text-primary-foreground`}
                  data-ocid={`category-nav-${cat}`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{CATEGORY_LABELS[cat]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-card border-t border-border py-3 px-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isSeller ? "/seller" : "/account"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <User className="w-4 h-4" />{" "}
                    {profile?.displayName ?? "My Account"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Login / Sign Up
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <Separator />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Store className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  One Bajar
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Your all-in-one marketplace — from daily groceries to
                electronics. Shop smarter, deliver faster.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <li key={cat}>
                    <Link
                      to="/"
                      search={{ category: cat }}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {CATEGORY_LABELS[cat]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/account"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    My Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seller"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    Sell on One Bajar
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "onebajar")}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
