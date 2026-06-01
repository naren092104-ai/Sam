import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductFilter } from "@/lib/validators/product";

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  offerPrice?: number;
  stock: number;
  weight: number;
  weightUnit: string;
  status: string;
  image?: string;
}

interface ProductTableProps {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  onFilterChange: (filter: ProductFilter) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  categories: Array<{ value: string; label: string }>;
  deleting?: string | null;
}

const STATUS_COLORS = {
  active: "bg-green-500/10 text-green-700",
  inactive: "bg-gray-500/10 text-gray-700",
  out_of_stock: "bg-red-500/10 text-red-700",
  draft: "bg-blue-500/10 text-blue-700",
};

const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  out_of_stock: "Out of Stock",
  draft: "Draft",
};

export function ProductTable({
  products,
  total,
  page,
  limit,
  loading,
  onFilterChange,
  onEdit,
  onDelete,
  onView,
  categories,
  deleting,
}: ProductTableProps) {
  const [filters, setFilters] = useState<ProductFilter>({
    search: "",
    category: "",
    status: "",
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or code..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-orange-200/30 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600 transition-all hover:bg-orange-200"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl border border-orange-200/30 bg-orange-50/30 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value || "")}
                className="w-full rounded-lg border border-orange-200/30 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Status
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value || "")}
                className="w-full rounded-lg border border-orange-200/30 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || ""}
                onChange={(e) => handleFilterChange("sortBy", e.target.value || "")}
                className="w-full rounded-lg border border-orange-200/30 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                className="w-full rounded-lg border border-orange-200/30 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-orange-200/30 bg-white shadow-sm">
        {loading && products.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <Loader2 size={32} className="mx-auto mb-3 animate-spin text-orange-600" />
              <p className="text-slate-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600">No products found</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-orange-200/30 bg-orange-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Category
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-200/30">
                  {products.map((product) => {
                    const displayPrice = Number(product.price ?? 0);
                    const displayOfferPrice = product.offerPrice !== undefined ? Number(product.offerPrice) : undefined;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="transition-colors hover:bg-orange-50/50"
                      >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.weight} {product.weightUnit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{product.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {product.category}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-semibold text-slate-900">
                            ${displayPrice.toFixed(2)}
                          </p>
                          {displayOfferPrice !== undefined && !Number.isNaN(displayOfferPrice) && (
                            <p className="text-xs text-orange-600">
                              ${displayOfferPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              STATUS_COLORS[
                                product.status as keyof typeof STATUS_COLORS
                              ]
                            }`}
                          >
                            {
                              STATUS_LABELS[
                                product.status as keyof typeof STATUS_LABELS
                              ]
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onView(product)}
                            className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => onEdit(product)}
                            className="rounded-lg bg-orange-100 p-2 text-orange-600 transition-all hover:bg-orange-200"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            disabled={deleting === product.id}
                            className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === product.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-orange-200/30 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} products
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-orange-200/30 p-2 text-slate-600 transition-all hover:bg-orange-50 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = Math.max(1, page - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        pageNum === page
                          ? "bg-orange-600 text-white"
                          : "border border-orange-200/30 text-slate-600 hover:bg-orange-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-orange-200/30 p-2 text-slate-600 transition-all hover:bg-orange-50 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
