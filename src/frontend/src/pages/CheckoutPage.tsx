import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  Plus,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMethod } from "../backend.d";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriceDisplay } from "../components/PriceDisplay";
import { BuyerGuard } from "../components/RoleGuard";
import { useAuth } from "../hooks/useAuth";
import { useActor } from "../hooks/useBackend";
import { useCart } from "../hooks/useCart";
import type { Address, DeliveryAddress } from "../types";

const DELIVERY_FEE = 49n;
const FREE_DELIVERY_THRESHOLD = 499n;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
];

const PAYMENT_OPTIONS = [
  {
    value: PaymentMethod.cashOnDelivery,
    label: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    icon: <Banknote className="w-5 h-5" />,
    available: true,
  },
  {
    value: PaymentMethod.upi,
    label: "UPI",
    subtitle: "PhonePe, GPay, Paytm & more",
    icon: <Smartphone className="w-5 h-5" />,
    available: false,
  },
  {
    value: PaymentMethod.card,
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay",
    icon: <CreditCard className="w-5 h-5" />,
    available: false,
  },
];

function blankAddress(profile?: {
  displayName?: string;
  phone?: string;
}): DeliveryAddress {
  return {
    name: profile?.displayName ?? "",
    phone: profile?.phone ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  };
}

function addressToDelivery(a: Address): DeliveryAddress {
  return {
    name: a.name,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
  };
}

