import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { ensureInitialAdmin } from "./middleware/auth.js";
import { PORT, API_PREFIX } from "./config.js";
import { query } from "./db.js";
import { adminRouter } from "./routes/admin.js";
import { usersRouter } from "./routes/users.js";
import { rolesRouter } from "./routes/roles.js";
import { categoriesRouter, publicCategoriesRouter } from "./routes/categories.js";
import { productsRouter, adminProductsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { paymentsRouter } from "./routes/payments.js";
import { shippingRouter } from "./routes/shipping.js";
import { couponsRouter } from "./routes/coupons.js";
import { reviewsRouter } from "./routes/reviews.js";
import { reportsRouter } from "./routes/reports.js";
import { settingsRouter } from "./routes/settings.js";
import { notificationsRouter } from "./routes/notifications.js";
import { analyticsRouter } from "./routes/analytics.js";

async function ensureProductCodeColumn() {
  const existingColumns = await query(`SHOW COLUMNS FROM products LIKE 'code'`);
  if (existingColumns.length === 0) {
    await query(`ALTER TABLE products ADD COLUMN code VARCHAR(64) NULL AFTER name`);
    const products = await query(`SELECT id FROM products ORDER BY id`);
    await Promise.all(
      products.map((product, index) =>
        query(`UPDATE products SET code = ? WHERE id = ?`, [String(index + 1).padStart(3, "0"), product.id]),
      ),
    );
    await query(`ALTER TABLE products MODIFY COLUMN code VARCHAR(64) NOT NULL UNIQUE`);
  }
}

async function ensureProductWeightColumns() {
  const existingColumns = await query(`SHOW COLUMNS FROM products`);
  const fields = existingColumns.map((c) => c.Field);

  const addIfMissing = async (sql) => {
    await query(sql).catch(() => {});
  };

  if (!fields.includes("weight")) {
    await addIfMissing(`ALTER TABLE products ADD COLUMN weight DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER offer_price`);
  }
  if (!fields.includes("weight_unit")) {
    await addIfMissing(`ALTER TABLE products ADD COLUMN weight_unit ENUM('gram','kg','litre','ml') NOT NULL DEFAULT 'kg' AFTER weight`);
  }
}

async function ensureCategoryColumnsAndDefaults() {
  // Add new columns to categories table if they don't exist
  const existing = await query(`SHOW COLUMNS FROM categories`);
  const columns = existing.map((c) => c.Field);

  const addIfMissing = async (columnSql) => {
    await query(columnSql).catch(() => {});
  };

  if (!columns.includes("code")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN code VARCHAR(64) NULL AFTER name`);
  }
  if (!columns.includes("status")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN status ENUM('active','inactive','hidden') NOT NULL DEFAULT 'active' AFTER image`);
  }
  if (!columns.includes("show_on_homepage")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN show_on_homepage TINYINT(1) NOT NULL DEFAULT 0 AFTER status`);
  }
  if (!columns.includes("show_in_nav")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN show_in_nav TINYINT(1) NOT NULL DEFAULT 0 AFTER show_on_homepage`);
  }
  if (!columns.includes("show_in_filter")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN show_in_filter TINYINT(1) NOT NULL DEFAULT 1 AFTER show_in_nav`);
  }
  if (!columns.includes("sort_order")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER show_in_filter`);
  }
  if (!columns.includes("seo_title")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN seo_title VARCHAR(255) NULL AFTER sort_order`);
  }
  if (!columns.includes("seo_description")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN seo_description TEXT NULL AFTER seo_title`);
  }
  if (!columns.includes("seo_keywords")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN seo_keywords VARCHAR(512) NULL AFTER seo_description`);
  }
  if (!columns.includes("slug")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN slug VARCHAR(255) NULL AFTER seo_keywords`);
  }
  if (!columns.includes("banner")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN banner VARCHAR(511) NULL AFTER image`);
  }
  if (!columns.includes("icon")) {
    await addIfMissing(`ALTER TABLE categories ADD COLUMN icon VARCHAR(511) NULL AFTER banner`);
  }

  // Ensure default categories exist
  const defaults = [
    "Mango Pickles",
    "Lemon Pickles",
    "Garlic Pickles",
    "Mixed Pickles",
    "Chicken Pickles",
    "Fish Pickles",
    "Prawn Pickles",
    "Vegetable Pickles",
    "Special Pickles",
    "Seasonal Pickles",
  ];

  for (const name of defaults) {
    const exists = await query(`SELECT id FROM categories WHERE name = ? LIMIT 1`, [name]);
    if (!exists || exists.length === 0) {
      await query(`INSERT INTO categories (name, description, status, created_at) VALUES (?, ?, 'active', UTC_TIMESTAMP())`, [name, `${name} description`]);
    }
  }
}

async function ensureOrderSchema() {
  const existingOrders = await query(`SHOW COLUMNS FROM orders`);
  const orderFields = existingOrders.map((c) => c.Field);
  const addIfMissing = async (sql) => await query(sql).catch(() => {});

  if (!orderFields.includes("address_id")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN address_id INT NULL AFTER user_id`);
  }
  if (!orderFields.includes("delivery_agent_id")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN delivery_agent_id INT NULL AFTER address_id`);
  }
  if (!orderFields.includes("subtotal")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER delivery_agent_id`);
  }
  if (!orderFields.includes("delivery_charge")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER subtotal`);
  }
  if (!orderFields.includes("discount")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER delivery_charge`);
  }
  if (!orderFields.includes("tax")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN tax DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER discount`);
  }
  if (!orderFields.includes("total_amount")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER tax`);
  }
  const statusEnum = `ENUM('Pending','Confirmed','Processing','Packed','Shipped','Out For Delivery','Delivered','Cancelled')`;
  if (!orderFields.includes("status")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN status ${statusEnum} NOT NULL DEFAULT 'Pending' AFTER total_amount`);
  } else {
    await addIfMissing(`ALTER TABLE orders MODIFY COLUMN status ${statusEnum} NOT NULL DEFAULT 'Pending'`);
  }
  if (!orderFields.includes("tracking_id")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN tracking_id VARCHAR(255) NULL AFTER status`);
  }
  if (!orderFields.includes("order_date")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER id`);
  }
  if (!orderFields.includes("created_at")) {
    await addIfMissing(`ALTER TABLE orders ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER order_date`);
  }

  const existingOrderItems = await query(`SHOW COLUMNS FROM order_items`);
  const itemFields = existingOrderItems.map((c) => c.Field);
  if (!itemFields.includes("product_code")) {
    await addIfMissing(`ALTER TABLE order_items ADD COLUMN product_code VARCHAR(64) NULL AFTER product_id`);
  }
  if (!itemFields.includes("category_name")) {
    await addIfMissing(`ALTER TABLE order_items ADD COLUMN category_name VARCHAR(128) NULL AFTER product_code`);
  }
  if (!itemFields.includes("weight")) {
    await addIfMissing(`ALTER TABLE order_items ADD COLUMN weight DECIMAL(10,2) NULL AFTER quantity`);
  }
  if (!itemFields.includes("product_name")) {
    await addIfMissing(`ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255) NULL AFTER product_id`);
  }

  const existingShipping = await query(`SHOW COLUMNS FROM shipping`);
  const shippingFields = existingShipping.map((c) => c.Field);
  if (!shippingFields.includes("courier_partner")) {
    await addIfMissing(`ALTER TABLE shipping ADD COLUMN courier_partner VARCHAR(128) NULL AFTER tracking_id`);
  }
  if (!shippingFields.includes("expected_delivery_date")) {
    await addIfMissing(`ALTER TABLE shipping ADD COLUMN expected_delivery_date DATETIME NULL AFTER courier_partner`);
  }
  if (!shippingFields.includes("status")) {
    await addIfMissing(`ALTER TABLE shipping ADD COLUMN status ENUM('pending','in_transit','delivered','delayed','cancelled') NOT NULL DEFAULT 'pending' AFTER notes`);
  }

  await query(`CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255) NULL,
    area VARCHAR(128) NULL,
    city VARCHAR(128) NOT NULL,
    district VARCHAR(128) NULL,
    state VARCHAR(128) NOT NULL,
    pincode VARCHAR(32) NOT NULL,
    country VARCHAR(128) NOT NULL DEFAULT 'India',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB;`);

  await query(`CREATE TABLE IF NOT EXISTS delivery_agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NULL,
    email VARCHAR(256) NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`);

  await query(`CREATE TABLE IF NOT EXISTS order_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ${statusEnum} NOT NULL,
    note TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Wrap async route handlers so promise rejections propagate to Express error middleware.
