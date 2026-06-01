import { useState } from "react";
import { FormField, FormSelect } from "@/components/admin/shared/FormFields";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AddUserFormData } from "@/lib/validators/user";

interface UserFormProps {
  onSubmit: (data: AddUserFormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<AddUserFormData>;
}

const USER_ROLES = [
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "delivery_agent", label: "Delivery Agent" },
];

const USER_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export function UserForm({
  onSubmit,
  loading = false,
  initialData,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    employeeId: initialData?.employeeId || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    role: initialData?.role || "staff",
    status: initialData?.status || "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      employeeId: `EMP-${timestamp}-${random}`,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!initialData && !formData.password)
      newErrors.password = "Password is required";
    if (
      !initialData &&
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        role: formData.role as any,
        status: formData.status as any,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-600">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>

        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          error={errors.fullName}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Employee ID
            <span className="ml-1 text-orange-600">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Auto-generated"
              className="flex-1 rounded-xl border border-orange-200/30 bg-white px-4 py-3 text-slate-900 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
            />
            <button
              type="button"
              onClick={generateEmployeeId}
              className="rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600 transition-all hover:bg-orange-200"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="10-digit phone number"
            error={errors.phoneNumber}
            helperText="10 digits only"
            required
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@company.com"
            error={errors.email}
            required
          />
        </div>
      </div>

      {/* Account Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Account Information
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={USER_ROLES}
            error={errors.role}
            required
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={USER_STATUS}
            error={errors.status}
            required
          />
        </div>

        {/* Role Permissions Info */}
        <div className="rounded-2xl border border-blue-200/30 bg-blue-50/30 p-4">
          <p className="text-sm font-medium text-slate-900 mb-3">
            Permissions for {formData.role === "manager" ? "Manager" : formData.role === "staff" ? "Staff" : "Delivery Agent"}:
          </p>
          <ul className="space-y-1 text-sm text-slate-700">
            {formData.role === "manager" && (
              <>
                <li>✓ View Dashboard</li>
                <li>✓ Manage Products</li>
                <li>✓ Manage Categories</li>
                <li>✓ View Orders</li>
                <li>✓ View Reports</li>
                <li>✓ Manage Users</li>
              </>
            )}
            {formData.role === "staff" && (
              <>
                <li>✓ Manage Products</li>
                <li>✓ Manage Categories</li>
                <li>✓ View Orders</li>
              </>
            )}
            {formData.role === "delivery_agent" && (
              <>
                <li>✓ View Assigned Orders</li>
                <li>✓ Update Delivery Status</li>
                <li>✓ Track Shipments</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Password Section */}
      {!initialData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Security
          </h3>

          <FormField
            label="Password"
            name="password"
            type={showPasswords ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            error={errors.password}
            helperText="Must contain: uppercase, number, special character (!@#$%^&*)"
            required
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type={showPasswords ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="rounded border-orange-300 text-orange-600"
            />
            <span className="text-sm text-slate-600">Show passwords</span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 inline animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  );
}
