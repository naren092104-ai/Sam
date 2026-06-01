import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/analytics/wishlist")({
  component: WishlistAnalytics,
});

function WishlistAnalytics() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.analyticsWishlist(token).then((resp) => setData(resp.data)).catch((err) => setError(err.error || "Unable to load wishlist data"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Analytics</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Wishlist intelligence</h2>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-3 text-sm text-slate-300">Insights snapshot</span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total wishlists</p>
          <p className="mt-4 text-4xl font-semibold text-white">{data?.totals?.totalWishlists ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">A quick view of customer wishlist activity.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Top products</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {data?.mostWishlisted?.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span>{product.name}</span>
                  <span className="text-slate-400">{product.wishlist_count} wishes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? <div className="rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 text-sm text-rose-300">{error}</div> : null}
    </div>
  );
}
