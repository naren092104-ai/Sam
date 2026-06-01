import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);
  const [productSummary, setProductSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      adminApi.reports(token, "sales"),
      adminApi.reports(token, "revenue"),
      adminApi.reports(token, "orders"),
      adminApi.reports(token, "products"),
    ])
      .then(([salesResp, revenueResp, orderResp, productResp]) => {
        setSales(salesResp.data.sales || []);
        setRevenue(revenueResp.data.revenue || []);
        setOrderSummary(orderResp.data.orderSummary || []);
        setProductSummary(productResp.data.productSummary || []);
      })
      .catch((err) => setError(err.error || "Unable to load reports"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Reports</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Revenue and order reports</h2>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-3 text-sm text-slate-300">Analytics summary</span>
        </div>
      </section>
      {error ? <div className="rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 text-sm text-rose-300">{error}</div> : null}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Order status</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            {orderSummary.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-3">
                <span>{item.status}</span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Top products</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            {productSummary.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-3">
                <span>{product.name}</span>
                <span className="font-semibold text-white">{product.sold_count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Recent revenue</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {sales.slice(0, 6).map((row) => (
              <div key={row.date} className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-3">
                <span>{row.date}</span>
                <span className="font-semibold text-white">₹{row.revenue}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Revenue by month</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {revenue.slice(0, 6).map((row) => (
              <div key={row.month} className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-3">
                <span>Month {row.month}</span>
                <span className="font-semibold text-white">₹{row.totalRevenue}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
