import { createFileRoute } from "@tanstack/react-router";
import { CategoryManagement } from "@/components/admin/categories/CategoryManagement";

export const Route = createFileRoute("/admin/categories")({
  component: CategoryManagement,
});
