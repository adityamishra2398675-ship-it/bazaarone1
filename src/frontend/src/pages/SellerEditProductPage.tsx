import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SellerGuard } from "../components/RoleGuard";
import { useActor } from "../hooks/useBackend";
import { useProduct } from "../hooks/useProducts";
import { CATEGORY_LABELS, Category } from "../types";

const CATEGORIES = Object.values(Category);

interface ImagePreview {
  blob: ExternalBlob;
  previewUrl: string;
  fileName: string;
  uploadProgress: number;
  isExisting: boolean;
}

function ImageUploadZone({
  images,
  onAdd,
  onRemove,
}: {
  images: ImagePreview[];
  onAdd: (file: File) => void;
  onRemove: (idx: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onAdd(file);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-smooth cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        data-ocid="edit-product-image-upload-zone"
        aria-label="Upload product image"
      >
        <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">
          Click or drag to replace image
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WEBP — max 5MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAdd(file);
            e.target.value = "";
          }}
        />
      </button>

      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, idx) => (
            <div
              key={`img-${idx}-${img.fileName}`}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={img.previewUrl}
                alt={img.fileName}
                className="w-full h-full object-cover"
              />
              {img.uploadProgress > 0 && img.uploadProgress < 100 && (
                <div className="absolute inset-x-0 bottom-0 p-1 bg-card/80">
                  <Progress value={img.uploadProgress} className="h-1" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SellerEditProductContent() {
  const { id } = useParams({ from: "/layout/seller/products/$id/edit" });
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: product, isLoading } = useProduct(id ? BigInt(id) : null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: Category.electronics as Category,
    deliveryEstimate: "",
    currency: "INR",
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        deliveryEstimate: product.deliveryEstimate,
        currency: product.currency,
        isActive: product.isActive,
      });
      setImages(
        product.images.map((blob, idx) => ({
          blob: blob as unknown as ExternalBlob,
          previewUrl: blob.getDirectURL(),
          fileName: `image-${idx + 1}`,
          uploadProgress: 100,
          isExisting: true,
        })),
      );
    }
  }, [product]);

  const handleAddImage = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const idx = images.length;
    const placeholder: ImagePreview = {
      blob: ExternalBlob.fromBytes(new Uint8Array()),
      previewUrl,
      fileName: file.name,
      uploadProgress: 0,
      isExisting: false,
    };
    setImages((prev) => [...prev, placeholder]);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setImages((prev) =>
        prev.map((img, i) =>
          i === idx ? { ...img, uploadProgress: pct } : img,
        ),
      );
    });
    setImages((prev) =>
      prev.map((img, i) =>
        i === idx
          ? { ...img, blob, uploadProgress: 100, isExisting: false }
          : img,
      ),
    );
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      const removed = prev[idx];
      if (!removed.isExisting && removed.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !product) return;

    setLoading(true);
    try {
      await actor.updateProduct({
        id: product.id,
        title: form.title,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        stock: BigInt(Math.round(Number(form.stock))),
        category: form.category,
        deliveryEstimate: form.deliveryEstimate,
        currency: form.currency,
        isActive: form.isActive,
        images: images.map((img) => img.blob),
      });
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated!");
      navigate({ to: "/seller/products" });
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!actor || !product) return;
    setDeleting(true);
    try {
      await actor.deleteProduct(product.id);
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      toast.success("Product deleted");
      navigate({ to: "/seller/products" });
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner variant="fullscreen" />;
  if (!product)
    return (
      <EmptyState
        emoji="😕"
        title="Product not found"
        description="This product may have been deleted or doesn't exist."
        action={{
          label: "My Products",
          onClick: () => navigate({ to: "/seller/products" }),
        }}
      />
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/seller/products" })}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Edit Product
            </h1>
            <p className="text-xs text-muted-foreground">
              Update your product details
            </p>
          </div>
        </div>

        {/* Delete with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
              data-ocid="edit-product-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>"{product.title}"</strong>? This action cannot be undone
                and the product will be removed from all listings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 border border-border bg-card space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              data-ocid="edit-product-title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              data-ocid="edit-product-desc"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                data-ocid="edit-product-price"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                data-ocid="edit-product-stock"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                setForm({ ...form, category: v as Category })
              }
            >
              <SelectTrigger data-ocid="edit-product-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Estimate */}
          <div className="space-y-1.5">
            <Label htmlFor="delivery">Delivery Estimate</Label>
            <Input
              id="delivery"
              value={form.deliveryEstimate}
              onChange={(e) =>
                setForm({ ...form, deliveryEstimate: e.target.value })
              }
              data-ocid="edit-product-delivery"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label>Product Images</Label>
            <ImageUploadZone
              images={images}
              onAdd={handleAddImage}
              onRemove={handleRemoveImage}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              data-ocid="edit-product-active"
            />
            <div>
              <Label htmlFor="isActive" className="cursor-pointer font-medium">
                Product is active
              </Label>
              <p className="text-xs text-muted-foreground">
                Active products are visible to buyers
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
              data-ocid="edit-product-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/seller/products" })}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

export default function SellerEditProductPage() {
  return (
    <SellerGuard>
      <SellerEditProductContent />
    </SellerGuard>
  );
}
