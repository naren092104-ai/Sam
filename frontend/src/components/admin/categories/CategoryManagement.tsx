import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCategoriesApi } from "@/hooks/admin/useCategoriesApi";
import { Modal } from "@/components/admin/shared/Modal";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export function CategoryManagement() {
  const { getCategories, createCategory, updateCategory, deleteCategory, loading, error } = useCategoriesApi();
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await getCategories();
    if (res && res.categories) {
      setCategories(res.categories);
    }
  }

  async function handleAdd(data: any) {
    const created = await createCategory(data);
    if (created) {
      setIsAddOpen(false);
      await fetchCategories();
    }
  }

  async function handleUpdate(id: string, data: any) {
    const updated = await updateCategory(id, data);
    if (updated) {
      setEditing(null);
      await fetchCategories();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const ok = await deleteCategory(id);
    if (ok) {
      await fetchCategories();
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-600">Catalog</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Categories</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={(c) => setEditing(c)}
        onDelete={(id) => handleDelete(id)}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Category" size="lg">
        <CategoryForm onSubmit={handleAdd} />
      </Modal>

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Category" size="lg">
          <CategoryForm onSubmit={(data) => handleUpdate(editing.id, data)} initialData={editing} />
        </Modal>
      )}
    </div>
  );
}