const originalRouterRoute = express.Router.route;
express.Router.route = function (path) {
  const route = originalRouterRoute.call(this, path);
  const methods = ["all", "get", "post", "put", "patch", "delete"];
  methods.forEach((method) => {
    const originalMethod = route[method];
    route[method] = function (...handlers) {
      const wrapped = handlers.map((handler) => {
        if (typeof handler !== "function" || handler.length === 4) {
          return handler;
        }
        return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
      });
      return originalMethod.call(this, ...wrapped);
    };
  });
  return route;
};

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/admin/users`, usersRouter);
app.use(`${API_PREFIX}/roles`, rolesRouter);
app.use(`${API_PREFIX}/categories`, publicCategoriesRouter);
app.use(`${API_PREFIX}/admin/categories`, categoriesRouter);
app.use(`${API_PREFIX}/products`, productsRouter);
app.use(`${API_PREFIX}/admin/products`, adminProductsRouter);
app.use(`${API_PREFIX}/orders`, ordersRouter);
app.use(`${API_PREFIX}/admin/orders`, ordersRouter);
app.use(`${API_PREFIX}/payments`, paymentsRouter);
app.use(`${API_PREFIX}/admin/payments`, paymentsRouter);
app.use(`${API_PREFIX}/shipping`, shippingRouter);
app.use(`${API_PREFIX}/admin/shipping`, shippingRouter);
app.use(`${API_PREFIX}/coupons`, couponsRouter);
app.use(`${API_PREFIX}/admin/coupons`, couponsRouter);
app.use(`${API_PREFIX}/reviews`, reviewsRouter);
app.use(`${API_PREFIX}/admin/reviews`, reviewsRouter);
app.use(`${API_PREFIX}/reports`, reportsRouter);
app.use(`${API_PREFIX}/admin/reports`, reportsRouter);
app.use(`${API_PREFIX}/settings`, settingsRouter);
app.use(`${API_PREFIX}/admin/settings`, settingsRouter);
app.use(`${API_PREFIX}/notifications`, notificationsRouter);
app.use(`${API_PREFIX}/admin/notifications`, notificationsRouter);
app.use(`${API_PREFIX}/analytics`, analyticsRouter);
app.use(`${API_PREFIX}/admin/analytics`, analyticsRouter);

app.get("/", (req, res) => res.json({ status: "ok", message: "Admin API running" }));

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  const payload = { error: "Server error" };
  if (process.env.NODE_ENV !== "production") {
    payload.message = err && err.message ? err.message : String(err);
    payload.stack = err && err.stack ? err.stack : undefined;
  }
  res.status(500).json(payload);
});

Promise.all([ensureInitialAdmin(), ensureProductCodeColumn(), ensureProductWeightColumns(), ensureCategoryColumnsAndDefaults(), ensureOrderSchema()])
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Admin API listening on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Set PORT to a free port or stop the process using it.`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize admin user", error);
    process.exit(1);
  });
