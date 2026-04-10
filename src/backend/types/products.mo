import CommonTypes "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type ProductId = CommonTypes.ProductId;
  public type Category = CommonTypes.Category;

  public type Product = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Nat;
    currency : Text;
    category : Category;
    images : [Storage.ExternalBlob];
    rating : Float;
    stock : Nat;
    sellerId : UserId;
    deliveryEstimate : Text;
    isActive : Bool;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type CreateProductInput = {
    title : Text;
    description : Text;
    price : Nat;
    currency : Text;
    category : Category;
    images : [Storage.ExternalBlob];
    stock : Nat;
    deliveryEstimate : Text;
  };

  public type UpdateProductInput = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Nat;
    currency : Text;
    category : Category;
    images : [Storage.ExternalBlob];
    stock : Nat;
    deliveryEstimate : Text;
    isActive : Bool;
  };

  public type ProductFilter = {
    keyword : ?Text;
    category : ?Category;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    minRating : ?Float;
    inStockOnly : Bool;
  };
};
