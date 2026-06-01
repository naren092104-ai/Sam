import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { useState } from "react";

interface RevenueChartProps {
  data: { date: string; revenue: number; orders: number }[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="mt-1 text-sm font-bold" style={{ color: p.color }}>
            {p.name === "revenue" ? `₹${Number(p.value).toLocaleString("en-IN")}` : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const [view, setView] = useState<"revenue" | "orders">("revenue");

  if (loading) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 w-40 rounded bg-slate-100 mb-6" />
        <div className="h-64 rounded-xl bg-slate-50" />
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    revenue: Number(d.revenue),
  }));

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">Analytics</p>
          <h3 className="mt-0.5 text-lg font-bold text-slate-900">Revenue Overview</h3>
        </div>
        <div className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-1">
          {(["revenue", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                view === tab
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-64">
        {formatted.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">No data for the last 14 days</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => view === "revenue" ? `₹${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              {view === "revenue" ? (
                <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: "#F97316", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#F97316" }} />
              ) : (
                <Area type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#colorOrders)" dot={{ fill: "#8B5CF6", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#8B5CF6" }} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface OrdersBarChartProps {
  data: { date: string; revenue: number; orders: number }[];
  loading?: boolean;
}

export function OrdersBarChart({ data, loading }: OrdersBarChartProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 w-36 rounded bg-slate-100 mb-6" />
        <div className="h-48 rounded-xl bg-slate-50" />
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    orders: Number(d.orders),
  }));

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500">Orders</p>
        <h3 className="mt-0.5 text-lg font-bold text-slate-900">Daily Order Volume</h3>
      </div>
      <div className="mt-6 h-48">
        {formatted.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">No order data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="orders" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface PaymentPieChartProps {
  data: { method: string; count: number; total: number }[];
  loading?: boolean;
}

export function PaymentPieChart({ data, loading }: PaymentPieChartProps) {
  const { PieChart, Pie, Cell, Legend } = require("recharts");
  const COLORS = ["#F97316", "#FB923C", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA"];

  if (loading) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 w-36 rounded bg-slate-100 mb-6" />
        <div className="h-48 rounded-xl bg-slate-50" />
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + Number(d.count), 0);

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">Payments</p>
        <h3 className="mt-0.5 text-lg font-bold text-slate-900">Payment Breakdown</h3>
      </div>
      <div className="mt-4">
        {data.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">No payment data yet</p>
          </div>
        ) : (
          <>
            <div className="flex h-48 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="count" paddingAngle={3}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, n: string) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {data.map((d, i) => (
                <div key={d.method} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600">{d.method}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{d.count}</span>
                    <span className="text-xs text-slate-400">{total > 0 ? Math.round((d.count / total) * 100) : 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
