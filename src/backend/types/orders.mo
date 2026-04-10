import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type OrderId = CommonTypes.OrderId;
  public type ProductId = CommonTypes.ProductId;
  public type Timestamp = CommonTypes.Timestamp;
  public type OrderStatus = CommonTypes.OrderStatus;
  public type PaymentMethod = CommonTypes.PaymentMethod;

  public type OrderItem = {
    productId : ProductId;
    title : Text;
    quantity : Nat;
    priceAtOrder : Nat;
  };

  public type DeliveryAddress = {
    name : Text;
    phone : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  public type Order = {
    id : OrderId;
    buyerId : UserId;
    sellerId : UserId;
    items : [OrderItem];
    total : Nat;
    deliveryAddress : DeliveryAddress;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    estimatedDelivery : Text;
  };

  public type PlaceOrderInput = {
    items : [{ productId : ProductId; quantity : Nat }];
    deliveryAddress : DeliveryAddress;
    paymentMethod : PaymentMethod;
  };
};
