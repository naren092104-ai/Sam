import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

const DEMO_EMAIL = "admin@example.com";

function AdminDashboard() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const storeUser = useAppSelector((state) => state.admin.user) as { email?: string } | null;
  const [dashboard, setDashboard] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showRevenueChart = (dashboard?.revenueChart?.length ?? 0) > 0;

  // Detect demo user
  const userEmail =
    storeUser?.email ||
    (typeof window !== "undefined" ? localStorage.getItem("admin_user_email") ?? "" : "");

  useEffect(() => {
    if (!token) return;
    adminApi.dashboard(token)
      .then((resp) => setDashboard(resp.data))
      .catch((err) => setError(err.error || "Unable to load dashboard"));
  }, [token]);

  if (!dashboard && !error) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-8 text-slate-500 shadow-sm">
        Loading dashboard…
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-500/80">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Business performance</h2>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>Updated just now</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Revenue", value: `₹${dashboard?.totals?.totalRevenue ?? 0}` },
              { label: "Monthly Revenue", value: `₹${dashboard?.totals?.monthlyRevenue ?? dashboard?.totals?.totalRevenue ?? 0}` },
              { label: "Total Orders", value: dashboard?.totals?.totalOrders ?? 0 },
              { label: "Active Users", value: dashboard?.totals?.totalUsers ?? 0 },
            ].map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-orange-100 bg-orange-50/50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>

          {showRevenueChart && (
            <div className="mt-8 rounded-3xl border border-orange-100 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Performance chart</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Revenue last 14 days</h3>
                </div>
              </div>
              <div className="mt-6 h-[320px]">
                <ChartContainer config={{ revenue: { label: "Revenue", color: "#fb923c" } }}>
                  <LineChart data={dashboard?.revenueChart ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: "#64748b" }} />
                    <YAxis tick={{ fill: "#64748b" }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div>
        )}

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent orders</h3>
                <p className="text-sm text-slate-500">Latest activity from the sales pipeline.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {dashboard?.recentOrders?.length === 0 && (
                <p className="text-sm text-slate-400">No orders yet.</p>
              )}
              {dashboard?.recentOrders?.map((order) => (
                <div key={order.id} className="rounded-3xl border border-orange-50 bg-orange-50/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Order #{order.id}</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{order.customer_name}</p>
                    </div>
                    <div className="inline-flex rounded-full border border-orange-100 bg-white px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-600">
                      {order.status}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-500">
                    <span>{order.payment_method ?? "Unknown"}</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Top products</h3>
                <p className="text-sm text-slate-500">What’s driving revenue this week.</p>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard?.topProducts?.length === 0 && (
                  <p className="text-sm text-slate-400">No products yet.</p>
                )}
                {dashboard?.topProducts?.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-orange-50 bg-orange-50/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                        <p className="mt-1 text-sm text-slate-500">₹{Number(product.offerPrice) > 0 ? product.offerPrice : product.price}</p>
                      </div>
                      <span className="text-sm text-slate-500">{product.sold_count} sold</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Payment breakdown</h3>
                <p className="text-sm text-slate-500">How customers are paying.</p>
              </div>
              <div className="mt-6 grid gap-3">
                {dashboard?.paymentBreakdown?.length === 0 && (
                  <p className="text-sm text-slate-400">No payment data available.</p>
                )}
                {dashboard?.paymentBreakdown?.map((item) => (
                  <div key={item.method} className="rounded-3xl border border-orange-50 bg-orange-50/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.method}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.count} payments</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">₹{item.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Low stock alerts</h3>
                <p className="text-sm text-slate-500">Products running low in stock.</p>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard?.lowStock?.length === 0 && (
                  <p className="text-sm text-slate-400">Everything is stocked up.</p>
                )}
                {dashboard?.lowStock?.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-orange-50 bg-orange-50/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">Stock: {item.stock_quantity}</p>
                      </div>
                      <span className="text-sm text-slate-500">₹{Number(item.offerPrice) > 0 ? item.offerPrice : item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
