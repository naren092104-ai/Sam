import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

const badgeStyles = (status) => {
  const map = {
    approved: "bg-emerald-500/10 text-emerald-300",
    pending: "bg-amber-500/10 text-amber-300",
    rejected: "bg-rose-500/10 text-rose-300",
  };
  return map[status?.toLowerCase()] ?? "bg-slate-800 text-slate-300";
};

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.reviews(token).then((resp) => setReviews(resp.data.reviews)).catch((err) => setError(err.error || "Unable to load reviews"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300/80">Customer feedback</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Review management</h2>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-3 text-sm text-slate-300">{reviews.length} reviews</span>
        </div>
      </section>

      <section className="space-y-4">
        {error ? <div className="rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 text-sm text-rose-300">{error}</div> : null}
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{review.product_name}</p>
                <p className="mt-1 text-sm text-slate-400">{review.user_name}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-2 text-xs uppercase tracking-[0.24em] ${badgeStyles(review.status)}`}>
                {review.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-200">{review.comment}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">Rating: {review.rating}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
