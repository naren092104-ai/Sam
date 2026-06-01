import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager"));

router.get("/sales", async (req, res) => {
  const rows = await query(`SELECT DATE(order_date) AS date, SUM(total_amount) AS revenue, COUNT(*) AS orders FROM orders GROUP BY DATE(order_date) ORDER BY DATE(order_date) DESC LIMIT 30`);
  res.json({ sales: rows });
});

router.get("/revenue", async (req, res) => {
  const rows = await query(`SELECT MONTH(order_date) AS month, SUM(total_amount) AS totalRevenue FROM orders GROUP BY MONTH(order_date) ORDER BY MONTH(order_date)`);
  res.json({ revenue: rows });
});

router.get("/orders", async (req, res) => {
  const rows = await query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status`);
  res.json({ orderSummary: rows });
});

router.get("/products", async (req, res) => {
  const rows = await query(`SELECT p.id, p.name, SUM(oi.quantity) AS sold_count FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id ORDER BY sold_count DESC LIMIT 20`);
  res.json({ productSummary: rows });
});

export { router as reportsRouter };
