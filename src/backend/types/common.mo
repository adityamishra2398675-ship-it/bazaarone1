module {
  public type UserId = Principal;
  public type Timestamp = Int;
  public type OrderId = Nat;
  public type ProductId = Nat;
  public type AddressId = Nat;
  public type CartItemId = Nat;

  public type UserRole = {
    #buyer;
    #seller;
  };

  public type Category = {
    #electronics;
    #clothes;
    #books;
    #groceries;
    #essentials;
    #others;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
    #upi;
    #card;
  };
};
