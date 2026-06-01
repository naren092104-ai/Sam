import React, { useState } from "react";
import { FormField, FormTextarea } from "@/components/admin/shared/FormFields";

export function CategoryForm({ onSubmit, initialData }: any) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Category Name" name="name" value={form.name} onChange={handleChange} required />
      <FormTextarea label="Description" name="description" value={form.description} onChange={handleChange} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 text-sm text-slate-900">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white">
          {submitting ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
}
