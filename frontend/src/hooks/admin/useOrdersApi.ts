import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

export interface OrderFilter {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderListItem {
  id: number;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  paymentMethod?: string;
  paymentStatus?: string;
  status: string;
  totalAmount: number;
  productsCount: number;
  deliveryAgent?: string | null;
  tracking_id?: string | null;
}

export interface OrderStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  packedOrders: number;
  shippedOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export interface AddressPayload {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItemDetail {
  id: number;
  product_id: number;
  product_code: string;
  category_name: string;
  product_name: string;
  quantity: number;
  weight?: number;
  price: number;
  total: number;
}

export interface OrderHistoryEntry {
  status: string;
  note: string;
  created_at: string;
}

export interface OrderDetail {
  id: number;
  order_date: string;
  subtotal: number;
  delivery_charge: number;
  discount: number;
  tax: number;
  total_amount: number;
  status: string;
  tracking_id?: string | null;
  payment_id?: number | null;
  delivery_agent_id?: number | null;
  address_id?: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method?: string | null;
  payment_status?: string | null;
  transaction_id?: string | null;
  recipient_name?: string | null;
  address_phone?: string | null;
  line1?: string | null;
  line2?: string | null;
  area?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  delivery_agent_name?: string | null;
  delivery_agent_phone?: string | null;
  shipping_status?: string | null;
  shipping_tracking_id?: string | null;
  courier_partner?: string | null;
  expected_delivery_date?: string | null;
  shipping_notes?: string | null;
  items: OrderItemDetail[];
  history: OrderHistoryEntry[];
}

export interface DeliveryAgent {
  id: number;
  name: string;
  phone?: string;
  status: string;
}

export interface OrderListResponse {
  orders: OrderListItem[];
  total: number;
  page: number;
  limit: number;
  stats: OrderStats;
}

export function useOrdersApi() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runRequest = useCallback(
    async <T>(callback: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await callback();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load order data";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getOrders = useCallback(
    async (filters: OrderFilter): Promise<OrderListResponse | null> => {
      return runRequest(async () => {
        const response = await adminApi.orders(token, filters);
        const data = response.data;
        // Handle new response format with success flag
        if (data.success && data.data) {
          return data.data as OrderListResponse;
        }
        // Handle old response format for backwards compatibility
        return data as OrderListResponse;
      });
    },
    [token, runRequest],
  );

  const getOrderById = useCallback(
    async (id: number): Promise<OrderDetail | null> => {
      return runRequest(async () => {
        const response = await adminApi.orderById(token, id);
        const data = response.data;
        // Handle new response format
        if (data.success && data.order) {
          return { ...data.order, items: data.items || [], history: data.history || [] } as OrderDetail;
        }
        // Handle old response format
        return (data.order || data) as OrderDetail;
      });
    },
    [token, runRequest],
  );

  const updateOrderStatus = useCallback(
    async (id: number, status: string, note?: string) => {
      return runRequest(async () => {
        const response = await adminApi.updateOrderStatus(token, id, { status, note });
        return response.data;
      });
    },
    [token, runRequest],
  );

  const assignOrderAgent = useCallback(
    async (id: number, deliveryAgentId: number) => {
      return runRequest(async () => {
        const response = await adminApi.assignOrderAgent(token, id, { delivery_agent_id: deliveryAgentId });
        return response.data;
      });
    },
    [token, runRequest],
  );

  const updateShipping = useCallback(
    async (id: number, data: { trackingId?: string; courierPartner?: string; expectedDeliveryDate?: string; notes?: string; shippingStatus?: string }) => {
      return runRequest(async () => {
        const response = await adminApi.updateShipping(token, id, data);
        return response.data;
      });
    },
    [token, runRequest],
  );

  const getOrderInvoice = useCallback(
    async (id: number) => {
      return runRequest(async () => {
        const response = await adminApi.orderInvoice(token, id);
        return response.data;
      });
    },
    [token, runRequest],
  );

  const printOrder = useCallback(
    async (orderId: number, printType: string) => {
      return runRequest(async () => {
        const response = await adminApi.printOrder(token, { orderId, printType });
        return response.data;
      });
    },
    [token, runRequest],
  );

  const getDeliveryAgents = useCallback(async () => {
    return runRequest(async () => {
      const response = await adminApi.orderAgents(token);
      const data = response.data;
      // Handle new response format
      if (data.success && data.agents) {
        return data.agents as DeliveryAgent[];
      }
      // Handle old response format
      return (data.agents || []) as DeliveryAgent[];
    });
  }, [token, runRequest]);

  return {
    loading,
    error,
    getOrders,
    getOrderById,
    updateOrderStatus,
    assignOrderAgent,
    updateShipping,
    getOrderInvoice,
    printOrder,
    getDeliveryAgents,
  };
}
