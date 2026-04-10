import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserTypes "types/users";
import ProductTypes "types/products";
import CartTypes "types/cart";
import OrderTypes "types/orders";
import UsersMixin "mixins/users-api";
import ProductsMixin "mixins/products-api";
import CartMixin "mixins/cart-api";
import OrdersMixin "mixins/orders-api";
import ProductsLib "lib/products";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // User state
  let profiles = Map.empty<Principal, UserTypes.UserProfile>();
  let nextAddressId = { var value : Nat = 0 };
  include UsersMixin(accessControlState, profiles, nextAddressId);

  // Product state
  let products = Map.empty<Nat, ProductTypes.Product>();
  let nextProductId = { var value : Nat = 0 };
  // Seed flag: use a fixed anonymous principal as the demo seller
  let seeded = { var done : Bool = false };
  if (not seeded.done) {
    seeded.done := true;
    let demoSeller = Principal.anonymous();
    let afterSeed = ProductsLib.seedProducts(products, demoSeller, 0);
    nextProductId.value := afterSeed;
  };
  include ProductsMixin(accessControlState, products, nextProductId);

  // Cart state
  let carts = Map.empty<Principal, CartTypes.Cart>();
  include CartMixin(accessControlState, carts, products);

  // Orders state
  let orders = Map.empty<Nat, OrderTypes.Order>();
  let nextOrderId = { var value : Nat = 0 };
  include OrdersMixin(accessControlState, orders, products, carts, nextOrderId);
};
