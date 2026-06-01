import { z } from "zod";

export const ProductImageSchema = z.object({
  file: z.instanceof(File),
  preview: z.string(),
  isThumbnail: z.boolean().default(false),
});

export const AddProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(100, "Product name must be less than 100 characters"),
  code: z.string().max(50, "Product code must be less than 50 characters").optional().or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  weight: z.number().min(0.01, "Weight must be greater than 0"),
  weightUnit: z.enum(["gram", "kg", "litre", "ml"]),
  status: z.enum(["active", "inactive", "out_of_stock", "draft"]).default("draft"),
  offerAvailable: z.boolean().default(false),
  offerPrice: z.number().min(0.01, "Offer price must be greater than 0").optional(),
  offerStartDate: z.date().optional(),
  offerEndDate: z.date().optional(),
  images: z.array(ProductImageSchema).min(1, "At least one image is required"),
});

export type AddProductFormData = z.infer<typeof AddProductSchema>;

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["active", "inactive", "out_of_stock", "draft"]).optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).optional(),
  sortBy: z.enum(["name", "price", "stock", "created"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
