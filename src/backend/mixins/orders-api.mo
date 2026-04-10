import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import OrderTypes "../types/orders";
import ProductTypes "../types/products";
import CartTypes "../types/cart";
import OrdersLib "../lib/orders";
import CartLib "../lib/cart";

mixin (
  accessControlState : AccessControl.AccessControlState,
  orders : Map.Map<Nat, OrderTypes.Order>,
  products : Map.Map<Nat, ProductTypes.Product>,
  carts : Map.Map<Principal, CartTypes.Cart>,
  nextOrderId : { var value : Nat },
) {
  public shared ({ caller }) func placeOrder(input : OrderTypes.PlaceOrderInput) : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let startId = nextOrderId.value;
    let created = OrdersLib.placeOrder(orders, products, carts, caller, input, startId);
    nextOrderId.value := startId + created.size();
    created;
  };

  public query ({ caller }) func getMyOrders() : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    OrdersLib.getBuyerOrders(orders, caller);
  };

  public query ({ caller }) func getMySellerOrders() : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    OrdersLib.getSellerOrders(orders, caller);
  };

  public query ({ caller }) func getOrder(orderId : OrderTypes.OrderId) : async ?OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    OrdersLib.getOrder(orders, orderId, caller);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderTypes.OrderId, status : OrderTypes.OrderStatus) : async OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    OrdersLib.updateOrderStatus(orders, caller, orderId, status);
  };

  public shared ({ caller }) func cancelOrder(orderId : OrderTypes.OrderId) : async OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    OrdersLib.cancelOrder(orders, caller, orderId);
  };

  public shared ({ caller }) func reorder(orderId : OrderTypes.OrderId) : async CartTypes.Cart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let order = switch (OrdersLib.getOrder(orders, orderId, caller)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    // Add all items from past order back to cart
    var cart = CartLib.getCart(carts, caller);
    for (item in order.items.vals()) {
      cart := CartLib.addToCart(carts, products, caller, item.productId, item.quantity);
    };
    cart;
  };
};
