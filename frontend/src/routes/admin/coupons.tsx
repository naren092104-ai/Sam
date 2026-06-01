import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

const statusStyles = (status) => {
  const map = {
    Active: "bg-emerald-500/10 text-emerald-300",
    Expired: "bg-rose-500/10 text-rose-300",
    Draft: "bg-slate-800 text-slate-300",
  };
  return map[status] ?? "bg-slate-800 text-slate-300";
};

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

function AdminCoupons() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.coupons(token).then((resp) => setCoupons(resp.data.coupons)).catch((err) => setError(err.error || "Unable to load coupons"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Promotions</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Coupon management</h2>
          </div>
          <button className="inline-flex items-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
            Create coupon
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white">Current coupons</h3>
        </div>
        {error ? (
          <div className="p-6 text-sm text-rose-400">{error}</div>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  {['Code', 'Discount', 'Expiry', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-3 text-left font-medium uppercase tracking-[0.16em]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-900">
                    <td className="px-4 py-4 text-slate-100">{coupon.code}</td>
                    <td className="px-4 py-4 text-slate-100">{coupon.discount}%</td>
                    <td className="px-4 py-4 text-slate-200">{coupon.expiry_date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(coupon.status)}`}>
                        {coupon.status}
                      </span>
                    </td>
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
