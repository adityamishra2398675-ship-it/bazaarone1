import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/orders";
import ProductTypes "../types/products";
import CartTypes "../types/cart";
import CommonTypes "../types/common";

module {
  public type Order = Types.Order;
  public type OrderItem = Types.OrderItem;
  public type PlaceOrderInput = Types.PlaceOrderInput;
  public type OrderId = Types.OrderId;
  public type UserId = Types.UserId;
  public type OrderStatus = Types.OrderStatus;

  // Group order items by seller
  public func placeOrder(
    orders : Map.Map<Nat, Order>,
    products : Map.Map<Nat, ProductTypes.Product>,
    carts : Map.Map<Principal, CartTypes.Cart>,
    buyerId : UserId,
    input : PlaceOrderInput,
    nextId : Nat,
  ) : [Order] {
    if (input.items.size() == 0) Runtime.trap("No items to order");

    // Build a map of sellerId -> [OrderItem] to create one order per seller
    let sellerItemsMap = Map.empty<Principal, List.List<OrderItem>>();
    var currentId = nextId;

    for (reqItem in input.items.vals()) {
      let product = switch (products.get(reqItem.productId)) {
        case (?p) p;
        case null Runtime.trap("Product not found: " # debug_show(reqItem.productId));
      };
      if (not product.isActive) Runtime.trap("Product not available: " # product.title);
      if (product.stock < reqItem.quantity) Runtime.trap("Insufficient stock: " # product.title);

      let orderItem : OrderItem = {
        productId = reqItem.productId;
        title = product.title;
        quantity = reqItem.quantity;
        priceAtOrder = product.price;
      };

      switch (sellerItemsMap.get(product.sellerId)) {
        case (?existing) {
          existing.add(orderItem);
        };
        case null {
          let newList = List.empty<OrderItem>();
          newList.add(orderItem);
          sellerItemsMap.add(product.sellerId, newList);
        };
      };
    };

    // Decrement stock for each item
    for (reqItem in input.items.vals()) {
      let product = switch (products.get(reqItem.productId)) {
        case (?p) p;
        case null Runtime.trap("Product not found");
      };
      if (product.stock < reqItem.quantity) Runtime.trap("Insufficient stock for product");
      let newStock : Nat = product.stock - reqItem.quantity;
      products.add(reqItem.productId, { product with stock = newStock; updatedAt = Time.now() });
    };

    // Create one order per seller
    let now = Time.now();
    let createdOrders = List.empty<Order>();

    for ((sellerId, itemList) in sellerItemsMap.entries()) {
      let items = itemList.toArray();
      var total : Nat = 0;
      for (item in items.vals()) {
        total += item.priceAtOrder * item.quantity;
      };
      let order : Order = {
        id = currentId;
        buyerId = buyerId;
        sellerId = sellerId;
        items = items;
        total = total;
        deliveryAddress = input.deliveryAddress;
        paymentMethod = input.paymentMethod;
        status = #pending;
        createdAt = now;
        updatedAt = now;
        estimatedDelivery = "3-5 business days";
      };
      orders.add(currentId, order);
      createdOrders.add(order);
      currentId += 1;
    };

    // Clear buyer cart after placing order
    carts.add(buyerId, { buyerId = buyerId; items = []; totalAmount = 0 });

    createdOrders.toArray();
  };

  public func getBuyerOrders(
    orders : Map.Map<Nat, Order>,
    buyerId : UserId,
  ) : [Order] {
    let result = List.fromIter<Order>(orders.values()).filter(
      func(o : Order) : Bool { Principal.equal(o.buyerId, buyerId) }
    );
    result.toArray();
  };

  public func getSellerOrders(
    orders : Map.Map<Nat, Order>,
    sellerId : UserId,
  ) : [Order] {
    let result = List.fromIter<Order>(orders.values()).filter(
      func(o : Order) : Bool { Principal.equal(o.sellerId, sellerId) }
    );
    result.toArray();
  };

  public func getOrder(
    orders : Map.Map<Nat, Order>,
    orderId : OrderId,
    requesterId : UserId,
  ) : ?Order {
    switch (orders.get(orderId)) {
      case (?o) {
        // Only buyer or seller of that order can view it
        if (Principal.equal(o.buyerId, requesterId) or Principal.equal(o.sellerId, requesterId)) {
          ?o;
        } else {
          null;
        };
      };
      case null null;
    };
  };

  public func updateOrderStatus(
    orders : Map.Map<Nat, Order>,
    sellerId : UserId,
    orderId : OrderId,
    status : OrderStatus,
  ) : Order {
    let order = switch (orders.get(orderId)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    if (not Principal.equal(order.sellerId, sellerId)) {
      Runtime.trap("Unauthorized: Not your order");
    };
    // Validate status transition
    let validTransition = switch (order.status, status) {
      case (#pending, #confirmed) true;
      case (#confirmed, #shipped) true;
      case (#shipped, #outForDelivery) true;
      case (#outForDelivery, #delivered) true;
      case _ false;
    };
    if (not validTransition) {
      Runtime.trap("Invalid status transition");
    };
    let updated : Order = { order with status = status; updatedAt = Time.now() };
    orders.add(orderId, updated);
    updated;
  };

  public func cancelOrder(
    orders : Map.Map<Nat, Order>,
    buyerId : UserId,
    orderId : OrderId,
  ) : Order {
    let order = switch (orders.get(orderId)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    if (not Principal.equal(order.buyerId, buyerId)) {
      Runtime.trap("Unauthorized: Not your order");
    };
    // Only pending or confirmed orders can be cancelled
    switch (order.status) {
      case (#shipped or #outForDelivery or #delivered) {
        Runtime.trap("Cannot cancel order in current status");
      };
      case (#cancelled) Runtime.trap("Order already cancelled");
      case _ {};
    };
    let updated : Order = { order with status = #cancelled; updatedAt = Time.now() };
    orders.add(orderId, updated);
    updated;
  };
};
