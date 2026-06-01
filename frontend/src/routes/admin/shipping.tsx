import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

const statusClasses = (status) => {
  const map = {
    Delivered: "bg-emerald-500/10 text-emerald-300",
    Pending: "bg-amber-500/10 text-amber-300",
    Shipped: "bg-sky-500/10 text-sky-300",
    Cancelled: "bg-rose-500/10 text-rose-300",
  };
  return map[status] ?? "bg-slate-800 text-slate-300";
};

export const Route = createFileRoute("/admin/shipping")({
  component: AdminShipping,
});

function AdminShipping() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [shipping, setShipping] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.shipping(token).then((resp) => setShipping(resp.data.shipping)).catch((err) => setError(err.error || "Unable to load shipping data"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Operations</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Shipping overview</h2>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-3 text-sm text-slate-300">{shipping.length} shipments</span>
        </div>
      </section>
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white">Shipment queue</h3>
        </div>
        {error ? (
          <div className="p-6 text-sm text-rose-400">{error}</div>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  {['Tracking', 'Order', 'Status', 'Address', 'Updated'].map((head) => (
                    <th key={head} className="px-4 py-3 text-left font-medium uppercase tracking-[0.16em]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {shipping.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900">
                    <td className="px-4 py-4 text-slate-100">{item.tracking_id}</td>
                    <td className="px-4 py-4 text-slate-200">#{item.order_id}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-200">{item.address}</td>
                    <td className="px-4 py-4 text-slate-400">{item.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
