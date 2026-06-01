import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [settings, setSettings] = useState({ theme: "", currency: "", timezone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.settings(token).then((resp) => setSettings(resp.data.settings || {})).catch((err) => setError(err.error || "Unable to load settings"));
  }, [token]);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError(null);

    try {
      await adminApi.saveSettings(token, settings);
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err.error || "Unable to save settings");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300/80">System</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Platform settings</h2>
          </div>
          <button onClick={handleSave} className="inline-flex items-center rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400">
            Save changes
          </button>
        </div>
      </section>
      {message ? <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-sm text-emerald-300">{message}</div> : null}
      {error ? <div className="rounded-3xl border border-rose-500/25 bg-rose-500/5 p-4 text-sm text-rose-300">{error}</div> : null}
      <form onSubmit={handleSave} className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-slate-950/20 sm:grid-cols-2">
        {[
          { label: "Default theme", field: "theme", placeholder: "light / dark" },
          { label: "Currency", field: "currency", placeholder: "USD / INR" },
          { label: "Timezone", field: "timezone", placeholder: "Asia/Kolkata" },
        ].map(({ label, field, placeholder }) => (
          <label key={field} className="space-y-2 text-sm text-slate-300">
            <span className="font-medium text-white">{label}</span>
            <input
              value={settings[field] || ""}
              placeholder={placeholder}
              onChange={(event) => setSettings({ ...settings, [field]: event.target.value })}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        ))}
      </form>
    </div>
  );
}
