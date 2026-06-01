import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager"));

router.get("/", async (req, res) => {
  const roles = await query(`SELECT id, name, description FROM roles ORDER BY name`);
  res.json({ roles });
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  await query(`INSERT INTO roles (name, description, created_at) VALUES (?, ?, UTC_TIMESTAMP())`, [name, description || ""]);
  res.status(201).json({ message: "Role created." });
});

router.put("/:id", async (req, res) => {
  const { name, description } = req.body;
  await query(`UPDATE roles SET name = ?, description = ? WHERE id = ?`, [name, description || "", req.params.id]);
  res.json({ message: "Role updated." });
});

router.delete("/:id", async (req, res) => {
  await query(`DELETE FROM roles WHERE id = ?`, [req.params.id]);
  res.json({ message: "Role deleted." });
});

export { router as rolesRouter };
