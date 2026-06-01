import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/store/adminSlice";
import { adminApi } from "@/lib/api/admin";
import { getAdminToken } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.admin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();

  useEffect(() => {
    if (token) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginStart());
    try {
      const response = await adminApi.login({ email, password });
      dispatch(loginSuccess(response.data));
      window.localStorage.setItem("admin_token", response.data.token);
      // Persist user email so AdminLayout can detect demo vs permanent admin on page refresh
      window.localStorage.setItem("admin_user_email", response.data.user?.email ?? "");
      console.info("[AdminLogin] login response:", response.data);
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err: any) {
      dispatch(loginFailure(err?.error || err?.response?.data?.error || "Invalid credentials."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_1fr]">
        <div className="relative hidden overflow-hidden rounded-l-[2rem] bg-gradient-to-br from-gold/95 via-accent/90 to-background p-10 text-foreground lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_45%)]" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/70">Aamras &amp; Co.</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink">Admin login</h1>
            <p className="mt-4 max-w-sm text-sm text-ink/70">
              Sign in to manage orders, products, categories, and customer workflows for the heritage pickle brand.
            </p>
          </div>
          <div className="mt-10 space-y-4 rounded-3xl border border-foreground/10 bg-background/70 p-6 text-foreground shadow-[var(--shadow-luxe)]">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Pro tip</p>
            <p className="text-sm leading-7 text-ink/70">
              Use your business email to access the dashboard, update pickles, and review live order activity.
            </p>
          </div>
        </div>
        <div className="p-10 sm:p-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Admin sign in</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink">Welcome back</h2>
            <p className="mt-2 text-sm text-foreground/70">Enter your credentials to open the admin control center.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-foreground/80">
                <span>Email</span>
                <input
                  id="login-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-3xl border border-border bg-background px-5 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/80">
                <span>Password</span>
                <input
                  id="login-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-3xl border border-border bg-background px-5 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-foreground/60">
            Need help? Contact support at <span className="text-ink font-semibold">admin@aamrasco.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
