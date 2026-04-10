import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as useComposedRefs, a as cn, b as useNavigate, f as useCart, e as useAuth, w as useActor, x as useQueryClient, P as PaymentMethod, t as Card, l as Label, I as Input, m as Separator, B as Button, L as LoadingSpinner, g as ue } from "./index-BB5MO6AH.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, a as createContextScope } from "./index-CbuI5qaj.js";
import { R as Root, I as Item, c as createRovingFocusGroupScope } from "./index-BGRChdIV.js";
import { u as useDirection } from "./index-BE2xTQvD.js";
import { a as usePrevious, u as useSize } from "./index-DD3dMR8U.js";
import { P as Presence } from "./index-csKOvUPi.js";
import { P as PriceDisplay } from "./PriceDisplay-CDDMhq99.js";
import { B as BuyerGuard } from "./RoleGuard-HKtImsB6.js";
import { M as MapPin } from "./map-pin-B2kX2mGb.js";
import { P as Plus } from "./plus-B6TX10v5.js";
import { C as CircleCheck } from "./circle-check-oHOG3ZEt.js";
import { C as CreditCard } from "./credit-card-HB-D2bDq.js";
import "./index-CWHGSKOk.js";
import "./EmptyState-C9TLmdj8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const DELIVERY_FEE = 49n;
const FREE_DELIVERY_THRESHOLD = 499n;
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh"
];
const PAYMENT_OPTIONS = [
  {
    value: PaymentMethod.cashOnDelivery,
    label: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "w-5 h-5" }),
    available: true
  },
  {
    value: PaymentMethod.upi,
    label: "UPI",
    subtitle: "PhonePe, GPay, Paytm & more",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5" }),
    available: false
  },
  {
    value: PaymentMethod.card,
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5" }),
    available: false
  }
];
function blankAddress(profile) {
  return {
    name: (profile == null ? void 0 : profile.displayName) ?? "",
    phone: (profile == null ? void 0 : profile.phone) ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  };
}
function addressToDelivery(a) {
  return {
    name: a.name,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2,
    city: a.city,
    state: a.state,
    pincode: a.pincode
  };
}
function CheckoutContent() {
  const navigate = useNavigate();
  const { cart, totalAmount } = useCart();
  const { profile } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [paymentMethod, setPaymentMethod] = reactExports.useState(
    PaymentMethod.cashOnDelivery
  );
  const savedAddresses = (profile == null ? void 0 : profile.addresses) ?? [];
  const defaultSaved = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null;
  const [selectedAddressId, setSelectedAddressId] = reactExports.useState(
    defaultSaved ? defaultSaved.id : "new"
  );
  const [newAddress, setNewAddress] = reactExports.useState(
    blankAddress(profile ?? void 0)
  );
  const items = (cart == null ? void 0 : cart.items) ?? [];
  const deliveryFee = totalAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0n : DELIVERY_FEE;
  const grandTotal = totalAmount + deliveryFee;
  if (items.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }
  const activeDeliveryAddress = selectedAddressId === "new" ? newAddress : addressToDelivery(
    savedAddresses.find((a) => a.id === selectedAddressId) ?? savedAddresses[0]
  );
  const updateNew = (field, value) => setNewAddress((prev) => ({ ...prev, [field]: value }));
  const handlePlaceOrder = async (e) => {
    var _a;
    e.preventDefault();
    if (!actor || items.length === 0) return;
    const addr = activeDeliveryAddress;
    if (!addr.name || !addr.phone || !addr.addressLine1 || !addr.city || !addr.state || !addr.pincode) {
      ue.error("Please fill in all required address fields");
      return;
    }
    if (!/^\d{6}$/.test(addr.pincode)) {
      ue.error("Pincode must be a 6-digit number");
      return;
    }
    setSubmitting(true);
    try {
      const orders = await actor.placeOrder({
        deliveryAddress: addr,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const firstOrder = orders[0];
      const orderId = ((_a = firstOrder == null ? void 0 : firstOrder.id) == null ? void 0 : _a.toString()) ?? "";
      const estimated = (firstOrder == null ? void 0 : firstOrder.estimatedDelivery) ?? "3–5 business days";
      navigate({
        to: "/order-confirmation",
        search: { orderId, estimated }
      });
    } catch {
      ue.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground mb-6", children: "Checkout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handlePlaceOrder, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Delivery Address" })
          ] }),
          savedAddresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-2 mb-4",
              "data-ocid": "checkout-address-select",
              children: [
                savedAddresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: `w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-marketplace ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
                    onClick: () => setSelectedAddressId(addr.id),
                    "aria-pressed": selectedAddressId === addr.id,
                    "data-ocid": `checkout-saved-address-${addr.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedAddressId === addr.id ? "border-primary" : "border-muted-foreground"}`,
                          children: selectedAddressId === addr.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground", children: [
                          addr.name,
                          addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium", children: "Default" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5 leading-snug", children: [
                          addr.addressLine1,
                          addr.addressLine2 && `, ${addr.addressLine2}`
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                          addr.city,
                          ", ",
                          addr.state,
                          " - ",
                          addr.pincode
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                          "+91 ",
                          addr.phone
                        ] })
                      ] })
                    ]
                  },
                  addr.id.toString()
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: `w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-marketplace ${selectedAddressId === "new" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
                    onClick: () => setSelectedAddressId("new"),
                    "aria-pressed": selectedAddressId === "new",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedAddressId === "new" ? "border-primary" : "border-muted-foreground"}`,
                          children: selectedAddressId === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-primary" }),
                        "Add a new address"
                      ] })
                    ]
                  }
                )
              ]
            }
          ),
          (selectedAddressId === "new" || savedAddresses.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-name", children: "Full Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "chk-name",
                  value: newAddress.name,
                  onChange: (e) => updateNew("name", e.target.value),
                  placeholder: "Ravi Kumar",
                  required: selectedAddressId === "new",
                  "data-ocid": "checkout-name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-phone", children: "Phone *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm select-none", children: "+91" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "chk-phone",
                    className: "rounded-l-none",
                    value: newAddress.phone,
                    onChange: (e) => updateNew("phone", e.target.value),
                    placeholder: "98765 43210",
                    maxLength: 10,
                    required: selectedAddressId === "new",
                    "data-ocid": "checkout-phone"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-addr1", children: "Address Line 1 *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "chk-addr1",
                  placeholder: "House/Flat No., Building Name, Street",
                  value: newAddress.addressLine1,
                  onChange: (e) => updateNew("addressLine1", e.target.value),
                  required: selectedAddressId === "new",
                  "data-ocid": "checkout-address1"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-addr2", children: "Address Line 2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "chk-addr2",
                  placeholder: "Area, Colony, Locality, Landmark",
                  value: newAddress.addressLine2,
                  onChange: (e) => updateNew("addressLine2", e.target.value),
                  "data-ocid": "checkout-address2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-city", children: "City *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "chk-city",
                  value: newAddress.city,
                  onChange: (e) => updateNew("city", e.target.value),
                  placeholder: "Mumbai",
                  required: selectedAddressId === "new",
                  "data-ocid": "checkout-city"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-state", children: "State *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "chk-state",
                  value: newAddress.state,
                  onChange: (e) => updateNew("state", e.target.value),
                  required: selectedAddressId === "new",
                  className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "data-ocid": "checkout-state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select State" }),
                    INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chk-pincode", children: "Pincode *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "chk-pincode",
                  placeholder: "6-digit pincode",
                  value: newAddress.pincode,
                  onChange: (e) => updateNew(
                    "pincode",
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  ),
                  maxLength: 6,
                  required: selectedAddressId === "new",
                  "data-ocid": "checkout-pincode"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground mb-4", children: "Payment Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RadioGroup,
            {
              value: paymentMethod,
              onValueChange: (v) => setPaymentMethod(v),
              className: "space-y-2",
              "data-ocid": "checkout-payment",
              children: PAYMENT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-3 p-3 rounded-lg border transition-marketplace ${!opt.available ? "opacity-50 cursor-not-allowed border-border" : paymentMethod === opt.value ? "border-primary bg-primary/5 cursor-pointer" : "border-border hover:border-primary/40 cursor-pointer"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RadioGroupItem,
                      {
                        value: opt.value,
                        id: `pay-${opt.value}`,
                        disabled: !opt.available
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: `pay-${opt.value}`,
                        className: `flex items-center gap-3 flex-1 ${opt.available ? "cursor-pointer" : "cursor-not-allowed"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: opt.available ? "text-primary" : "text-muted-foreground",
                              children: opt.icon
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                              opt.label,
                              !opt.available && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground", children: "(Coming soon)" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.subtitle })
                          ] })
                        ]
                      }
                    ),
                    opt.available && paymentMethod === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary shrink-0" })
                  ]
                },
                opt.value
              ))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border bg-card space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Order Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              items.length,
              " ",
              items.length === 1 ? "item" : "items"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: totalAmount, size: "sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery" }),
            deliveryFee === 0n ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: deliveryFee, size: "sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { amount: grandTotal, size: "md" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2", children: [
          "You will pay ₹",
          grandTotal.toString(),
          " at delivery (Cash on Delivery)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "lg",
            className: "w-full gap-2",
            disabled: submitting,
            "data-ocid": "checkout-place-order-btn",
            children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { className: "p-0 h-5 w-5" }) : "Place Order"
          }
        )
      ] }) })
    ] }) })
  ] });
}
function CheckoutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BuyerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutContent, {}) });
}
export {
  CheckoutPage as default
};
