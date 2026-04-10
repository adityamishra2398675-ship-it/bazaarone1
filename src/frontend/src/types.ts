import type { Principal } from "@icp-sdk/core/principal";

export type { Principal };

export type UserId = Principal;
export type ProductId = bigint;
export type OrderId = bigint;
export type Timestamp = bigint;

// Re-export enums from backend
export { Category, OrderStatus, PaymentMethod, UserRole } from "./backend.d";

export interface Address {
  id: bigint;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: UserId;
  displayName: string;
  phone: string;
  role: import("./backend.d").UserRole;
  addresses: Address[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ExternalBlobLike {
  getDirectURL(): string;
}

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  price: bigint;
  currency: string;
  category: import("./backend.d").Category;
  images: ExternalBlobLike[];
  rating: number;
  stock: bigint;
  sellerId: UserId;
  deliveryEstimate: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CartItem {
  productId: ProductId;
  quantity: bigint;
  priceAtAdd: bigint;
}

export interface Cart {
  buyerId: UserId;
  items: CartItem[];
  totalAmount: bigint;
}

export interface OrderItem {
  productId: ProductId;
  title: string;
  quantity: bigint;
  priceAtOrder: bigint;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: OrderId;
  buyerId: UserId;
  sellerId: UserId;
  items: OrderItem[];
  total: bigint;
  deliveryAddress: DeliveryAddress;
  paymentMethod: import("./backend.d").PaymentMethod;
  status: import("./backend.d").OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  estimatedDelivery: string;
}

export interface ProductFilter {
  keyword?: string;
  category?: import("./backend.d").Category;
  minPrice?: bigint;
  maxPrice?: bigint;
  minRating?: number;
  inStockOnly: boolean;
}

export const CATEGORY_LABELS: Record<import("./backend.d").Category, string> = {
  groceries: "Groceries",
  others: "Others",
  clothes: "Clothes",
  books: "Books",
  essentials: "Essentials",
  electronics: "Electronics",
};

export const CATEGORY_ICONS: Record<import("./backend.d").Category, string> = {
  electronics: "📱",
  clothes: "👕",
  books: "📚",
  groceries: "🛒",
  essentials: "🧴",
  others: "📦",
};

export const ORDER_STATUS_LABELS: Record<
  import("./backend.d").OrderStatus,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_METHOD_LABELS: Record<
  import("./backend.d").PaymentMethod,
  string
> = {
  cashOnDelivery: "Cash on Delivery",
  upi: "UPI",
  card: "Card",
};
