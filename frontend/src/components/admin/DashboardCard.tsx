import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  gradient: string;
  iconBg: string;
  loading?: boolean;
}

export function DashboardCard({ title, value, icon: Icon, trend, trendLabel, gradient, iconBg, loading }: DashboardCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-8 w-32 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? "text-slate-400" : trend > 0 ? "text-emerald-600" : "text-rose-500";
  const trendBg = trend === undefined || trend === 0 ? "bg-slate-50" : trend > 0 ? "bg-emerald-50" : "bg-rose-50";

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/50`}>
      {/* Gradient accent line at top */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${gradient}`} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 truncate">{value}</p>
          {(trend !== undefined || trendLabel) && (
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${trendBg} ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {trend !== undefined && `${Math.abs(trend)}%`}
              {trendLabel && <span>{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
