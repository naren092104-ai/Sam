import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/", async (req, res) => {
  const notifications = await query(`SELECT id, title, message, is_read, created_at FROM notifications ORDER BY created_at DESC`);
  res.json({ notifications });
});

export { router as notificationsRouter };
