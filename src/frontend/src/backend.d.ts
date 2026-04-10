import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: ProductId;
    deliveryEstimate: string;
    title: string;
    createdAt: Timestamp;
    description: string;
    isActive: boolean;
    updatedAt: Timestamp;
    stock: bigint;
    currency: string;
    category: Category;
    sellerId: UserId;
    rating: number;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    id: UserId;
    displayName: string;
    createdAt: Timestamp;
    role: UserRole;
    updatedAt: Timestamp;
    addresses: Array<Address>;
    phone: string;
}
export type Timestamp = bigint;
export interface OrderItem {
    title: string;
    productId: ProductId;
    quantity: bigint;
    priceAtOrder: bigint;
}
export interface UpdateProductInput {
    id: ProductId;
    deliveryEstimate: string;
    title: string;
    description: string;
    isActive: boolean;
    stock: bigint;
    currency: string;
    category: Category;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface Cart {
    totalAmount: bigint;
    buyerId: UserId;
    items: Array<CartItem>;
}
export interface DeliveryAddress {
    city: string;
    name: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    pincode: string;
}
export interface AddAddressInput {
    city: string;
    name: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    isDefault: boolean;
    phone: string;
    pincode: string;
}
export interface SaveProfileInput {
    displayName: string;
    role: UserRole;
    phone: string;
}
export interface PlaceOrderInput {
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    items: Array<{
        productId: ProductId;
        quantity: bigint;
    }>;
}
export interface UpdateCartItemInput {
    productId: ProductId;
    quantity: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    total: bigint;
    paymentMethod: PaymentMethod;
    createdAt: Timestamp;
    estimatedDelivery: string;
    updatedAt: Timestamp;
    buyerId: UserId;
    sellerId: UserId;
    items: Array<OrderItem>;
}
export interface ProductFilter {
    minRating?: number;
    inStockOnly: boolean;
    maxPrice?: bigint;
    category?: Category;
    keyword?: string;
    minPrice?: bigint;
}
export interface CreateProductInput {
    deliveryEstimate: string;
    title: string;
    description: string;
    stock: bigint;
    currency: string;
    category: Category;
    price: bigint;
    images: Array<ExternalBlob>;
}
export type UserId = Principal;
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
    priceAtAdd: bigint;
}
export type OrderId = bigint;
export interface Address {
    id: bigint;
    city: string;
    name: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    isDefault: boolean;
    phone: string;
    pincode: string;
}
export enum Category {
    groceries = "groceries",
    others = "others",
    clothes = "clothes",
    books = "books",
    essentials = "essentials",
    electronics = "electronics"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PaymentMethod {
    upi = "upi",
    cashOnDelivery = "cashOnDelivery",
    card = "card"
}
export enum UserRole {
    seller = "seller",
    buyer = "buyer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAddress(input: AddAddressInput): Promise<Address>;
    addToCart(productId: ProductId, quantity: bigint): Promise<Cart>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    cancelOrder(orderId: OrderId): Promise<Order>;
    clearCart(): Promise<void>;
    createProduct(input: CreateProductInput): Promise<Product>;
    deleteAddress(addressId: bigint): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCart(): Promise<Cart>;
    getMyOrders(): Promise<Array<Order>>;
    getMySellerOrders(): Promise<Array<Order>>;
    getOrder(orderId: OrderId): Promise<Order | null>;
    getProduct(productId: ProductId): Promise<Product | null>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listMyProducts(): Promise<Array<Product>>;
    listProducts(filterOpts: ProductFilter): Promise<Array<Product>>;
    placeOrder(input: PlaceOrderInput): Promise<Array<Order>>;
    removeFromCart(productId: ProductId): Promise<Cart>;
    reorder(orderId: OrderId): Promise<Cart>;
    saveCallerUserProfile(input: SaveProfileInput): Promise<void>;
    setDefaultAddress(addressId: bigint): Promise<void>;
    updateAddress(addressId: bigint, input: AddAddressInput): Promise<Address>;
    updateCartItem(input: UpdateCartItemInput): Promise<Cart>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<Order>;
    updateProduct(input: UpdateProductInput): Promise<Product>;
}
