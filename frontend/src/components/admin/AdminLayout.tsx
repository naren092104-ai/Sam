import { Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";

const DEMO_EMAIL = "admin@example.com";

export function AdminLayout() {
  // Mount state to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);
  
  const storeToken = useAppSelector((state) => state.admin.token);
  const storeUser = useAppSelector((state) => state.admin.user) as { email?: string } | null;
  const token = storeToken ?? getAdminToken();

  const router = useRouter();
  const navigate = useNavigate();
  const currentPath = router?.state?.location?.pathname ?? "";
  const isLoginPage = currentPath.startsWith("/admin/login");

  // Get user email: Redux store (after fresh login) or localStorage (after page refresh)
  const userEmail = storeUser?.email || "";

  const isDemo = userEmail === DEMO_EMAIL;

  // Initialize mounted state and handle client-only logic
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (currentPath === "/admin") {
      if (token) {
        navigate({ to: "/admin/dashboard", replace: true });
      } else {
        navigate({ to: "/", replace: true });
      }
      return;
    }

    if (isLoginPage) {
      if (token) {
        navigate({ to: "/admin/dashboard", replace: true });
      }
      return;
    }

    if (!token && currentPath.startsWith("/admin")) {
      navigate({ to: "/", replace: true });
    }
  }, [currentPath, token, isLoginPage, navigate, mounted]);

  // Only show authenticated layout after mount
  if (!mounted) {
    return <Outlet />;
  }

  if (!token && currentPath.startsWith("/admin") && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="min-h-screen transition-all duration-300 lg:ml-80">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="space-y-6"
          >
            {/* Welcome Banner */}
            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 p-[2px]">
                <div className="rounded-[22px] bg-white px-6 py-5">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Welcome Back 👋
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage products, orders, customers and business
                    operations from your admin dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}