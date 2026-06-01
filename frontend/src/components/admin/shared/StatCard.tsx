import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: "orange" | "blue" | "purple" | "green";
}

const colorMap = {
  orange: "bg-orange-500/10 border-orange-200/30 text-orange-600",
  blue: "bg-blue-500/10 border-blue-200/30 text-blue-600",
  purple: "bg-purple-500/10 border-purple-200/30 text-purple-600",
  green: "bg-green-500/10 border-green-200/30 text-green-600",
};

export function StatCard({ icon, label, value, change, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 backdrop-blur-sm transition-all hover:shadow-lg ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {change && <p className="mt-2 text-xs text-slate-500">{change}</p>}
        </div>
        <div className="rounded-xl bg-white/50 p-3">{icon}</div>
      </div>
    </motion.div>
  );
}
