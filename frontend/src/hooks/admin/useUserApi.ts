import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import type { AddUserFormData, UserFilter } from "@/lib/validators/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

interface User extends Omit<AddUserFormData, "confirmPassword"> {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

interface UserStats {
  totalManagers: number;
  totalStaff: number;
  totalDeliveryAgents: number;
  activeUsers: number;
}

export function useUserApi() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(
    async (filters: UserFilter): Promise<UsersResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.searchType) queryParams.append("searchType", filters.searchType);
        if (filters.role) queryParams.append("role", filters.role);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
        if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
        queryParams.append("page", filters.page.toString());
        queryParams.append("limit", filters.limit.toString());

        const response = await fetch(buildApiUrl(`/admin/users?${queryParams}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load users";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(buildApiUrl("/admin/users/stats"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load stats";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createUser = useCallback(
    async (data: AddUserFormData): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
        };

        const response = await fetch(buildApiUrl("/admin/users"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create user");
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create user";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateUser = useCallback(
    async (id: string, data: Partial<AddUserFormData>): Promise<User | null> => {
      setLoading(true);
      setError(null);
      try {
        const payload = Object.entries(data).reduce((acc, [key, value]) => {
          if (key !== "confirmPassword" && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        const response = await fetch(buildApiUrl(`/admin/users/${id}`), {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update user";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildApiUrl(`/admin/users/${id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete user";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateUserStatus = useCallback(
    async (id: string, status: "active" | "inactive" | "suspended"): Promise<User | null> => {
      return updateUser(id, { status });
    },
    [updateUser]
  );

  return {
    getUsers,
    getUserStats,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    loading,
    error,
  };
}
