import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type ProductId = CommonTypes.ProductId;

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
    priceAtAdd : Nat;
  };

  public type Cart = {
    buyerId : UserId;
    items : [CartItem];
    totalAmount : Nat;
  };

  public type UpdateCartItemInput = {
    productId : ProductId;
    quantity : Nat;
  };
};
