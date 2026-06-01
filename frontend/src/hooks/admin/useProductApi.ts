import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import type { AddProductFormData, ProductFilter } from "@/lib/validators/product";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface Product extends AddProductFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export function useProductApi() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = useCallback(
    async (filters: ProductFilter): Promise<ProductsResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
        if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
        queryParams.append("page", filters.page.toString());
        queryParams.append("limit", filters.limit.toString());

        const response = await fetch(buildApiUrl(`/admin/products?${queryParams}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const json = await response.json();
        const normalizedProducts = Array.isArray(json.products)
          ? json.products.map((product: any) => ({
              ...product,
              price: Number(product.price ?? product.original_price ?? 0),
              offerPrice: product.offerPrice !== undefined ? Number(product.offerPrice) : product.offer_price !== undefined ? Number(product.offer_price) : undefined,
              stock: Number(product.stock ?? 0),
              weight: Number(product.weight ?? 0),
              weightUnit: product.weightUnit || product.weight_unit || "kg",
            }))
          : [];

        return { ...json, products: normalizedProducts };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load products";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createProduct = useCallback(
    async (data: AddProductFormData): Promise<Product | null> => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("code", data.code || "");
        formData.append("category_id", data.category);
        formData.append("description", data.description);
        formData.append("original_price", data.price.toString());
        formData.append("stock", data.stock.toString());
        formData.append("weight", data.weight.toString());
        formData.append("weightUnit", data.weightUnit);
        formData.append("status", data.status);
        formData.append("offerAvailable", data.offerAvailable.toString());

        if (data.offerAvailable && data.offerPrice !== undefined) {
          formData.append("offer_price", data.offerPrice.toString());
          if (data.offerStartDate) formData.append("offerStartDate", data.offerStartDate.toISOString());
          if (data.offerEndDate) formData.append("offerEndDate", data.offerEndDate.toISOString());
        }

        if (data.images.length > 0) {
          formData.append("image", data.images[0].file);
          data.images.slice(1).forEach((img) => {
            formData.append("gallery", img.file);
          });
        }

        // Log the exact payload for debugging (convert FormData to object for readability)
        try {
          const payload: Record<string, any> = {};
          for (const [key, value] of formData.entries()) {
            // files -> show filename
            if (value instanceof File) payload[key] = value.name;
            else payload[key] = value;
          }
          // eslint-disable-next-line no-console
          console.debug("[useProductApi] createProduct payload:", payload);
        } catch (logErr) {
          // ignore logging errors
        }

        // Also log a friendly payload shape used in diagnostics
        try {
          const friendly = {
            productName: data.name,
            productCode: data.code,
            categoryId: data.category,
            productPrice: data.price,
            stockAvailable: data.stock,
            weight: data.weight,
            image: data.images.length > 0 ? data.images[0].file.name : null,
            offerEnabled: data.offerAvailable,
            offerPrice: data.offerPrice ?? null,
            offerStartDate: data.offerStartDate ? data.offerStartDate.toISOString() : null,
            offerEndDate: data.offerEndDate ? data.offerEndDate.toISOString() : null,
          };
          // eslint-disable-next-line no-console
          console.info('[useProductApi] friendly payload:', friendly);
        } catch (e) {}

        const response = await fetch(buildApiUrl("/admin/products"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = json && (json.error || json.message) ? (json.error || json.message) : `Failed to create product (status ${response.status})`;
          throw new Error(message);
        }

        return json.product ?? json;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create product";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateProduct = useCallback(
    async (id: string, data: Partial<AddProductFormData>): Promise<Product | null> => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "images" && Array.isArray(value)) {
            const primaryImage = value[0];
            if (primaryImage?.file?.size > 0) {
              formData.append("image", primaryImage.file);
            }
            value.slice(1).forEach((img) => {
              if (img.file?.size > 0) {
                formData.append("gallery", img.file);
              }
            });
          } else if (value !== undefined && value !== null) {
            const formKey =
              key === "category"
                ? "category_id"
                : key === "price"
                  ? "original_price"
                  : key === "offerPrice"
                    ? "offer_price"
                    : key;
            if (value instanceof Date) {
              formData.append(formKey, value.toISOString());
            } else {
              formData.append(formKey, String(value));
            }
          }
        });

        const response = await fetch(buildApiUrl(`/admin/products/${id}`), {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = json && (json.error || json.message)
            ? (json.error || json.message)
            : `Failed to update product (status ${response.status})`;
          throw new Error(message);
        }

        return json.product ?? json;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update product";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildApiUrl(`/admin/products/${id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete product";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const getProductById = useCallback(
    async (id: string): Promise<Product | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildApiUrl(`/admin/products/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const json = await response.json();
        const product = json.product;
        
        if (!product) return null;

        // Transform the response to match the form data structure
        return {
          ...product,
          price: Number(product.price ?? 0),
          offerPrice: Number(product.offerPrice ?? 0),
          stock: Number(product.stock ?? 0),
          weight: Number(product.weight ?? 0),
          category: product.category_id?.toString() || product.category, // Use category_id for form select
          offerAvailable: Number(product.offerPrice ?? 0) > 0,
          offerStartDate: product.offerStartDate ? new Date(product.offerStartDate) : undefined,
          offerEndDate: product.offerEndDate ? new Date(product.offerEndDate) : undefined,
          images: [
            ...(product.image
              ? [
                  {
                    file: new File([], "existing-image"),
                    preview: product.image,
                    isThumbnail: true,
                  },
                ]
              : []),
            ...(Array.isArray(product.images)
              ? product.images.map((img: any) => ({
                  file: new File([], "existing-image"),
                  preview: img.path,
                  isThumbnail: false,
                  id: img.id,
                }))
              : []),
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load product details";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { getProducts, getProductById, createProduct, updateProduct, deleteProduct, loading, error };
}
