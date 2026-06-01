import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff", "Delivery Agent"));

router.get("/", async (req, res) => {
  const shipping = await query(
    `SELECT s.id, s.order_id, s.tracking_id, s.status, s.address, s.notes, s.updated_at FROM shipping s ORDER BY s.updated_at DESC`,
  );
  res.json({ shipping });
});

router.patch("/:id/status", async (req, res) => {
  const { status, notes } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required." });
  await query(`UPDATE shipping SET status = ?, notes = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?`, [status, notes || "", req.params.id]);
  res.json({ message: "Shipping status updated." });
});

export { router as shippingRouter };
