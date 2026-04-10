import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/cart";
import ProductTypes "../types/products";

module {
  public type Cart = Types.Cart;
  public type CartItem = Types.CartItem;
  public type UpdateCartItemInput = Types.UpdateCartItemInput;
  public type UserId = Types.UserId;
  public type ProductId = Types.ProductId;

  public func calculateTotal(items : [CartItem]) : Nat {
    var total : Nat = 0;
    for (item in items.vals()) {
      total += item.priceAtAdd * item.quantity;
    };
    total;
  };

  public func getCart(
    carts : Map.Map<Principal, Cart>,
    buyerId : UserId,
  ) : Cart {
    switch (carts.get(buyerId)) {
      case (?c) c;
      case null { { buyerId = buyerId; items = []; totalAmount = 0 } };
    };
  };

  public func addToCart(
    carts : Map.Map<Principal, Cart>,
    products : Map.Map<Nat, ProductTypes.Product>,
    buyerId : UserId,
    productId : ProductId,
    quantity : Nat,
  ) : Cart {
    let product = switch (products.get(productId)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    if (not product.isActive) Runtime.trap("Product is not available");
    if (product.stock < quantity) Runtime.trap("Insufficient stock");

    let existing = getCart(carts, buyerId);
    let itemList = List.fromArray<CartItem>(existing.items);
    let existingItemIdx = itemList.findIndex(func(i : CartItem) : Bool { i.productId == productId });

    switch (existingItemIdx) {
      case (?_idx) {
        // Update quantity
        itemList.mapInPlace(func(i : CartItem) : CartItem {
          if (i.productId == productId) {
            { i with quantity = i.quantity + quantity }
          } else { i }
        });
      };
      case null {
        itemList.add({
          productId = productId;
          quantity = quantity;
          priceAtAdd = product.price;
        });
      };
    };
    let newItems = itemList.toArray();
    let cart : Cart = {
      buyerId = buyerId;
      items = newItems;
      totalAmount = calculateTotal(newItems);
    };
    carts.add(buyerId, cart);
    cart;
  };

  public func updateCartItem(
    carts : Map.Map<Principal, Cart>,
    products : Map.Map<Nat, ProductTypes.Product>,
    buyerId : UserId,
    input : UpdateCartItemInput,
  ) : Cart {
    let existing = getCart(carts, buyerId);
    let itemList = List.fromArray<CartItem>(existing.items);
    if (input.quantity == 0) {
      // Remove the item
      let filtered = itemList.filter(func(i : CartItem) : Bool { i.productId != input.productId });
      let newItems = filtered.toArray();
      let cart : Cart = { buyerId = buyerId; items = newItems; totalAmount = calculateTotal(newItems) };
      carts.add(buyerId, cart);
      return cart;
    };
    let product = switch (products.get(input.productId)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    if (product.stock < input.quantity) Runtime.trap("Insufficient stock");
    itemList.mapInPlace(func(i : CartItem) : CartItem {
      if (i.productId == input.productId) {
        { i with quantity = input.quantity }
      } else { i }
    });
    let newItems = itemList.toArray();
    let cart : Cart = { buyerId = buyerId; items = newItems; totalAmount = calculateTotal(newItems) };
    carts.add(buyerId, cart);
    cart;
  };

  public func removeFromCart(
    carts : Map.Map<Principal, Cart>,
    buyerId : UserId,
    productId : ProductId,
  ) : Cart {
    let existing = getCart(carts, buyerId);
    let filtered = List.fromArray<CartItem>(existing.items).filter(
      func(i : CartItem) : Bool { i.productId != productId }
    );
    let newItems = filtered.toArray();
    let cart : Cart = { buyerId = buyerId; items = newItems; totalAmount = calculateTotal(newItems) };
    carts.add(buyerId, cart);
    cart;
  };

  public func clearCart(
    carts : Map.Map<Principal, Cart>,
    buyerId : UserId,
  ) {
    carts.add(buyerId, { buyerId = buyerId; items = []; totalAmount = 0 });
  };
};
