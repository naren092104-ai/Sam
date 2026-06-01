import express from "express";
import { query, findOne } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/", async (req, res) => {
  const coupons = await query(`SELECT id, code, discount, expiry_date, status FROM coupons ORDER BY expiry_date DESC`);
  res.json({ coupons });
});

router.post("/", async (req, res) => {
  const { code, discount, expiry_date } = req.body;
  if (!code || !discount || !expiry_date) {
    return res.status(400).json({ error: "Coupon code, discount, and expiry date are required." });
  }
  const existing = await findOne(`SELECT id FROM coupons WHERE code = ?`, [code]);
  if (existing) return res.status(409).json({ error: "Coupon code already exists." });
  await query(`INSERT INTO coupons (code, discount, expiry_date, status, created_at) VALUES (?, ?, ?, 'active', UTC_TIMESTAMP())`, [code, discount, expiry_date]);
  res.status(201).json({ message: "Coupon created." });
});

router.put("/:id", async (req, res) => {
  const { code, discount, expiry_date, status } = req.body;
  await query(`UPDATE coupons SET code = ?, discount = ?, expiry_date = ?, status = ? WHERE id = ?`, [code, discount, expiry_date, status || "active", req.params.id]);
  res.json({ message: "Coupon updated." });
});

router.delete("/:id", async (req, res) => {
  await query(`DELETE FROM coupons WHERE id = ?`, [req.params.id]);
  res.json({ message: "Coupon deleted." });
});

export { router as couponsRouter };
