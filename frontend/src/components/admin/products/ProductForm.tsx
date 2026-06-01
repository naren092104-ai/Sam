import { useState } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/admin/shared/FormFields";
import { ImageUpload, UploadedImage } from "@/components/admin/shared/ImageUpload";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AddProductFormData } from "@/lib/validators/product";

interface ProductFormProps {
  onSubmit: (data: AddProductFormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<AddProductFormData>;
  categories: Array<{ value: string; label: string }>;
}

const WEIGHT_UNITS = [
  { value: "gram", label: "Gram (g)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "litre", label: "Litre (L)" },
  { value: "ml", label: "Millilitre (ml)" },
];

const PRODUCT_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out_of_stock", label: "Out Of Stock" },
  { value: "draft", label: "Draft" },
];

export function ProductForm({
  onSubmit,
  loading = false,
  initialData,
  categories,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    weight: initialData?.weight || 0,
    weightUnit: initialData?.weightUnit || "kg",
    status: initialData?.status || "draft",
    offerAvailable: initialData?.offerAvailable || false,
    offerPrice: initialData?.offerPrice || 0,
    offerStartDate: initialData?.offerStartDate || undefined,
    offerEndDate: initialData?.offerEndDate || undefined,
  });

  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.images || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number"
        ? value === ""
          ? ""
          : Number(value)
        : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Product name is required";
    }
    if (!formData.category) {
      validationErrors.category = "Category is required";
    }
    if (formData.price === undefined || Number(formData.price) <= 0) {
      validationErrors.price = "Product price must be greater than 0";
    }
    if (formData.stock === undefined || Number(formData.stock) < 0) {
      validationErrors.stock = "Stock must be 0 or more";
    }
    if (!formData.status) {
      validationErrors.status = "Product status is required";
    }

    if (formData.weight === undefined || formData.weight === "" || Number(formData.weight) < 0) {
      validationErrors.weight = "Weight must be zero or greater";
    }
    if (!formData.weightUnit) {
      validationErrors.weightUnit = "Weight unit is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    if (images.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: "At least one image is required",
      }));
      return;
    }

    try {
      await onSubmit({
        ...formData,
        code: formData.code?.trim() || "",
        images,
        offerStartDate: formData.offerStartDate
          ? new Date(formData.offerStartDate)
          : undefined,
        offerEndDate: formData.offerEndDate
          ? new Date(formData.offerEndDate)
          : undefined,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    }
  };

  const offerDiscount =
    formData.offerAvailable && formData.price
      ? Math.round(
          ((Number(formData.price) - Number(formData.offerPrice)) / Number(formData.price)) * 100
        )
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-600">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Basic Information
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            error={errors.name}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Product Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Auto-generated if left blank"
              className="w-full rounded-xl border border-orange-200/30 bg-white px-4 py-3 text-slate-900 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
            />
            {errors.code && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                {errors.code}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            placeholder="Select a category"
            error={errors.category}
            required
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={PRODUCT_STATUS}
            error={errors.status}
            required
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          error={errors.description}
          rows={4}
        />
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Pricing & Stock
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Product Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.price}
            required
          />

          <FormField
            label="Stock Available"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            error={errors.stock}
            required
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Weight
              <span className="ml-1 text-orange-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight"
                className="flex-1 rounded-xl border border-orange-200/30 bg-white px-4 py-3 text-slate-900 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              />
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
                className="rounded-xl border border-orange-200/30 bg-white px-4 py-3 text-slate-900 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              >
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Section */}
      <div className="space-y-6 rounded-2xl border border-orange-200/30 bg-orange-50/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Offer Available
            </h3>
            <p className="text-sm text-slate-600">
              Enable special pricing for this product
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                offerAvailable: !prev.offerAvailable,
              }))
            }
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              formData.offerAvailable ? "bg-orange-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                formData.offerAvailable ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {formData.offerAvailable && (
          <div className="space-y-6 pt-4">
            <FormField
              label="Offer Price"
              name="offerPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.offerPrice}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.offerPrice}
              required
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Offer Start Date"
                name="offerStartDate"
                type="datetime-local"
                value={
                  formData.offerStartDate
                    ? new Date(formData.offerStartDate)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    offerStartDate: date,
                  }));
                }}
                required
              />

              <FormField
                label="Offer End Date"
                name="offerEndDate"
                type="datetime-local"
                value={
                  formData.offerEndDate
                    ? new Date(formData.offerEndDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    offerEndDate: date,
                  }));
                }}
                required
              />
            </div>

            {formData.offerPrice > 0 && (
              <div className="grid grid-cols-3 gap-4 rounded-xl bg-white/50 p-4">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Original Price</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    <span className="line-through">
                      ${formData.price.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Offer Price</p>
                  <p className="mt-1 text-lg font-bold text-orange-600">
                    ${formData.offerPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Discount</p>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    {offerDiscount}%
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Images */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Product Images
        </h3>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          error={errors.images}
          maxFiles={5}
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 inline animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </div>
    </form>
  );
}
