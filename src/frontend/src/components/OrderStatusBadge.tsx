import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Home,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { ORDER_STATUS_LABELS, OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-muted text-muted-foreground border-border",
  [OrderStatus.confirmed]: "bg-secondary/10 text-secondary border-secondary/20",
  [OrderStatus.shipped]: "bg-accent/10 text-accent border-accent/20",
  [OrderStatus.outForDelivery]: "bg-primary/10 text-primary border-primary/20",
  [OrderStatus.delivered]: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  [OrderStatus.cancelled]:
    "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.pending]: <Clock className="w-3 h-3" />,
  [OrderStatus.confirmed]: <CheckCircle className="w-3 h-3" />,
  [OrderStatus.shipped]: <Package className="w-3 h-3" />,
  [OrderStatus.outForDelivery]: <Truck className="w-3 h-3" />,
  [OrderStatus.delivered]: <Home className="w-3 h-3" />,
  [OrderStatus.cancelled]: <XCircle className="w-3 h-3" />,
};

export function OrderStatusBadge({
  status,
  showIcon = true,
}: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`font-medium border gap-1 ${STATUS_STYLES[status]}`}
      data-ocid={`order-status-badge-${status}`}
    >
      {showIcon && STATUS_ICONS[status]}
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
