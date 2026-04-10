import { j as jsxRuntimeExports, b as useNavigate, w as useActor, x as useQueryClient, r as reactExports, C as Category, B as Button, t as Card, l as Label, I as Input, i as CATEGORY_LABELS, D as LoaderCircle, g as ue, X, E as ExternalBlob } from "./index-BB5MO6AH.js";
import { T as Textarea, I as ImagePlus, P as Progress } from "./textarea-EP-RT8vL.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BZxnd295.js";
import { S as Switch } from "./switch-CvvS2V5P.js";
import { S as SellerGuard } from "./RoleGuard-HKtImsB6.js";
import { A as ArrowLeft } from "./arrow-left-JP4hwmqH.js";
import "./index-IXOTxK3N.js";
import "./index-CbuI5qaj.js";
import "./index-BE2xTQvD.js";
import "./index-BXbFjnjX.js";
import "./index-CWHGSKOk.js";
import "./index-DD3dMR8U.js";
import "./EmptyState-C9TLmdj8.js";
const CATEGORIES = Object.values(Category);
function ImageUploadZone({
  images,
  onAdd,
  onRemove
}) {
  const inputRef = reactExports.useRef(null);
  const handleDrop = (e) => {
    var _a;
    e.preventDefault();
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (file == null ? void 0 : file.type.startsWith("image/")) onAdd(file);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-smooth cursor-pointer",
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        onDrop: handleDrop,
        onDragOver: (e) => e.preventDefault(),
        "data-ocid": "product-image-upload-zone",
        "aria-label": "Upload product image",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Click or drag to upload image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPG, PNG, WEBP — max 5MB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => {
                var _a;
                const file = (_a = e.target.files) == null ? void 0 : _a[0];
                if (file) onAdd(file);
                e.target.value = "";
              }
            }
          )
        ]
      }
    ),
    images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: images.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img.previewUrl,
              alt: img.fileName,
              className: "w-full h-full object-cover"
            }
          ),
          img.uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 p-1 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: img.uploadProgress, className: "h-1" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onRemove(idx),
              className: "absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80 transition-colors",
              "aria-label": "Remove image",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
            }
          )
        ]
      },
      `img-${idx}-${img.fileName}`
    )) })
  ] });
}
function SellerNewProductContent() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [loading, setLoading] = reactExports.useState(false);
  const [images, setImages] = reactExports.useState([]);
  const [form, setForm] = reactExports.useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: Category.electronics,
    deliveryEstimate: "3-5 business days",
    currency: "INR",
    isActive: true
  });
  const handleAddImage = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    const currentIdx = images.length;
    const placeholder = {
      blob: ExternalBlob.fromBytes(new Uint8Array()),
      previewUrl,
      fileName: file.name,
      uploadProgress: 0
    };
    setImages((prev) => [...prev, placeholder]);
    const idx = currentIdx;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setImages(
        (prev) => prev.map(
          (img, i) => i === idx ? { ...img, uploadProgress: pct } : img
        )
      );
    });
    setImages(
      (prev) => prev.map(
        (img, i) => i === idx ? { ...img, blob, uploadProgress: 0 } : img
      )
    );
  };
  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      const removed = prev[idx];
      if (removed == null ? void 0 : removed.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actor) return;
    if (!form.title || !form.price || !form.stock) {
      ue.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await actor.createProduct({
        title: form.title,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        stock: BigInt(Math.round(Number(form.stock))),
        category: form.category,
        deliveryEstimate: form.deliveryEstimate,
        currency: form.currency,
        images: images.map((img) => img.blob)
      });
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      ue.success("Product created successfully!");
      navigate({ to: "/seller/products" });
    } catch {
      ue.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/seller/products" }),
          "aria-label": "Go back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Add New Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Fill in the details to list your product on One Bajar" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 border border-border bg-card space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "title", children: [
          "Product Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "title",
            placeholder: "e.g. Samsung Galaxy M35 5G",
            value: form.title,
            onChange: (e) => setForm({ ...form, title: e.target.value }),
            required: true,
            "data-ocid": "new-product-title"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "description",
            placeholder: "Describe your product — features, specifications, etc.",
            rows: 4,
            value: form.description,
            onChange: (e) => setForm({ ...form, description: e.target.value }),
            "data-ocid": "new-product-desc"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "price", children: [
            "Price (₹) ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "price",
              type: "number",
              min: "0",
              step: "1",
              placeholder: "999",
              value: form.price,
              onChange: (e) => setForm({ ...form, price: e.target.value }),
              required: true,
              "data-ocid": "new-product-price"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "stock", children: [
            "Stock Quantity ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "stock",
              type: "number",
              min: "0",
              step: "1",
              placeholder: "100",
              value: form.stock,
              onChange: (e) => setForm({ ...form, stock: e.target.value }),
              required: true,
              "data-ocid": "new-product-stock"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Category ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.category,
            onValueChange: (v) => setForm({ ...form, category: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "new-product-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: CATEGORY_LABELS[cat] }, cat)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delivery", children: "Delivery Estimate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "delivery",
            placeholder: "e.g. 3-5 business days",
            value: form.deliveryEstimate,
            onChange: (e) => setForm({ ...form, deliveryEstimate: e.target.value }),
            "data-ocid": "new-product-delivery"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product Images" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUploadZone,
          {
            images,
            onAdd: handleAddImage,
            onRemove: handleRemoveImage
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "isActive",
            checked: form.isActive,
            onCheckedChange: (v) => setForm({ ...form, isActive: v }),
            "data-ocid": "new-product-active"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "isActive", className: "cursor-pointer font-medium", children: "List as active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active products are visible to buyers" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "flex-1",
            disabled: loading,
            "data-ocid": "new-product-submit-btn",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
              "Creating..."
            ] }) : "Create Product"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate({ to: "/seller/products" }),
            children: "Cancel"
          }
        )
      ] })
    ] }) })
  ] });
}
function SellerNewProductPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SellerGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerNewProductContent, {}) });
}
export {
  SellerNewProductPage as default
};
