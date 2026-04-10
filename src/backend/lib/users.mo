import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/users";

module {
  public type UserProfile = Types.UserProfile;
  public type Address = Types.Address;
  public type SaveProfileInput = Types.SaveProfileInput;
  public type AddAddressInput = Types.AddAddressInput;
  public type UserId = Types.UserId;

  public func getProfile(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
  ) : ?UserProfile {
    profiles.get(userId);
  };

  public func saveProfile(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
    input : SaveProfileInput,
  ) : UserProfile {
    let now = Time.now();
    let existing = profiles.get(userId);
    let addresses = switch (existing) {
      case (?p) p.addresses;
      case null [];
    };
    let profile : UserProfile = {
      id = userId;
      displayName = input.displayName;
      phone = input.phone;
      role = input.role;
      addresses = addresses;
      createdAt = switch (existing) { case (?p) p.createdAt; case null now };
      updatedAt = now;
    };
    profiles.add(userId, profile);
    profile;
  };

  public func addAddress(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
    input : AddAddressInput,
    nextId : Nat,
  ) : Address {
    let profile = switch (profiles.get(userId)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let newAddr : Address = {
      id = nextId;
      name = input.name;
      phone = input.phone;
      addressLine1 = input.addressLine1;
      addressLine2 = input.addressLine2;
      city = input.city;
      state = input.state;
      pincode = input.pincode;
      isDefault = input.isDefault;
    };
    // If new address is default, clear all others
    let updatedAddrs = if (input.isDefault) {
      let cleared = List.fromArray<Address>(profile.addresses).map<Address, Address>(
        func(a) { { a with isDefault = false } }
      );
      cleared.toArray();
    } else {
      profile.addresses;
    };
    let addrList = List.fromArray<Address>(updatedAddrs);
    addrList.add(newAddr);
    let updatedProfile : UserProfile = {
      profile with
      addresses = addrList.toArray();
      updatedAt = Time.now();
    };
    profiles.add(userId, updatedProfile);
    newAddr;
  };

  public func updateAddress(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
    addressId : Nat,
    input : AddAddressInput,
  ) : Address {
    let profile = switch (profiles.get(userId)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let addrList = List.fromArray<Address>(profile.addresses);
    let found = addrList.find(func(a : Address) : Bool { a.id == addressId });
    switch (found) {
      case null Runtime.trap("Address not found");
      case _ {};
    };
    let updatedAddr : Address = {
      id = addressId;
      name = input.name;
      phone = input.phone;
      addressLine1 = input.addressLine1;
      addressLine2 = input.addressLine2;
      city = input.city;
      state = input.state;
      pincode = input.pincode;
      isDefault = input.isDefault;
    };
    // If setting as default, clear others first
    addrList.mapInPlace(func(a : Address) : Address {
      if (a.id == addressId) {
        updatedAddr;
      } else if (input.isDefault) {
        { a with isDefault = false };
      } else {
        a;
      }
    });
    profiles.add(userId, { profile with addresses = addrList.toArray(); updatedAt = Time.now() });
    updatedAddr;
  };

  public func deleteAddress(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
    addressId : Nat,
  ) {
    let profile = switch (profiles.get(userId)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let filtered = List.fromArray<Address>(profile.addresses).filter(
      func(a : Address) : Bool { a.id != addressId }
    );
    profiles.add(userId, { profile with addresses = filtered.toArray(); updatedAt = Time.now() });
  };

  public func setDefaultAddress(
    profiles : Map.Map<Principal, UserProfile>,
    userId : UserId,
    addressId : Nat,
  ) {
    let profile = switch (profiles.get(userId)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let addrList = List.fromArray<Address>(profile.addresses);
    addrList.mapInPlace(func(a : Address) : Address {
      { a with isDefault = a.id == addressId }
    });
    profiles.add(userId, { profile with addresses = addrList.toArray(); updatedAt = Time.now() });
  };
};