function CheckoutContent() {
  const navigate = useNavigate();
  const { cart, totalAmount } = useCart();
  const { profile } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cashOnDelivery,
  );

  const savedAddresses: Address[] = profile?.addresses ?? [];
  const defaultSaved =
    savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null;

  const [selectedAddressId, setSelectedAddressId] = useState<bigint | "new">(
    defaultSaved ? defaultSaved.id : "new",
  );
  const [newAddress, setNewAddress] = useState<DeliveryAddress>(
    blankAddress(profile ?? undefined),
  );

  const items = cart?.items ?? [];
  const deliveryFee =
    totalAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0
      ? 0n
      : DELIVERY_FEE;
  const grandTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }

  const activeDeliveryAddress: DeliveryAddress =
    selectedAddressId === "new"
      ? newAddress
      : addressToDelivery(
          savedAddresses.find((a) => a.id === selectedAddressId) ??
            savedAddresses[0],
        );

  const updateNew = (field: keyof DeliveryAddress, value: string) =>
    setNewAddress((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || items.length === 0) return;

    const addr = activeDeliveryAddress;
    if (
      !addr.name ||
      !addr.phone ||
      !addr.addressLine1 ||
      !addr.city ||
      !addr.state ||
      !addr.pincode
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }
    if (!/^\d{6}$/.test(addr.pincode)) {
      toast.error("Pincode must be a 6-digit number");
      return;
    }

    setSubmitting(true);
    try {
      const orders = await actor.placeOrder({
        deliveryAddress: addr,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      const firstOrder = orders[0];
      const orderId = firstOrder?.id?.toString() ?? "";
      const estimated = firstOrder?.estimatedDelivery ?? "3–5 business days";

      navigate({
        to: "/order-confirmation",
        search: { orderId, estimated },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <Card className="p-5 border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Delivery Address
                </h2>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div
                  className="space-y-2 mb-4"
                  data-ocid="checkout-address-select"
                >
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id.toString()}
                      type="button"
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-marketplace ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                      onClick={() => setSelectedAddressId(addr.id)}
                      aria-pressed={selectedAddressId === addr.id}
                      data-ocid={`checkout-saved-address-${addr.id}`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedAddressId === addr.id ? "border-primary" : "border-muted-foreground"}`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="text-sm min-w-0">
                        <p className="font-medium text-foreground">
                          {addr.name}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground mt-0.5 leading-snug">
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                        </p>
                        <p className="text-muted-foreground">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-muted-foreground">
                          +91 {addr.phone}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-marketplace ${
                      selectedAddressId === "new"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedAddressId("new")}
                    aria-pressed={selectedAddressId === "new"}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedAddressId === "new" ? "border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedAddressId === "new" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Plus className="w-4 h-4 text-primary" />
                      Add a new address
                    </div>
                  </button>
                </div>
              )}

              {/* New Address Form */}
              {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="chk-name">Full Name *</Label>
                    <Input
                      id="chk-name"
                      value={newAddress.name}
                      onChange={(e) => updateNew("name", e.target.value)}
                      placeholder="Ravi Kumar"
                      required={selectedAddressId === "new"}
                      data-ocid="checkout-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="chk-phone">Phone *</Label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm select-none">
                        +91
                      </span>
                      <Input
                        id="chk-phone"
                        className="rounded-l-none"
                        value={newAddress.phone}
                        onChange={(e) => updateNew("phone", e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        required={selectedAddressId === "new"}
                        data-ocid="checkout-phone"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="chk-addr1">Address Line 1 *</Label>
                    <Input
                      id="chk-addr1"
                      placeholder="House/Flat No., Building Name, Street"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        updateNew("addressLine1", e.target.value)
                      }
                      required={selectedAddressId === "new"}
                      data-ocid="checkout-address1"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="chk-addr2">Address Line 2</Label>
                    <Input
                      id="chk-addr2"
                      placeholder="Area, Colony, Locality, Landmark"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        updateNew("addressLine2", e.target.value)
                      }
                      data-ocid="checkout-address2"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="chk-city">City *</Label>
                    <Input
                      id="chk-city"
                      value={newAddress.city}
                      onChange={(e) => updateNew("city", e.target.value)}
                      placeholder="Mumbai"
                      required={selectedAddressId === "new"}
                      data-ocid="checkout-city"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="chk-state">State *</Label>
                    <select
                      id="chk-state"
                      value={newAddress.state}
                      onChange={(e) => updateNew("state", e.target.value)}
                      required={selectedAddressId === "new"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-ocid="checkout-state"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="chk-pincode">Pincode *</Label>
                    <Input
                      id="chk-pincode"
                      placeholder="6-digit pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        updateNew(
                          "pincode",
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      maxLength={6}
                      required={selectedAddressId === "new"}
                      data-ocid="checkout-pincode"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Payment Method */}
            <Card className="p-5 border border-border bg-card">
              <h2 className="font-semibold text-foreground mb-4">
                Payment Method
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="space-y-2"
                data-ocid="checkout-payment"
              >
                {PAYMENT_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-marketplace ${
                      !opt.available
                        ? "opacity-50 cursor-not-allowed border-border"
                        : paymentMethod === opt.value
                          ? "border-primary bg-primary/5 cursor-pointer"
                          : "border-border hover:border-primary/40 cursor-pointer"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt.value}
                      id={`pay-${opt.value}`}
                      disabled={!opt.available}
                    />
                    <Label
                      htmlFor={`pay-${opt.value}`}
                      className={`flex items-center gap-3 flex-1 ${opt.available ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      <span
                        className={
                          opt.available
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {opt.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {opt.label}
                          {!opt.available && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Coming soon)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opt.subtitle}
                        </p>
                      </div>
                    </Label>
                    {opt.available && paymentMethod === opt.value && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="sticky top-24">
            <Card className="p-5 border border-border bg-card space-y-4">
              <h2 className="font-semibold text-foreground">Order Summary</h2>
              <Separator />

              <div className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                  <PriceDisplay amount={totalAmount} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  {deliveryFee === 0n ? (
                    <span className="font-semibold text-accent">FREE</span>
                  ) : (
                    <PriceDisplay amount={deliveryFee} size="sm" />
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <PriceDisplay amount={grandTotal} size="md" />
              </div>

              <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                You will pay ₹{grandTotal.toString()} at delivery (Cash on
                Delivery)
              </p>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitting}
                data-ocid="checkout-place-order-btn"
              >
                {submitting ? (
                  <LoadingSpinner className="p-0 h-5 w-5" />
                ) : (
                  "Place Order"
                )}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <BuyerGuard>
      <CheckoutContent />
    </BuyerGuard>
  );
}
