import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { useOrdersApi, type OrderDetail, type OrderFilter, type DeliveryAgent, type OrderStats, type OrderListItem } from "@/hooks/admin/useOrdersApi";
import { CheckCircle2, ClipboardList, CreditCard, Download, Eye, Loader2, Truck, X } from "lucide-react";

const DUMMY_ORDERS: OrderListItem[] = [
  {
    id: 1024,
    orderDate: "2026-05-31T11:20:00Z",
    customerName: "Radha S.",
    customerPhone: "+91 98765 43210",
    paymentMethod: "UPI",
    paymentStatus: "pending",
    status: "Pending",
    totalAmount: 549.0,
    productsCount: 3,
    deliveryAgent: "Not assigned",
  },
  {
    id: 1025,
    orderDate: "2026-05-30T15:05:00Z",
    customerName: "Kumar V.",
    customerPhone: "+91 91234 56789",
    paymentMethod: "Card",
    paymentStatus: "completed",
    status: "Delivered",
    totalAmount: 1299.0,
    productsCount: 5,
    deliveryAgent: "Suresh",
  },
  {
    id: 1026,
    orderDate: "2026-05-30T09:40:00Z",
    customerName: "Meena K.",
    customerPhone: "+91 99887 66554",
    paymentMethod: "COD",
    paymentStatus: "pending",
    status: "Confirmed",
    totalAmount: 799.0,
    productsCount: 2,
    deliveryAgent: "Arun",
  },
  {
    id: 1027,
    orderDate: "2026-05-29T20:15:00Z",
    customerName: "Aishwarya P.",
    customerPhone: "+91 91122 33445",
    paymentMethod: "Razorpay",
    paymentStatus: "completed",
    status: "Shipped",
    totalAmount: 2199.0,
    productsCount: 6,
    deliveryAgent: "Priya",
  },
];

const DUMMY_STATS: OrderStats = {
  totalOrders: 4,
  todayOrders: 1,
  pendingOrders: 2,
  confirmedOrders: 1,
  processingOrders: 0,
  packedOrders: 0,
  shippedOrders: 1,
  outForDeliveryOrders: 0,
  deliveredOrders: 1,
  cancelledOrders: 0,
  totalRevenue: 4796.0,
};

const ORDER_STATUS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUS = ["pending", "completed", "failed", "refunded"];
const PAYMENT_METHODS = ["COD", "UPI", "Razorpay", "Card", "Net Banking"];

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-300",
    Confirmed: "bg-sky-500/10 text-sky-300",
    Processing: "bg-cyan-500/10 text-cyan-300",
    Packed: "bg-violet-500/10 text-violet-300",
    Shipped: "bg-slate-700/10 text-slate-300",
    "Out For Delivery": "bg-blue-500/10 text-blue-300",
    Delivered: "bg-emerald-500/10 text-emerald-300",
    Cancelled: "bg-rose-500/10 text-rose-300",
  };
  return map[status] ?? "bg-slate-800 text-slate-300";
};

