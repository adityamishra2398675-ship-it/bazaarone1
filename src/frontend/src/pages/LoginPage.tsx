import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Loader2, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated, login, loginStatus, profile, saveProfile } =
    useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"auth" | "profile">("auth");

  // If profile is already complete, redirect
  if (profile?.displayName && profile?.role) {
    const dest = profile.role === UserRole.seller ? "/seller" : "/";
    navigate({ to: dest });
    return null;
  }

  // Once authenticated without profile, show profile setup
  if (isAuthenticated && step === "auth") {
    setStep("profile");
  }

  const handleLogin = () => {
    login();
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }
    if (!displayName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        displayName: displayName.trim(),
        role: selectedRole,
        phone: phone.trim(),
      });
      toast.success("Welcome to One Bajar!");
      navigate({ to: selectedRole === UserRole.seller ? "/seller" : "/" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            One Bajar
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step === "auth" ? (
            /* Step 1: Login with Internet Identity */
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Store className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-display font-bold text-3xl text-foreground mb-2">
                  Welcome to One Bajar
                </h1>
                <p className="text-muted-foreground">
                  India ka apna all-in-one marketplace — groceries to gadgets,
                  sab kuch yahan!
                </p>
              </div>

              <Card className="p-6 border border-border bg-card shadow-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        Secure Login
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Internet Identity — no password needed
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full gap-2 transition-marketplace"
                    onClick={handleLogin}
                    disabled={loginStatus === "logging-in"}
                    data-ocid="login-btn"
                  >
                    {loginStatus === "logging-in" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Login / Sign Up
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to One Bajar's terms of use.
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            /* Step 2: Profile setup & role selection */
            <div>
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                  Set Up Your Account
                </h2>
                <p className="text-muted-foreground text-sm">
                  Tell us a bit about yourself to get started
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    I want to...
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(UserRole.buyer)}
                      className={`p-4 rounded-xl border-2 text-left transition-marketplace cursor-pointer ${
                        selectedRole === UserRole.buyer
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                      data-ocid="role-buyer-btn"
                    >
                      <ShoppingBag className="w-6 h-6 text-primary mb-2" />
                      <p className="font-semibold text-foreground text-sm">
                        Buy Products
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Shop from thousands of products
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole(UserRole.seller)}
                      className={`p-4 rounded-xl border-2 text-left transition-marketplace cursor-pointer ${
                        selectedRole === UserRole.seller
                          ? "border-secondary bg-secondary/5"
                          : "border-border bg-card hover:border-secondary/40"
                      }`}
                      data-ocid="role-seller-btn"
                    >
                      <Store className="w-6 h-6 text-secondary mb-2" />
                      <p className="font-semibold text-foreground text-sm">
                        Sell Products
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        List and manage your products
                      </p>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name *</Label>
                  <Input
                    id="displayName"
                    placeholder="Aapka naam"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    data-ocid="profile-name-input"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-l-none"
                      maxLength={10}
                      data-ocid="profile-phone-input"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={
                    saveProfile.isPending ||
                    !selectedRole ||
                    !displayName.trim()
                  }
                  data-ocid="profile-submit-btn"
                >
                  {saveProfile.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
