import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { EmptyState } from "./EmptyState";
import { LoadingSpinner } from "./LoadingSpinner";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  requiredRole,
  redirectTo = "/login",
}: RoleGuardProps) {
  const { isAuthenticated, profileLoading, role } = useAuth();
  const navigate = useNavigate();

  if (profileLoading) {
    return <LoadingSpinner variant="fullscreen" />;
  }

  if (!isAuthenticated) {
    navigate({ to: redirectTo });
    return null;
  }

  if (role !== requiredRole) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={<Lock className="w-8 h-8" />}
          title="Access Restricted"
          description={
            requiredRole === UserRole.seller
              ? "This section is only for sellers. Please switch to a seller account to continue."
              : "This section is only for buyers."
          }
          action={{
            label: "Go Home",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export function BuyerGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole={UserRole.buyer}>{children}</RoleGuard>;
}

export function SellerGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole={UserRole.seller}>{children}</RoleGuard>;
}
