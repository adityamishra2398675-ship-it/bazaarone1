import { c as createLucideIcon, b as useNavigate, e as useAuth, w as useActor, x as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, t as Card, U as User, k as Badge, B as Button, l as Label, I as Input, X, g as ue } from "./index-BB5MO6AH.js";
import { E as EmptyState } from "./EmptyState-C9TLmdj8.js";
import { M as MapPin } from "./map-pin-B2kX2mGb.js";
import { P as Plus } from "./plus-B6TX10v5.js";
import { T as Trash2 } from "./trash-2-CBGZQd1s.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false
};
function AccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, profileLoading, saveProfile } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showAddAddress, setShowAddAddress] = reactExports.useState(false);
  const [newAddress, setNewAddress] = reactExports.useState(EMPTY_ADDRESS);
  const [editingProfile, setEditingProfile] = reactExports.useState(false);
  const [profileForm, setProfileForm] = reactExports.useState(null);
  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  if (profileLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { variant: "fullscreen" });
  const startEditProfile = () => {
    setProfileForm({
      displayName: (profile == null ? void 0 : profile.displayName) ?? "",
      phone: (profile == null ? void 0 : profile.phone) ?? "",
      role: (profile == null ? void 0 : profile.role) ?? "buyer"
    });
    setEditingProfile(true);
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm) return;
    try {
      await saveProfile.mutateAsync(profileForm);
      ue.success("Profile updated!");
      setEditingProfile(false);
    } catch {
      ue.error("Failed to update profile");
    }
  };
  const addAddress = async (e) => {
    e.preventDefault();
    if (!actor) return;
    try {
      await actor.addAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      ue.success("Address added!");
      setShowAddAddress(false);
      setNewAddress(EMPTY_ADDRESS);
    } catch {
      ue.error("Failed to add address");
    }
  };
  const deleteAddress = async (id) => {
    if (!actor) return;
    try {
      await actor.deleteAddress(id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      ue.success("Address removed");
    } catch {
      ue.error("Failed to remove address");
    }
  };
  const setDefault = async (id) => {
    if (!actor) return;
    try {
      await actor.setDefaultAddress(id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      ue.success("Default address updated");
    } catch {
      ue.error("Failed to update");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground mb-6", children: "My Account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground text-lg truncate", children: (profile == null ? void 0 : profile.displayName) || "No name set" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (profile == null ? void 0 : profile.phone) ? `+91 ${profile.phone}` : "No phone added" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mt-1.5 text-xs capitalize", children: profile == null ? void 0 : profile.role })
          ] })
        ] }),
        !editingProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5 shrink-0",
            onClick: startEditProfile,
            "data-ocid": "edit-profile-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" }),
              "Edit"
            ]
          }
        )
      ] }),
      editingProfile && profileForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSaveProfile,
          className: "mt-5 pt-5 border-t border-border space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "profile-displayname", children: "Full Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "profile-displayname",
                    value: profileForm.displayName,
                    onChange: (e) => setProfileForm({
                      ...profileForm,
                      displayName: e.target.value
                    }),
                    placeholder: "Your full name",
                    required: true,
                    "data-ocid": "profile-name-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "profile-phone", children: "Phone Number *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none", children: "+91" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "profile-phone",
                      value: profileForm.phone,
                      onChange: (e) => setProfileForm({ ...profileForm, phone: e.target.value }),
                      placeholder: "10-digit mobile number",
                      maxLength: 10,
                      className: "pl-10",
                      required: true,
                      "data-ocid": "profile-phone-input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  className: "gap-1.5",
                  disabled: saveProfile.isPending,
                  "data-ocid": "save-profile-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                    saveProfile.isPending ? "Saving..." : "Save Changes"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "gap-1.5",
                  onClick: () => setEditingProfile(false),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                    "Cancel"
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
          "Saved Addresses"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => setShowAddAddress(!showAddAddress),
            "data-ocid": "add-address-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Add Address"
            ]
          }
        )
      ] }),
      showAddAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: addAddress,
          className: "mb-4 p-4 border border-border rounded-xl bg-muted/30 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground mb-1", children: "New Delivery Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-name", children: "Full Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-name",
                    value: newAddress.name,
                    onChange: (e) => setNewAddress({ ...newAddress, name: e.target.value }),
                    placeholder: "Recipient's name",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-phone", children: "Phone *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-phone",
                    value: newAddress.phone,
                    onChange: (e) => setNewAddress({ ...newAddress, phone: e.target.value }),
                    placeholder: "10-digit number",
                    maxLength: 10,
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-line1", children: [
                  "Address Line 1 *",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(House/Flat, Building, Street)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-line1",
                    value: newAddress.addressLine1,
                    onChange: (e) => setNewAddress({
                      ...newAddress,
                      addressLine1: e.target.value
                    }),
                    placeholder: "e.g. Flat 4B, Sunshine Apartments, MG Road",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-line2", children: [
                  "Address Line 2",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(Area, Landmark — optional)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-line2",
                    value: newAddress.addressLine2,
                    onChange: (e) => setNewAddress({
                      ...newAddress,
                      addressLine2: e.target.value
                    }),
                    placeholder: "e.g. Near Metro Station"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-city", children: "City *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-city",
                    value: newAddress.city,
                    onChange: (e) => setNewAddress({ ...newAddress, city: e.target.value }),
                    placeholder: "e.g. Mumbai",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-state", children: "State *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-state",
                    value: newAddress.state,
                    onChange: (e) => setNewAddress({ ...newAddress, state: e.target.value }),
                    placeholder: "e.g. Maharashtra",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-pincode", children: "Pincode *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "addr-pincode",
                    value: newAddress.pincode,
                    onChange: (e) => setNewAddress({ ...newAddress, pincode: e.target.value }),
                    placeholder: "6-digit PIN",
                    maxLength: 6,
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  id: "addr-default",
                  checked: newAddress.isDefault,
                  onChange: (e) => setNewAddress({ ...newAddress, isDefault: e.target.checked }),
                  className: "rounded border-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "addr-default",
                  className: "font-normal cursor-pointer",
                  children: "Set as default delivery address"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", "data-ocid": "save-address-btn", children: "Save Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  onClick: () => {
                    setShowAddAddress(false);
                    setNewAddress(EMPTY_ADDRESS);
                  },
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      !(profile == null ? void 0 : profile.addresses) || profile.addresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          emoji: "📍",
          title: "No addresses saved",
          description: "Add a delivery address to checkout faster.",
          className: "py-8"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: profile.addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start justify-between p-3 rounded-lg border border-border bg-background gap-3",
          "data-ocid": `address-row-${addr.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: addr.name }),
                addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-primary/10 text-primary border-primary/20 border", children: "Default" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5", children: [
                addr.addressLine1,
                addr.addressLine2 ? `, ${addr.addressLine2}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                addr.city,
                ", ",
                addr.state,
                " — ",
                addr.pincode
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mt-0.5", children: [
                "📱 +91 ",
                addr.phone
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              !addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "text-xs h-7 px-2",
                  onClick: () => setDefault(addr.id),
                  "data-ocid": `set-default-address-${addr.id}`,
                  children: "Set Default"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10",
                  onClick: () => deleteAddress(addr.id),
                  "aria-label": "Delete address",
                  "data-ocid": `delete-address-${addr.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ]
        },
        addr.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "flex-1",
          onClick: () => navigate({ to: "/orders" }),
          "data-ocid": "account-orders-btn",
          children: "My Orders"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "flex-1",
          onClick: () => navigate({ to: "/" }),
          "data-ocid": "account-shop-btn",
          children: "Continue Shopping"
        }
      )
    ] })
  ] });
}
export {
  AccountPage as default
};
