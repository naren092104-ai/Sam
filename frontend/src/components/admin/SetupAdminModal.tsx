import { FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/adminSlice";
import { adminApi } from "@/lib/api/admin";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Lock,
  User,
  Mail,
} from "lucide-react";

const INITIAL_EMAIL = "admin@example.com";

interface Props {
  token: string;
  userEmail: string;
}

export function SetupAdminModal({ token, userEmail }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Only show if user is the demo admin
  if (userEmail !== INITIAL_EMAIL) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await adminApi.setupPermanentAdmin(token, { name, email, password });
      setSuccess(true);

      // Log out demo admin after 2.5 seconds, then redirect to login
      setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("admin_token");
        navigate({ to: "/admin/login" });
      }, 2500);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.error || "Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Full-screen backdrop — blocks all interaction beneath */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Gradient header bar */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 p-[3px]">
          <div className="rounded-t-[calc(2rem-3px)] bg-white" />
        </div>

        {/* Top hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-8 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                One-time setup
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900">
                Create your admin account
              </h2>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <p className="text-sm text-amber-800">
              You are currently signed in with the{" "}
              <span className="font-semibold">demo account</span>. Set up your
              permanent credentials to continue — the demo account will be
              removed automatically.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Admin account created!
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Demo account removed. Redirecting to login…
                </p>
              </div>
              <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400"
                  style={{ animation: "progressBar 2.5s linear forwards" }}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Full name
                </span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="setup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </label>

              {/* Email */}
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="setup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourdomain.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="setup-password"
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Confirm Password */}
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Confirm password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="setup-confirm-password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </label>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                id="setup-submit"
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Create permanent admin &amp; remove demo
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
