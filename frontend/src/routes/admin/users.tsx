import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users, UserCheck, UserX, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useUserApi } from "@/hooks/admin/useUserApi";
import { StatCard } from "@/components/admin/shared/StatCard";
import { Modal } from "@/components/admin/shared/Modal";
import { UserForm } from "@/components/admin/users/UserForm";
import { UserTable } from "@/components/admin/users/UserTable";
import type { AddUserFormData, UserFilter } from "@/lib/validators/user";

export const Route = createFileRoute("/admin/users")({
  component: UserManagement,
});

interface UserStats {
  totalManagers: number;
  totalStaff: number;
  totalDeliveryAgents: number;
  activeUsers: number;
}

function UserManagement() {
  const { getUsers, getUserStats, createUser, updateUser, deleteUser, loading, error } = useUserApi();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalManagers: 0,
    totalStaff: 0,
    totalDeliveryAgents: 0,
    activeUsers: 0,
  });
  const [filters, setFilters] = useState<UserFilter>({
    search: "",
    searchType: "name",
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Fetch users and stats
  useEffect(() => {
    const fetchData = async () => {
      const [usersData, statsData] = await Promise.all([
        getUsers(filters),
        getUserStats(),
      ]);

      if (usersData) {
        setUsers(usersData.users);
        setTotal(usersData.total);
      }

      if (statsData) {
        setStats(statsData);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters: UserFilter) => {
    setFilters(newFilters);
    setPage(newFilters.page || 1);
  };

  const handleAddUser = async (data: AddUserFormData) => {
    setSubmitting(true);
    try {
      const result = await createUser(data);
      if (result) {
        setSubmitSuccess(true);
        setIsAddModalOpen(false);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Refresh users
        const updated = await getUsers(filters);
        if (updated) {
          setUsers(updated.users);
          setTotal(updated.total);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: AddUserFormData) => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const result = await updateUser(editingUser.id, data);
      if (result) {
        setSubmitSuccess(true);
        setEditingUser(null);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Refresh users
        const updated = await getUsers(filters);
        if (updated) {
          setUsers(updated.users);
          setTotal(updated.total);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      const success = await deleteUser(id);
      if (success) {
        setDeleteSuccess(id);
        setTimeout(() => setDeleteSuccess(null), 3000);
        // Refresh users
        const updated = await getUsers(filters);
        if (updated) {
          setUsers(updated.users);
          setTotal(updated.total);
        }
      }
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            Team Management
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Users & Roles
          </h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/20"
        >
          <Plus size={20} />
          Create New User
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
          <span>User saved successfully!</span>
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
          <span>User deleted successfully!</span>
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
          icon={<Users size={24} className="text-blue-600" />}
          label="Total Managers"
          value={stats.totalManagers}
          color="blue"
        />
        <StatCard
          icon={<UserCheck size={24} className="text-purple-600" />}
          label="Total Staff"
          value={stats.totalStaff}
          color="purple"
        />
        <StatCard
          icon={<UserX size={24} className="text-green-600" />}
          label="Delivery Agents"
          value={stats.totalDeliveryAgents}
          color="green"
        />
        <StatCard
          icon={<UserCheck size={24} className="text-orange-600" />}
          label="Active Users"
          value={stats.activeUsers}
          color="orange"
        />
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        total={total}
        page={page}
        limit={filters.limit || 10}
        loading={loading}
        onFilterChange={handleFilterChange}
        onEdit={(user) => setEditingUser(user)}
        onDelete={handleDeleteUser}
        onView={(user) => setViewingUser(user)}
        deleting={deleting}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New User"
        subtitle="Add a new team member to the system"
        size="lg"
      >
        <UserForm
          onSubmit={handleAddUser}
          loading={submitting}
        />
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title="Edit User"
          subtitle="Update user information and roles"
          size="lg"
        >
          <UserForm
            onSubmit={handleUpdateUser}
            loading={submitting}
            initialData={editingUser}
          />
        </Modal>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <Modal
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          title={viewingUser.fullName}
          subtitle="User Details"
          size="md"
        >
          <div className="space-y-6">
            {/* User Avatar */}
            <div className="flex justify-center">
              {viewingUser.profileImage && (
                <img
                  src={viewingUser.profileImage}
                  alt={viewingUser.fullName}
                  className="h-24 w-24 rounded-full object-cover"
                />
              )}
              {!viewingUser.profileImage && (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-3xl font-bold text-orange-600">
                  {viewingUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Details Grid */}
            <div className="grid gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Full Name
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {viewingUser.fullName}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-600 uppercase font-semibold">
                    Employee ID
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {viewingUser.employeeId}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-600 uppercase font-semibold">
                    Role
                  </p>
                  <p className="mt-2 text-lg font-bold capitalize text-slate-900">
                    {viewingUser.role === "delivery_agent"
                      ? "Delivery Agent"
                      : viewingUser.role.charAt(0).toUpperCase() +
                        viewingUser.role.slice(1)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Email
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {viewingUser.email}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase font-semibold">
                  Phone
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {viewingUser.phoneNumber}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-600 uppercase font-semibold">
                    Status
                  </p>
                  <p className="mt-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        viewingUser.status === "active"
                          ? "bg-green-500/10 text-green-700"
                          : viewingUser.status === "suspended"
                            ? "bg-red-500/10 text-red-700"
                            : "bg-gray-500/10 text-gray-700"
                      }`}
                    >
                      {viewingUser.status.charAt(0).toUpperCase() +
                        viewingUser.status.slice(1)}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-600 uppercase font-semibold">
                    Created
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatDate(viewingUser.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions Info */}
            <div className="rounded-xl bg-blue-50 border border-blue-200/30 p-4">
              <p className="text-sm font-medium text-slate-900 mb-3">
                Permissions for{" "}
                {viewingUser.role === "manager"
                  ? "Manager"
                  : viewingUser.role === "staff"
                    ? "Staff"
                    : "Delivery Agent"}
                :
              </p>
              <ul className="space-y-1 text-sm text-slate-700">
                {viewingUser.role === "manager" && (
                  <>
                    <li>✓ View Dashboard</li>
                    <li>✓ Manage Products</li>
                    <li>✓ Manage Categories</li>
                    <li>✓ View Orders</li>
                    <li>✓ View Reports</li>
                    <li>✓ Manage Users</li>
                  </>
                )}
                {viewingUser.role === "staff" && (
                  <>
                    <li>✓ Manage Products</li>
                    <li>✓ Manage Categories</li>
                    <li>✓ View Orders</li>
                  </>
                )}
                {viewingUser.role === "delivery_agent" && (
                  <>
                    <li>✓ View Assigned Orders</li>
                    <li>✓ Update Delivery Status</li>
                    <li>✓ Track Shipments</li>
                  </>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setViewingUser(null);
                  setEditingUser(viewingUser);
                }}
                className="flex-1 rounded-xl bg-orange-100 px-6 py-3 font-semibold text-orange-600 transition-all hover:bg-orange-200"
              >
                Edit User
              </button>
              <button
                onClick={() => setViewingUser(null)}
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
