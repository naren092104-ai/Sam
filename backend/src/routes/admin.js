import express from "express";
import { findOne, query } from "../db.js";
import { authenticate, requireRoles, comparePassword, signJwt, hashPassword } from "../middleware/auth.js";
import { usersRouter } from "./users.js";
import { productsRouter } from "./products.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await findOne(
    `SELECT u.id, u.name, u.email, u.password, u.role_id, r.name AS role_name, u.status, u.is_active FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? LIMIT 1`,
    [email],
  );

  if (!user || !comparePassword(password, user.password) || !user.is_active) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signJwt({ id: user.id, role: user.role_name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role_name } });
});

router.post("/setup-permanent", authenticate, async (req, res) => {
  const initialEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";
  
  if (req.user.email !== initialEmail) {
    return res.status(403).json({ error: "Only the initial demo admin user can perform this setup." });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  if (email.toLowerCase() === initialEmail.toLowerCase()) {
    return res.status(400).json({ error: "Permanent admin email cannot be the same as the initial demo email." });
  }

  const existing = await findOne(`SELECT id FROM users WHERE email = ?`, [email]);
  if (existing) {
    return res.status(409).json({ error: "Email already exists in the system." });
  }

  const role = await findOne(`SELECT id FROM roles WHERE name = 'Admin' LIMIT 1`);
  const roleId = role?.id ?? 1;
  const passwordHash = hashPassword(password);

  // Insert custom permanent admin
  await query(
    `INSERT INTO users (role_id, name, email, password, phone, status, is_active, created_at) VALUES (?, ?, ?, ?, ?, 'active', 1, UTC_TIMESTAMP())`,
    [roleId, name, email, passwordHash, ""],
  );

  // Immediately delete the initial demo admin
  await query(`DELETE FROM users WHERE email = ?`, [initialEmail]);

  res.json({ message: "Permanent admin created successfully. The demo admin account has been removed." });
});

router.use("/users", usersRouter);
router.use("/products", productsRouter);

router.get("/dashboard", authenticate, requireRoles("Admin", "Manager", "Staff"), async (req, res) => {
  const totals = await query(`
    SELECT
      (SELECT IFNULL(SUM(total_amount),0) FROM orders) AS totalRevenue,
      (SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS monthlyRevenue,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM users WHERE is_active = 1) AS totalUsers,
      (SELECT COUNT(*) FROM products WHERE status = 'published') AS totalProducts,
      (SELECT COUNT(*) FROM orders WHERE status = 'Order Placed') AS pendingOrders,
      (SELECT COUNT(*) FROM orders WHERE status = 'Delivered') AS completedOrders,
      (SELECT COUNT(*) FROM payments WHERE method = 'COD') AS codOrders,
      (SELECT COUNT(*) FROM payments WHERE method <> 'COD') AS onlinePayments
  `);

  const recentOrders = await query(
    `SELECT o.id, o.order_date, o.total_amount, o.status, u.name AS customer_name, p.method AS payment_method FROM orders o JOIN users u ON o.user_id = u.id LEFT JOIN payments p ON o.payment_id = p.id ORDER BY o.order_date DESC LIMIT 8`,
  );

  const topProducts = await query(
    `SELECT p.id, p.name, p.original_price AS price, p.offer_price AS offerPrice, p.status, COUNT(oi.product_id) AS sold_count FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY oi.product_id ORDER BY sold_count DESC LIMIT 6`,
  );

  // Revenue by day for last 14 days
  const revenueChart = await query(`
    SELECT DATE(order_date) AS date, IFNULL(SUM(total_amount),0) AS revenue, COUNT(*) AS orders
    FROM orders
    WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
    GROUP BY DATE(order_date)
    ORDER BY date ASC
  `);

  // Low stock products (stock < 10)
  const lowStock = await query(`
    SELECT id, name, stock AS stock_quantity, original_price AS price, offer_price AS offerPrice, status
    FROM products
    WHERE stock < 10 AND status = 'published'
    ORDER BY stock ASC
    LIMIT 8
  `);

  // Recent reviews
  const recentReviews = await query(`
    SELECT r.id, r.rating, r.comment, r.created_at, u.name AS customer_name, p.name AS product_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
    LIMIT 5
  `).catch(() => []);

  // Payment breakdown
  const paymentBreakdown = await query(`
    SELECT method, COUNT(*) AS count, IFNULL(SUM(amount),0) AS total
    FROM payments
    GROUP BY method
  `).catch(() => []);

  res.json({ totals: totals[0] || {}, recentOrders, topProducts, revenueChart, lowStock, recentReviews, paymentBreakdown });
});

export { router as adminRouter };
