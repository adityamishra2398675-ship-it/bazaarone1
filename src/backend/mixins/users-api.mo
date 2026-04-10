import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/users";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, Types.UserProfile>,
  nextAddressId : { var value : Nat },
) {
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UsersLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(input : Types.SaveProfileInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ignore UsersLib.saveProfile(profiles, caller, input);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?Types.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UsersLib.getProfile(profiles, userId);
  };

  public shared ({ caller }) func addAddress(input : Types.AddAddressInput) : async Types.Address {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextAddressId.value;
    nextAddressId.value += 1;
    UsersLib.addAddress(profiles, caller, input, id);
  };

  public shared ({ caller }) func updateAddress(addressId : Nat, input : Types.AddAddressInput) : async Types.Address {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UsersLib.updateAddress(profiles, caller, addressId, input);
  };

  public shared ({ caller }) func deleteAddress(addressId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UsersLib.deleteAddress(profiles, caller, addressId);
  };

  public shared ({ caller }) func setDefaultAddress(addressId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UsersLib.setDefaultAddress(profiles, caller, addressId);
  };
};
