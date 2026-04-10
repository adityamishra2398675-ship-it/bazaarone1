import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/products";
import ProductsLib "../lib/products";

mixin (
  accessControlState : AccessControl.AccessControlState,
  products : Map.Map<Nat, Types.Product>,
  nextProductId : { var value : Nat },
) {
  public query func getProduct(productId : Types.ProductId) : async ?Types.Product {
    ProductsLib.getProduct(products, productId);
  };

  public query func listProducts(filterOpts : Types.ProductFilter) : async [Types.Product] {
    ProductsLib.listProducts(products, filterOpts);
  };

  public query ({ caller }) func listMyProducts() : async [Types.Product] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProductsLib.listSellerProducts(products, caller);
  };

  public shared ({ caller }) func createProduct(input : Types.CreateProductInput) : async Types.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextProductId.value;
    nextProductId.value += 1;
    ProductsLib.createProduct(products, caller, input, id);
  };

  public shared ({ caller }) func updateProduct(input : Types.UpdateProductInput) : async Types.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProductsLib.updateProduct(products, caller, input);
  };

  public shared ({ caller }) func deleteProduct(productId : Types.ProductId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProductsLib.deleteProduct(products, caller, productId);
  };
};