const nextStatusOptions: Record<string, string[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out For Delivery", "Cancelled"],
  "Out For Delivery": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

const addressLine = (order: OrderDetail) => {
  const lines = [order.line1, order.line2, order.area, order.city, order.district, order.state, order.pincode, order.country].filter(Boolean);
  return lines.join(", ");
};

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const {
    loading,
    error,
    getOrders,
    getOrderById,
    updateOrderStatus,
    assignOrderAgent,
    updateShipping,
    printOrder,
    getDeliveryAgents,
  } = useOrdersApi();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [filters, setFilters] = useState<OrderFilter>({ page: 1, limit: 10 });
  const [totalOrders, setTotalOrders] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [shippingForm, setShippingForm] = useState({ trackingId: "", courierPartner: "", expectedDeliveryDate: "", notes: "", shippingStatus: "" });
  const [panelOpen, setPanelOpen] = useState(false);

  const orderColumns = ["Order #", "Customer", "Items", "Amount", "Payment", "Status", "Agent", "Actions"];

  const fetchOrders = async (filter: OrderFilter) => {
    const response = await getOrders(filter);
    if (response) {
      setOrders(response.orders);
      setTotalOrders(response.total);
      setStats(response.stats);
    }
  };

  const fetchDeliveryAgents = async () => {
    const result = await getDeliveryAgents();
    if (result) setDeliveryAgents(result);
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders(filters);
    fetchDeliveryAgents();
  }, [token, filters]);

  const openOrder = async (orderId: number) => {
    setDetailLoading(true);
    const order = await getOrderById(orderId);
    if (order) {
      setSelectedOrder(order);
      setSelectedAgentId(order.delivery_agent_id ?? null);
      setShippingForm({
        trackingId: order.shipping_tracking_id ?? "",
        courierPartner: order.courier_partner ?? "",
        expectedDeliveryDate: order.expected_delivery_date ? order.expected_delivery_date.split("T")[0] : "",
        notes: order.shipping_notes ?? "",
        shippingStatus: order.shipping_status ?? "pending",
      });
      setPanelOpen(true);
    }
    setDetailLoading(false);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedOrder(null);
  };

  const handleSearch = (value: string) => setFilters((current) => ({ ...current, search: value, page: 1 }));
  const handleStatusFilter = (value: string) => setFilters((current) => ({ ...current, status: value || undefined, page: 1 }));
  const handlePaymentStatusFilter = (value: string) => setFilters((current) => ({ ...current, paymentStatus: value || undefined, page: 1 }));
  const handlePaymentMethodFilter = (value: string) => setFilters((current) => ({ ...current, paymentMethod: value || undefined, page: 1 }));
  const handleDateChange = (key: "startDate" | "endDate", value: string) => setFilters((current) => ({ ...current, [key]: value || undefined, page: 1 }));

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setActionLoading(true);
    await updateOrderStatus(selectedOrder.id, status);
    await fetchOrders(filters);
    await openOrder(selectedOrder.id);
    setActionLoading(false);
  };

  const handleAssignAgent = async () => {
    if (!selectedOrder || !selectedAgentId) return;
    setActionLoading(true);
    await assignOrderAgent(selectedOrder.id, selectedAgentId);
    await fetchOrders(filters);
    await openOrder(selectedOrder.id);
    setActionLoading(false);
  };

  const handleShippingSave = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    await updateShipping(selectedOrder.id, {
      trackingId: shippingForm.trackingId,
      courierPartner: shippingForm.courierPartner,
      expectedDeliveryDate: shippingForm.expectedDeliveryDate,
      notes: shippingForm.notes,
      shippingStatus: shippingForm.shippingStatus,
    });
    await fetchOrders(filters);
    await openOrder(selectedOrder.id);
    setActionLoading(false);
  };

  const handlePrint = async (printType: string) => {
    if (!selectedOrder) return;
    setActionLoading(true);
    await printOrder(selectedOrder.id, printType);
    window.print();
    setActionLoading(false);
  };

  const effectiveStats = stats ?? DUMMY_STATS;
  const dataOrders = orders.length > 0 ? orders : DUMMY_ORDERS;
  const effectiveTotalOrders = orders.length > 0 ? totalOrders : DUMMY_ORDERS.length;
  const pageCount = Math.max(1, Math.ceil(effectiveTotalOrders / (filters.limit || 10)));

  const cards = useMemo(
    () => [
      { label: "Total orders", value: effectiveStats.totalOrders, icon: ClipboardList },
      { label: "Delivered", value: effectiveStats.deliveredOrders, icon: CheckCircle2 },
      { label: "Pending", value: effectiveStats.pendingOrders, icon: Truck },
      { label: "Revenue", value: `₹${effectiveStats.totalRevenue.toFixed(2)}`, icon: CreditCard },
    ],
    [effectiveStats],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-orange-200 bg-white p-6 shadow-xl shadow-orange-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Orders</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Admin order management</h1>
            <p className="mt-2 text-sm text-slate-400">Search, filter, update status, assign agents, and review shipping for every order.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-3xl border border-orange-100 bg-orange-50 p-5 shadow-sm shadow-orange-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-600">{card.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100">
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-400">
              Search order
              <input
                type="search"
                value={filters.search ?? ""}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="order id, customer, transaction"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-slate-600"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              Status
              <select
                value={filters.status ?? ""}
                onChange={(event) => handleStatusFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="">All statuses</option>
                {ORDER_STATUS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              Payment status
              <select
                value={filters.paymentStatus ?? ""}
                onChange={(event) => handlePaymentStatusFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="">Any payment</option>
                {PAYMENT_STATUS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              Payment method
              <select
                value={filters.paymentMethod ?? ""}
                onChange={(event) => handlePaymentMethodFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="">All methods</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-400">
              From
              <input
                type="date"
                value={filters.startDate ?? ""}
                onChange={(event) => handleDateChange("startDate", event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              To
              <input
                type="date"
                value={filters.endDate ?? ""}
                onChange={(event) => handleDateChange("endDate", event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-lg shadow-orange-100">
        <div className="border-b border-slate-800 p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Order list</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{totalOrders} orders found</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{orders.length} on this page</span>
            <span>Limit {filters.limit}</span>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-orange-100 text-sm text-slate-700">
            <thead className="bg-orange-50 text-slate-700">
              <tr>
                {orderColumns.map((label) => (
                  <th key={label} className="px-4 py-3 text-left font-medium uppercase tracking-[0.16em]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="animate-pulse bg-orange-50">
                    <td className="px-4 py-4 text-slate-400">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                    <td className="px-4 py-4 text-slate-500">&nbsp;</td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                dataOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-orange-50">
                    <td className="px-4 py-4 font-medium text-slate-900">#{order.id}</td>
                    <td className="px-4 py-4 text-slate-700">{order.customerName}</td>
                    <td className="px-4 py-4 text-slate-700">{order.productsCount}</td>
                    <td className="px-4 py-4 text-slate-700">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-4 text-slate-700">{order.paymentMethod ?? "—"}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{order.deliveryAgent ?? "Unassigned"}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openOrder(order.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-700 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-orange-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Page {filters.page} of {pageCount}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: Math.max(1, (current.page || 1) - 1) }))}
              className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >Previous</button>
            <button
              disabled={filters.page >= pageCount}
              onClick={() => setFilters((current) => ({ ...current, page: Math.min(pageCount, (current.page || 1) + 1) }))}
              className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </section>

      {panelOpen && selectedOrder ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Order #{selectedOrder.id}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{selectedOrder.status}</h2>
                <p className="mt-2 text-sm text-slate-400">Placed on {new Date(selectedOrder.order_date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePrint("invoice")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  <Download className="h-4 w-4" />
                  Print invoice
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-700"
                >
                  <X className="h-4 w-4" /> Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Customer</p>
                      <p className="mt-1 text-lg font-semibold text-white">{selectedOrder.customer_name}</p>
                      <p className="mt-1 text-sm text-slate-400">{selectedOrder.customer_email}</p>
                      <p className="text-sm text-slate-400">{selectedOrder.customer_phone}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Shipping address</p>
                      <p className="mt-2 text-sm text-slate-200">{selectedOrder.recipient_name || selectedOrder.customer_name}</p>
                      <p className="text-sm text-slate-200">{addressLine(selectedOrder)}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>{selectedOrder.delivery_agent_name || "Unassigned"}</p>
                      <p>{selectedOrder.delivery_agent_phone || ""}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h3 className="text-base font-semibold text-white">Order items</h3>
                  <div className="mt-4 space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-400">{item.category_name}</p>
                            <p className="text-lg font-semibold text-white">{item.product_name}</p>
                          </div>
                          <div className="text-right text-sm text-slate-300">
                            <p>Qty: {item.quantity}</p>
                            <p>Weight: {item.weight ?? "—"}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-300">
                          <span>{item.product_code}</span>
                          <span>₹{item.price.toFixed(2)} each</span>
                          <span className="font-semibold text-white">₹{item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Payment</p>
                      <p className="mt-2 text-lg font-semibold text-white">{selectedOrder.payment_method || "Unknown"}</p>
                      <p className="text-sm text-slate-400">{selectedOrder.payment_status || "pending"}</p>
                    </div>
                    <div className="text-right text-sm text-slate-300">
                      <p>Txn: {selectedOrder.transaction_id || "—"}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3 border-t border-slate-800 pt-4 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>₹{selectedOrder.delivery_charge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-3 text-white">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₹{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h3 className="text-base font-semibold text-white">Manage order</h3>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-3">
                      <label className="space-y-2 text-sm text-slate-400">
                        Assign agent
                        <select
                          value={selectedAgentId ?? ""}
                          onChange={(event) => setSelectedAgentId(Number(event.target.value) || null)}
                          className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                        >
                          <option value="">Select agent</option>
                          {deliveryAgents.map((agent) => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        disabled={!selectedAgentId}
                        onClick={handleAssignAgent}
                        className="rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >Assign agent</button>
                    </div>

                    <div className="grid gap-3">
                      {nextStatusOptions[selectedOrder.status]?.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleUpdateStatus(status)}
                          className="rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h3 className="text-base font-semibold text-white">Shipping details</h3>
                  <div className="mt-4 grid gap-4">
                    <label className="space-y-2 text-sm text-slate-400">
                      Tracking ID
                      <input
                        type="text"
                        value={shippingForm.trackingId}
                        onChange={(event) => setShippingForm((current) => ({ ...current, trackingId: event.target.value }))}
                        className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-400">
                      Courier partner
                      <input
                        type="text"
                        value={shippingForm.courierPartner}
                        onChange={(event) => setShippingForm((current) => ({ ...current, courierPartner: event.target.value }))}
                        className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-400">
                      Expected delivery
                      <input
                        type="date"
                        value={shippingForm.expectedDeliveryDate}
                        onChange={(event) => setShippingForm((current) => ({ ...current, expectedDeliveryDate: event.target.value }))}
                        className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-400">
                      Status
                      <select
                        value={shippingForm.shippingStatus}
                        onChange={(event) => setShippingForm((current) => ({ ...current, shippingStatus: event.target.value }))}
                        className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_transit">In transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="delayed">Delayed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-400">
                      Notes
                      <textarea
                        rows={3}
                        value={shippingForm.notes}
                        onChange={(event) => setShippingForm((current) => ({ ...current, notes: event.target.value }))}
                        className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleShippingSave}
                      className="rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save shipping details
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {actionLoading ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating order...
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-rose-800 bg-rose-950/50 p-4 text-sm text-rose-200">{error}</div>
      ) : null}
    </div>
  );
}
