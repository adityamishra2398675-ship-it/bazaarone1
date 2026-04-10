import CommonTypes "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type UserRole = CommonTypes.UserRole;

  public type Address = {
    id : Nat;
    name : Text;
    phone : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    isDefault : Bool;
  };

  public type UserProfile = {
    id : UserId;
    displayName : Text;
    phone : Text;
    role : UserRole;
    addresses : [Address];
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type SaveProfileInput = {
    displayName : Text;
    phone : Text;
    role : UserRole;
  };

  public type AddAddressInput = {
    name : Text;
    phone : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    isDefault : Bool;
  };
};
