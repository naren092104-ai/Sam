import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  description?: string;
  status?: string;
  productsCount?: number;
}

interface CategoriesResponse {
  categories: Category[];
  total?: number;
}

export function useCategoriesApi() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategories = useCallback(
    async (): Promise<CategoriesResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load categories";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createCategory = useCallback(
    async (data: any): Promise<any | null> => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error || "Failed to create category");
        }
        const json = await response.json();
        return json.category ?? json;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create category";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateCategory = useCallback(
    async (id: string, data: any): Promise<any | null> => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
        const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error || "Failed to update category");
        }
        const json = await response.json();
        return json.category ?? json;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update category";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
        const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error || "Failed to delete category");
        }
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete category";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { getCategories, createCategory, updateCategory, deleteCategory, loading, error };
}
