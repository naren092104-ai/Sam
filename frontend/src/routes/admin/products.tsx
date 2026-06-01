import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Package, TrendingUp, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useProductApi } from "@/hooks/admin/useProductApi";
import { useCategoriesApi } from "@/hooks/admin/useCategoriesApi";
import { StatCard } from "@/components/admin/shared/StatCard";
import { Modal } from "@/components/admin/shared/Modal";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductTable } from "@/components/admin/products/ProductTable";
import type { AddProductFormData, ProductFilter } from "@/lib/validators/product";

export const Route = createFileRoute("/admin/products")({
  component: ProductManagement,
});

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  productsOnOffer: number;
}

function ProductManagement() {
  const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, loading, error } = useProductApi();
  const { getCategories } = useCategoriesApi();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    productsOnOffer: 0,
  });
  const [filters, setFilters] = useState<ProductFilter>({
    search: "",
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      const mappedCategories = result?.categories
        ?.filter((cat: any) => cat.status === "active")
        .map((cat: any) => ({
          value: cat.id.toString(),
          label: cat.name,
        })) ?? [];

      setCategories(mappedCategories);
    };
    fetchCategories();
  }, [getCategories]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts(filters);
      if (result) {
        setProducts(result.products);
        setTotal(result.total);
        // Calculate stats from products
        const allProducts = result.products;
        setStats({
          totalProducts: result.total,
          activeProducts: allProducts.filter(p => p.status === "active").length,
          outOfStock: allProducts.filter(p => p.stock === 0).length,
          productsOnOffer: allProducts.filter(p => p.offerAvailable).length,
        });
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: ProductFilter) => {
    setFilters(newFilters);
    setPage(newFilters.page || 1);
  };

  const handleAddProduct = async (data: AddProductFormData) => {
    setSubmitting(true);
    try {
      const result = await createProduct(data);
      if (result) {
        setSubmitSuccess(true);
        setIsAddModalOpen(false);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Refresh products
        const updated = await getProducts(filters);
        if (updated) {
          setProducts(updated.products);
          setTotal(updated.total);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (data: AddProductFormData) => {
    if (!editingProduct) return;
    setSubmitting(true);
    try {
      const result = await updateProduct(editingProduct.id, data);
      if (result) {
        setSubmitSuccess(true);
        setEditingProduct(null);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Refresh products
        const updated = await getProducts(filters);
        if (updated) {
          setProducts(updated.products);
          setTotal(updated.total);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      const success = await deleteProduct(id);
      if (success) {
        setDeleteSuccess(id);
        setTimeout(() => setDeleteSuccess(null), 3000);
        // Refresh products
        const updated = await getProducts(filters);
        if (updated) {
          setProducts(updated.products);
          setTotal(updated.total);
        }
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-600">
            Catalog Management
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Products
          </h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/20"
        >
          <Plus size={20} />
          Add Product
        </button>
      </motion.div>

      {/* Notifications */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200/50 p-4 text-green-700"
        >
          <Check size={20} />
          <span>Product saved successfully!</span>
        </motion.div>
      )}

      {deleteSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200/50 p-4 text-green-700"
        >
          <Check size={20} />
          <span>Product deleted successfully!</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200/50 p-4 text-red-700"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Dashboard Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package size={24} className="text-orange-600" />}
          label="Total Products"
          value={stats.totalProducts}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-green-600" />}
          label="Active Products"
          value={stats.activeProducts}
          color="green"
        />
        <StatCard
          icon={<AlertCircle size={24} className="text-red-600" />}
          label="Out Of Stock"
          value={stats.outOfStock}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-purple-600" />}
          label="On Offer"
          value={stats.productsOnOffer}
          color="purple"
        />
      </div>

      {/* Product Table */}
      <ProductTable
        products={products}
        total={total}
        page={page}
        limit={filters.limit || 10}
        loading={loading}
        onFilterChange={handleFilterChange}
        onEdit={async (product) => {
          const fullProduct = await getProductById(product.id);
          if (fullProduct) {
            setEditingProduct(fullProduct);
          } else {
            setEditingProduct(product); // fallback
          }
        }}
        onDelete={handleDeleteProduct}
        onView={async (product) => {
          const fullProduct = await getProductById(product.id);
          if (fullProduct) {
            setViewingProduct(fullProduct);
          } else {
            setViewingProduct(product); // fallback
          }
        }}
        categories={categories}
        deleting={deleting}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        subtitle="Create a new product with details and images"
        size="xl"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          loading={submitting}
          categories={categories}
        />
      </Modal>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
          subtitle="Update product details and information"
          size="xl"
        >
          <ProductForm
            onSubmit={handleUpdateProduct}
            loading={submitting}
            initialData={editingProduct}
            categories={categories}
          />
        </Modal>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <Modal
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          title={viewingProduct.name}
          subtitle="Product Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Product Image */}
            {viewingProduct.image && (
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Product Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Product Code
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {viewingProduct.code}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Category
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {viewingProduct.category}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Price
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  ${viewingProduct.price.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Stock
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {viewingProduct.stock} units
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Weight
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {viewingProduct.weight} {viewingProduct.weightUnit}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Status
                </p>
                <p className="mt-1 text-lg font-bold capitalize text-slate-900">
                  {viewingProduct.status}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-2">
                Description
              </p>
              <p className="text-slate-900">{viewingProduct.description}</p>
            </div>

            {/* Offer Info */}
            {viewingProduct.offerAvailable && (
              <div className="rounded-xl bg-orange-50 border border-orange-200/30 p-4">
                <p className="text-xs text-orange-600 uppercase font-semibold mb-3">
                  Offer Details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-orange-600">Offer Price</p>
                    <p className="mt-1 text-xl font-bold text-orange-600">
                      ${viewingProduct.offerPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600">Discount</p>
                    <p className="mt-1 text-xl font-bold text-orange-600">
                      {Math.round(
                        ((viewingProduct.price - viewingProduct.offerPrice) /
                          viewingProduct.price) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setViewingProduct(null);
                  setEditingProduct(viewingProduct);
                }}
                className="flex-1 rounded-xl bg-orange-100 px-6 py-3 font-semibold text-orange-600 transition-all hover:bg-orange-200"
              >
                Edit Product
              </button>
              <button
                onClick={() => setViewingProduct(null)}
                className="flex-1 rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
