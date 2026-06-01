import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/", async (req, res) => {
  const payments = await query(
    `SELECT p.id, p.method, p.status, p.amount, p.transaction_id, p.refund_status, p.created_at, o.id AS order_id FROM payments p LEFT JOIN orders o ON p.order_id = o.id ORDER BY p.created_at DESC`,
  );
  res.json({ payments });
});

export { router as paymentsRouter };
