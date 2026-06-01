# Quick Start: Admin Pages Integration Guide

## 🚀 Getting Started

### Installation

All components are already created and ready to use. No additional npm packages needed beyond what's already in your project.

### File Locations

**Pages:**
- `/frontend/src/routes/admin/products.tsx` - Product Management Page
- `/frontend/src/routes/admin/users.tsx` - User Management Page

**Components:**
- `/frontend/src/components/admin/shared/` - Shared UI components
- `/frontend/src/components/admin/products/` - Product-specific components
- `/frontend/src/components/admin/users/` - User-specific components

**Hooks:**
- `/frontend/src/hooks/admin/useProductApi.ts` - Product API calls
- `/frontend/src/hooks/admin/useUserApi.ts` - User API calls

**Validators:**
- `/frontend/src/lib/validators/product.ts` - Product validation schemas
- `/frontend/src/lib/validators/user.ts` - User validation schemas

---

## 📝 Available Components

### StatCard
Displays dashboard statistics with icon and value.

```tsx
<StatCard
  icon={<Package size={24} className="text-orange-600" />}
  label="Total Products"
  value={stats.totalProducts}
  color="orange" // "orange" | "blue" | "purple" | "green"
/>
```

### Modal
Reusable modal dialog with backdrop and animations.

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  subtitle="Optional subtitle"
  size="lg" // "sm" | "md" | "lg" | "xl"
>
  {/* Modal content */}
</Modal>
```

### FormFields
Input components with built-in validation display.

```tsx
<FormField
  label="Field Label"
  name="fieldName"
  value={value}
  onChange={handleChange}
  placeholder="Placeholder text"
  error={errors.fieldName}
  required={true}
  helperText="Helper text"
/>

<FormSelect
  label="Select Label"
  name="selectName"
  value={value}
  onChange={handleChange}
  options={[
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" }
  ]}
  error={errors.selectName}
  required={true}
  placeholder="Select option..."
/>

<FormTextarea
  label="Textarea Label"
  name="textareaName"
  value={value}
  onChange={handleChange}
  placeholder="Enter text..."
  error={errors.textareaName}
  required={true}
  rows={4}
/>
```

### ImageUpload
Drag-and-drop image upload with preview.

```tsx
<ImageUpload
  images={images}
  onImagesChange={setImages}
  error={errors.images}
  maxFiles={5}
  maxSizePerFile={5 * 1024 * 1024} // 5MB
/>
```

### ProductForm
Complete product creation/edit form.

```tsx
<ProductForm
  onSubmit={async (data) => {
    // Handle form submission
  }}
  loading={isLoading}
  initialData={productToEdit} // Optional for edit mode
  categories={[
    { value: "organic", label: "Organic" },
    // ...
  ]}
/>
```

### ProductTable
Product listing with search, filters, sort, pagination.

```tsx
<ProductTable
  products={products}
  total={total}
  page={page}
  limit={10}
  loading={loading}
  onFilterChange={(filters) => {
    // Handle filter changes
  }}
  onEdit={(product) => {
    // Handle edit
  }}
  onDelete={(id) => {
    // Handle delete
  }}
  onView={(product) => {
    // Handle view
  }}
  categories={CATEGORIES}
  deleting={deletingId}
/>
```

### UserForm
Complete user creation/edit form.

```tsx
<UserForm
  onSubmit={async (data) => {
    // Handle form submission
  }}
  loading={isLoading}
  initialData={userToEdit} // Optional for edit mode
/>
```

### UserTable
User listing with search, filters, sort, pagination.

```tsx
<UserTable
  users={users}
  total={total}
  page={page}
  limit={10}
  loading={loading}
  onFilterChange={(filters) => {
    // Handle filter changes
  }}
  onEdit={(user) => {
    // Handle edit
  }}
  onDelete={(id) => {
    // Handle delete
  }}
  onView={(user) => {
    // Handle view
  }}
  deleting={deletingId}
/>
```

---

## 🔌 API Hooks

### useProductApi

```tsx
const {
  getProducts,      // (filters) => Promise<ProductsResponse | null>
  createProduct,    // (data) => Promise<Product | null>
  updateProduct,    // (id, data) => Promise<Product | null>
  deleteProduct,    // (id) => Promise<boolean>
  loading,          // boolean
  error             // string | null
} = useProductApi();

// Usage
const products = await getProducts({
  search: "search term",
  category: "organic",
  status: "active",
  page: 1,
  limit: 10
});
```

### useUserApi

```tsx
const {
  getUsers,         // (filters) => Promise<UsersResponse | null>
  getUserStats,     // () => Promise<UserStats | null>
  createUser,       // (data) => Promise<User | null>
  updateUser,       // (id, data) => Promise<User | null>
  deleteUser,       // (id) => Promise<boolean>
  updateUserStatus, // (id, status) => Promise<User | null>
  loading,          // boolean
  error             // string | null
} = useUserApi();

// Usage
const stats = await getUserStats();
const users = await getUsers({
  search: "john",
  role: "manager",
  status: "active",
  page: 1,
  limit: 10
});
```

---

## 🔄 Data Types

### Product

```typescript
interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  price: number;
  offerPrice?: number;
  stock: number;
  weight: number;
  weightUnit: "gram" | "kg" | "litre" | "ml";
  status: "active" | "inactive" | "out_of_stock" | "draft";
  offerAvailable: boolean;
  offerStartDate?: Date;
  offerEndDate?: Date;
  images: Array<{ file: File; preview: string; isThumbnail: boolean }>;
  image?: string; // URL to first/thumbnail image
  createdAt: string;
  updatedAt: string;
}
```

### User

```typescript
interface User {
  id: string;
  fullName: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  password?: string; // Only in forms
  role: "manager" | "staff" | "delivery_agent";
  status: "active" | "inactive" | "suspended";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}
