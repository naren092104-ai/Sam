import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAppSelector } from "@/store/hooks";

export function Header() {
  const user = useAppSelector((state) => state.admin.user);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Brand */}
        <Link to="/admin/dashboard" className="group inline-flex flex-col gap-1 text-left">
          <h1 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-orange-600">
            Sam Enterprises
          </h1>

          <p className="text-sm text-slate-500 transition-colors group-hover:text-orange-600">
            Admin Control Center
          </p>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button className="relative rounded-xl bg-orange-50 p-3 transition hover:bg-orange-100">
            <Bell className="h-5 w-5 text-orange-600" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-orange-50 cursor-pointer">
            
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-sm font-bold text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "Administrator"}
              </p>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>

                <p className="text-xs text-slate-500">
                  Online
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}