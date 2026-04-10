import { c as createLucideIcon, j as jsxRuntimeExports, T as UserRole, e as useAuth, b as useNavigate, L as LoadingSpinner } from "./index-BB5MO6AH.js";
import { E as EmptyState } from "./EmptyState-C9TLmdj8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function RoleGuard({
  children,
  requiredRole,
  redirectTo = "/login"
}) {
  const { isAuthenticated, profileLoading, role } = useAuth();
  const navigate = useNavigate();
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  }
  if (!isAuthenticated) {
    navigate({ to: redirectTo });
    return null;
  }
  if (role !== requiredRole) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8" }),
        title: "Access Restricted",
        description: requiredRole === UserRole.seller ? "This section is only for sellers. Please switch to a seller account to continue." : "This section is only for buyers.",
        action: {
          label: "Go Home",
          onClick: () => navigate({ to: "/" })
        }
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function BuyerGuard({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RoleGuard, { requiredRole: UserRole.buyer, children });
}
function SellerGuard({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RoleGuard, { requiredRole: UserRole.seller, children });
}
export {
  BuyerGuard as B,
  SellerGuard as S
};
