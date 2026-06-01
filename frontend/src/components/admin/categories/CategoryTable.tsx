import React from "react";
import { Edit3, Trash2 } from "lucide-react";

export function CategoryTable({ categories, loading, onEdit, onDelete }: any) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#FED7AA] bg-white p-0">
      <div className="flex items-center justify-between border-b border-[#FED7AA] p-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Category list</h3>
          <p className="text-sm text-slate-600">Only the fields required for product dropdown, landing page, and filtering.</p>
        </div>
        <div className="text-sm text-slate-500">{categories.length} categories</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Category Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Description</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Products Count</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">Loading...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No categories created yet. Create your first category.
                </td>
              </tr>
            ) : (
              categories.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-xl">{c.description}</td>
                  <td className="px-4 py-3 text-slate-700">{c.productsCount ?? 0}</td>
                  <td className="px-4 py-3 text-slate-700 capitalize">{c.status}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button title="Edit" onClick={() => onEdit(c)} className="rounded-md p-2 hover:bg-slate-100"><Edit3 size={16} /></button>
                      <button title="Delete" onClick={() => onDelete(c.id)} className="rounded-md p-2 hover:bg-red-50 text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
