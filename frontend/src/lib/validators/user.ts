import { z } from "zod";

export const UserRoleSchema = z.enum(["manager", "staff", "delivery_agent"]);

export const AddUserSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  employeeId: z.string().optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain uppercase letter").regex(/[0-9]/, "Password must contain number").regex(/[!@#$%^&*]/, "Password must contain special character"),
  confirmPassword: z.string(),
  role: UserRoleSchema,
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type AddUserFormData = z.infer<typeof AddUserSchema>;

export const UserFilterSchema = z.object({
  search: z.string().optional(),
  searchType: z.enum(["name", "email", "employee_id"]).optional(),
  role: UserRoleSchema.optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  sortBy: z.enum(["name", "created", "email"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type UserFilter = z.infer<typeof UserFilterSchema>;

export const USER_ROLES = {
  manager: {
    label: "Manager",
    permissions: ["dashboard", "products", "categories", "orders", "reports", "users"],
    color: "bg-blue-500/10 text-blue-600",
  },
  staff: {
    label: "Staff",
    permissions: ["products", "categories", "orders"],
    color: "bg-purple-500/10 text-purple-600",
  },
  delivery_agent: {
    label: "Delivery Agent",
    permissions: ["assigned_orders", "shipping", "delivery"],
    color: "bg-green-500/10 text-green-600",
  },
};
