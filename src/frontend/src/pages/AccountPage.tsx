import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Edit2,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AddAddressInput, SaveProfileInput } from "../backend.d";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useActor } from "../hooks/useBackend";

const EMPTY_ADDRESS: AddAddressInput = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, profileLoading, saveProfile } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<AddAddressInput>(EMPTY_ADDRESS);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<SaveProfileInput | null>(null);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  if (profileLoading) return <LoadingSpinner variant="fullscreen" />;

  const startEditProfile = () => {
    setProfileForm({
      displayName: profile?.displayName ?? "",
      phone: profile?.phone ?? "",
      role: profile?.role ?? ("buyer" as import("../backend.d").UserRole),
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;
    try {
      await saveProfile.mutateAsync(profileForm);
      toast.success("Profile updated!");
      setEditingProfile(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    try {
      await actor.addAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Address added!");
      setShowAddAddress(false);
      setNewAddress(EMPTY_ADDRESS);
    } catch {
      toast.error("Failed to add address");
    }
  };

  const deleteAddress = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.deleteAddress(id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  const setDefault = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.setDefaultAddress(id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6">
        My Account
      </h1>

      {/* Profile Card */}
      <Card className="p-5 border border-border bg-card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground text-lg truncate">
                {profile?.displayName || "No name set"}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3 shrink-0" />
                <span>
                  {profile?.phone ? `+91 ${profile.phone}` : "No phone added"}
                </span>
              </div>
              <Badge variant="outline" className="mt-1.5 text-xs capitalize">
                {profile?.role}
              </Badge>
            </div>
          </div>
          {!editingProfile && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 shrink-0"
              onClick={startEditProfile}
              data-ocid="edit-profile-btn"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </div>

        {/* Edit Profile Form */}
        {editingProfile && profileForm && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-5 pt-5 border-t border-border space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-displayname">Full Name *</Label>
                <Input
                  id="profile-displayname"
                  value={profileForm.displayName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      displayName: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                  required
                  data-ocid="profile-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone">Phone Number *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    +91
                  </span>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="pl-10"
                    required
                    data-ocid="profile-phone-input"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
                disabled={saveProfile.isPending}
                data-ocid="save-profile-btn"
              >
                <Save className="w-3.5 h-3.5" />
                {saveProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="gap-1.5"
                onClick={() => setEditingProfile(false)}
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Addresses */}
      <Card className="p-5 border border-border bg-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Saved Addresses
          </h2>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setShowAddAddress(!showAddAddress)}
            data-ocid="add-address-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </Button>
        </div>

        {showAddAddress && (
          <form
            onSubmit={addAddress}
            className="mb-4 p-4 border border-border rounded-xl bg-muted/30 space-y-3"
          >
            <p className="font-medium text-sm text-foreground mb-1">
              New Delivery Address
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-name">Full Name *</Label>
                <Input
                  id="addr-name"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  placeholder="Recipient's name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-phone">Phone *</Label>
                <Input
                  id="addr-phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  placeholder="10-digit number"
                  maxLength={10}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="addr-line1">
                  Address Line 1 *{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (House/Flat, Building, Street)
                  </span>
                </Label>
                <Input
                  id="addr-line1"
                  value={newAddress.addressLine1}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine1: e.target.value,
                    })
                  }
                  placeholder="e.g. Flat 4B, Sunshine Apartments, MG Road"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="addr-line2">
                  Address Line 2{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (Area, Landmark — optional)
                  </span>
                </Label>
                <Input
                  id="addr-line2"
                  value={newAddress.addressLine2}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine2: e.target.value,
                    })
                  }
                  placeholder="e.g. Near Metro Station"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-city">City *</Label>
                <Input
                  id="addr-city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-state">State *</Label>
                <Input
                  id="addr-state"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  placeholder="e.g. Maharashtra"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-pincode">Pincode *</Label>
                <Input
                  id="addr-pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                  placeholder="6-digit PIN"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="addr-default"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
                className="rounded border-input"
              />
              <Label
                htmlFor="addr-default"
                className="font-normal cursor-pointer"
              >
                Set as default delivery address
              </Label>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" data-ocid="save-address-btn">
                Save Address
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddAddress(false);
                  setNewAddress(EMPTY_ADDRESS);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!profile?.addresses || profile.addresses.length === 0 ? (
          <EmptyState
            emoji="📍"
            title="No addresses saved"
            description="Add a delivery address to checkout faster."
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {profile.addresses.map((addr) => (
              <div
                key={addr.id.toString()}
                className="flex items-start justify-between p-3 rounded-lg border border-border bg-background gap-3"
                data-ocid={`address-row-${addr.id}`}
              >
                <div className="text-sm min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{addr.name}</p>
                    {addr.isDefault && (
                      <Badge className="text-xs bg-primary/10 text-primary border-primary/20 border">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    📱 +91 {addr.phone}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2"
                      onClick={() => setDefault(addr.id)}
                      data-ocid={`set-default-address-${addr.id}`}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteAddress(addr.id)}
                    aria-label="Delete address"
                    data-ocid={`delete-address-${addr.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: "/orders" })}
          data-ocid="account-orders-btn"
        >
          My Orders
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: "/" })}
          data-ocid="account-shop-btn"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
