import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/", async (req, res) => {
  const reviews = await query(`
    SELECT r.id, r.rating, r.comment, r.status, r.created_at, u.name AS user_name, p.name AS product_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `);
  res.json({ reviews });
});

router.patch("/:id/approve", async (req, res) => {
  await query(`UPDATE reviews SET status = 'approved' WHERE id = ?`, [req.params.id]);
  res.json({ message: "Review approved." });
});

router.patch("/:id/reject", async (req, res) => {
  await query(`UPDATE reviews SET status = 'rejected' WHERE id = ?`, [req.params.id]);
  res.json({ message: "Review rejected." });
});

export { router as reviewsRouter };
