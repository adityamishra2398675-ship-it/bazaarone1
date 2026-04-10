import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import LoginPage from "./pages/LoginPage";

// Lazy page imports
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage"));
const SellerProductsPage = lazy(() => import("./pages/SellerProductsPage"));
const SellerNewProductPage = lazy(() => import("./pages/SellerNewProductPage"));
const SellerEditProductPage = lazy(
  () => import("./pages/SellerEditProductPage"),
);
const SellerOrdersPage = lazy(() => import("./pages/SellerOrdersPage"));
const OrderConfirmationPage = lazy(
  () => import("./pages/OrderConfirmationPage"),
);

function PageLoader() {
  return <LoadingSpinner variant="fullscreen" />;
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Login (no layout)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Layout wrapper route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Buyer / Public routes
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/product/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProductDetailPage />
    </Suspense>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cart",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CartPage />
    </Suspense>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/checkout",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const ordersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/orders",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <OrdersPage />
    </Suspense>
  ),
});

const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/orders/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <OrderDetailPage />
    </Suspense>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/account",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AccountPage />
    </Suspense>
  ),
});

// Seller routes
const sellerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/seller",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SellerDashboardPage />
    </Suspense>
  ),
});

const sellerProductsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/seller/products",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SellerProductsPage />
    </Suspense>
  ),
});

const sellerNewProductRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/seller/products/new",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SellerNewProductPage />
    </Suspense>
  ),
});

const sellerEditProductRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/seller/products/$id/edit",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SellerEditProductPage />
    </Suspense>
  ),
});

const sellerOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/seller/orders",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SellerOrdersPage />
    </Suspense>
  ),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/order-confirmation",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <OrderConfirmationPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    cartRoute,
    checkoutRoute,
    ordersRoute,
    orderDetailRoute,
    accountRoute,
    sellerRoute,
    sellerProductsRoute,
    sellerNewProductRoute,
    sellerEditProductRoute,
    sellerOrdersRoute,
    orderConfirmationRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
