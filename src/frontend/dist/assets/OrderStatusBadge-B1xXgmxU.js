import { c as createLucideIcon, j as jsxRuntimeExports, k as Badge, H as ORDER_STATUS_LABELS, O as OrderStatus } from "./index-BB5MO6AH.js";
import { T as Truck } from "./truck-DD76cO_y.js";
import { P as Package } from "./package-tpYs1vsX.js";
import { C as Clock } from "./clock-wutncOHm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
const STATUS_STYLES = {
  [OrderStatus.pending]: "bg-muted text-muted-foreground border-border",
  [OrderStatus.confirmed]: "bg-secondary/10 text-secondary border-secondary/20",
  [OrderStatus.shipped]: "bg-accent/10 text-accent border-accent/20",
  [OrderStatus.outForDelivery]: "bg-primary/10 text-primary border-primary/20",
  [OrderStatus.delivered]: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  [OrderStatus.cancelled]: "bg-destructive/10 text-destructive border-destructive/20"
};
const STATUS_ICONS = {
  [OrderStatus.pending]: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
  [OrderStatus.confirmed]: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
  [OrderStatus.shipped]: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3 h-3" }),
  [OrderStatus.outForDelivery]: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-3 h-3" }),
  [OrderStatus.delivered]: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3 h-3" }),
  [OrderStatus.cancelled]: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" })
};
function OrderStatusBadge({
  status,
  showIcon = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `font-medium border gap-1 ${STATUS_STYLES[status]}`,
      "data-ocid": `order-status-badge-${status}`,
      children: [
        showIcon && STATUS_ICONS[status],
        ORDER_STATUS_LABELS[status]
      ]
    }
  );
}
export {
  CircleCheckBig as C,
  House as H,
  OrderStatusBadge as O,
  CircleX as a
};