```

### ProductFilter

```typescript
interface ProductFilter {
  search?: string;
  category?: string;
  status?: "active" | "inactive" | "out_of_stock" | "draft";
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  sortBy?: "name" | "price" | "stock" | "created";
  sortOrder?: "asc" | "desc";
  page: number; // default 1
  limit: number; // default 10
}
```

### UserFilter

```typescript
interface UserFilter {
  search?: string;
  searchType?: "name" | "email" | "employee_id";
  role?: "manager" | "staff" | "delivery_agent";
  status?: "active" | "inactive" | "suspended";
  sortBy?: "name" | "created" | "email";
  sortOrder?: "asc" | "desc";
  page: number; // default 1
  limit: number; // default 10
}
```

---

## 🎯 Common Use Cases

### Create Product
```tsx
const { createProduct } = useProductApi();

const handleCreate = async (formData) => {
  const result = await createProduct(formData);
  if (result) {
    // Success
    showNotification("Product created!");
    // Refresh product list
  }
};
```

### Edit Product
```tsx
const [editingProduct, setEditingProduct] = useState(null);
const { updateProduct } = useProductApi();

const handleEdit = async (formData) => {
  const result = await updateProduct(editingProduct.id, formData);
  if (result) {
    showNotification("Product updated!");
    setEditingProduct(null);
  }
};
```

### Delete Product
```tsx
const { deleteProduct } = useProductApi();

const handleDelete = async (productId) => {
  if (confirm("Are you sure?")) {
    const success = await deleteProduct(productId);
    if (success) {
      showNotification("Product deleted!");
    }
  }
};
```

### Create User
```tsx
const { createUser } = useUserApi();

const handleCreate = async (formData) => {
  const result = await createUser(formData);
  if (result) {
    showNotification("User created!");
    showCredentials(result.employeeId); // Show generated credentials
  }
};
```

### Search Products
```tsx
const { getProducts } = useProductApi();

const handleSearch = async (searchTerm) => {
  const result = await getProducts({
    search: searchTerm,
    page: 1,
    limit: 10
  });
  if (result) {
    setProducts(result.products);
  }
};
```

---

## ⚙️ Configuration

### Change Default Pagination
Edit in component files (ProductTable.tsx, UserTable.tsx):
```tsx
const [filters, setFilters] = useState<ProductFilter>({
  page: 1,
  limit: 25, // Change default from 10
});
```

### Change Colors
Edit color maps in component files:
```tsx
const colorMap = {
  orange: "your-custom-orange-classes",
  blue: "your-custom-blue-classes",
};
```

### Change Image Upload Limits
Edit in ProductForm.tsx:
```tsx
<ImageUpload
  maxFiles={10} // Change from 5
  maxSizePerFile={10 * 1024 * 1024} // Change from 5MB
/>
```

### Disable Form Fields
```tsx
<FormField
  disabled={true}
  // ... other props
/>
```

---

## 🔐 Validation Examples

### Custom Validation
```tsx
// In validator files
export const CustomSchema = z.object({
  field: z.string()
    .min(5, "Min 5 characters")
    .max(100, "Max 100 characters")
    .regex(/^[a-zA-Z]+$/, "Only letters allowed")
});
```

### Form Error Display
```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

<FormField
  error={errors.fieldName}
  // This will automatically show error below input
/>
```

---

## 🌐 Network Requests

### API Base URL
The hooks use relative URLs (`/api/admin/...`). Update in hooks if your API is on different domain:

```tsx
// In useProductApi.ts
const baseUrl = process.env.REACT_APP_API_URL || "/api/admin";
const response = await fetch(`${baseUrl}/products`, {
  // ...
});
```

### Authentication
Authorization header is automatically added:
```tsx
const token = useAppSelector((state) => state.admin.token);
// Added in all requests:
headers: { Authorization: `Bearer ${token}` }
```

### Error Handling
All hooks set error state on failure:
```tsx
const { error } = useProductApi();

if (error) {
  <div className="alert alert-error">{error}</div>
}
```

---

## 📱 Responsive Breakpoints

Components are responsive by default using Tailwind CSS:
- `sm:` (640px) - Tablets
- `md:` (768px) - Small desktops
- `lg:` (1024px) - Large desktops
- `xl:` (1280px) - Extra large screens

---

## 🐛 Debugging

### Enable Debug Logs
```tsx
useEffect(() => {
  console.log("Products:", products);
  console.log("Filters:", filters);
  console.log("Loading:", loading);
  console.log("Error:", error);
}, [products, filters, loading, error]);
```

### Check Form Validation
```tsx
import { ProductFormSchema } from "@/lib/validators/product";

const result = ProductFormSchema.safeParse(formData);
if (!result.success) {
  console.log("Validation errors:", result.error.flatten());
}
```

---

## ✨ Best Practices

1. **Always show loading states** while fetching data
2. **Display success/error notifications** after operations
3. **Ask for confirmation** before deleting records
4. **Validate on both client and server**
5. **Handle network errors gracefully**
6. **Use proper TypeScript types** throughout
7. **Keep form data in state** for real-time validation
8. **Disable buttons while loading** to prevent double submissions
9. **Show empty states** when no data exists
10. **Test responsive design** on multiple devices

---

## 📞 Support

For issues or questions about these components:

1. Check the `ADMIN_PAGES_IMPLEMENTATION.md` for detailed documentation
2. Review component TypeScript types for available props
3. Inspect network requests in browser DevTools
4. Check console for validation errors

---

**Last Updated**: May 31, 2026  
**Version**: 1.0
