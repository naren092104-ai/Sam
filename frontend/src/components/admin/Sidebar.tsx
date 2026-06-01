import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Home,
  Box,
  Layers,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
  Tag,
  Star,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Menu,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/adminSlice";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: Home },
  { label: "Products", to: "/admin/products", icon: Box },
  { label: "Categories", to: "/admin/categories", icon: Layers },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Shipping", to: "/admin/shipping", icon: Truck },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Coupons", to: "/admin/coupons", icon: Tag },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", to: "/admin/reports", icon: FileText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const router = useRouter();

  const currentPath = router.state.location.pathname;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());
    
    // Clear all localStorage
    if (typeof window !== "undefined") {
      localStorage.clear();
      // Or specifically clear admin-related items
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user_email");
      localStorage.removeItem("admin_user");
    }
    
    // Redirect to home, NOT to /admin/login
    navigate({ to: "/", replace: true });
  };

  // Only render on client to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-orange-100 bg-white shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-80"
      }`}
    >
      {/* Top Branding */}
      <div className="border-b border-orange-100 p-4">
        <div className="flex items-center justify-between">

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden rounded-2xl transition hover:bg-orange-50"
          >
            {/* Logo Always Visible */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
              <span className="text-xl font-bold text-white">S</span>
            </div>

            {/* Text Hide When Collapsed */}
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Sam Enterprises
                </h2>

                <p className="text-xs text-slate-500">
                  Premium Pickles & Foods
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition hover:bg-orange-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              currentPath === item.to ||
              currentPath.startsWith(`${item.to}/`);

            return (
              <motion.div
                key={item.to}
                whileHover={{ x: collapsed ? 0 : 4 }}
              >
                <Link
                  to={item.to}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  } rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />

                  {!collapsed && (
                    <span>{item.label}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-orange-100 p-4">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center ${
            collapsed ? "justify-center" : "gap-3"
          } rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100`}
        >
          <LogOut className="h-5 w-5" />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}