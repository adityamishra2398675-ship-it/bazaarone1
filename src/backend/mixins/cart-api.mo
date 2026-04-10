import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import CartTypes "../types/cart";
import ProductTypes "../types/products";
import CartLib "../lib/cart";

mixin (
  accessControlState : AccessControl.AccessControlState,
  carts : Map.Map<Principal, CartTypes.Cart>,
  products : Map.Map<Nat, ProductTypes.Product>,
) {
  public query ({ caller }) func getCart() : async CartTypes.Cart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CartLib.getCart(carts, caller);
  };

  public shared ({ caller }) func addToCart(productId : CartTypes.ProductId, quantity : Nat) : async CartTypes.Cart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CartLib.addToCart(carts, products, caller, productId, quantity);
  };

  public shared ({ caller }) func updateCartItem(input : CartTypes.UpdateCartItemInput) : async CartTypes.Cart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CartLib.updateCartItem(carts, products, caller, input);
  };

  public shared ({ caller }) func removeFromCart(productId : CartTypes.ProductId) : async CartTypes.Cart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CartLib.removeFromCart(carts, caller, productId);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CartLib.clearCart(carts, caller);
  };
};
