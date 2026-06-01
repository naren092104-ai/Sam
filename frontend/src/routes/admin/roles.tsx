import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAdminToken } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRoles,
});

function AdminRoles() {
  const token = useAppSelector((state) => state.admin.token) ?? getAdminToken();
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    adminApi.roles(token).then((resp) => setRoles(resp.data.roles)).catch((err) => setError(err.error || "Unable to load roles"));
  }, [token]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300/80">Security</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Role management</h2>
          </div>
          <button className="inline-flex items-center rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400">
            New role
          </button>
        </div>
      </section>
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white">Available roles</h3>
        </div>
        {error ? (
          <div className="p-6 text-sm text-rose-400">{error}</div>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  {['Role', 'Description'].map((head) => (
                    <th key={head} className="px-4 py-3 text-left font-medium uppercase tracking-[0.16em]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-900">
                    <td className="px-4 py-4 text-slate-100">{role.name}</td>
                    <td className="px-4 py-4 text-slate-200">{role.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
