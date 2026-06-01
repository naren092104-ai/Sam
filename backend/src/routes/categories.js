import express from "express";
import { query, findOne } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const adminRouter = express.Router();
adminRouter.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

adminRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];
  if (req.query.search) {
    where.push(`(name LIKE ? OR description LIKE ?)`);
    params.push(`%${req.query.search}%`, `%${req.query.search}%`);
  }
  if (req.query.status) {
    where.push(`status = ?`);
    params.push(req.query.status);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const categoriesSql = `SELECT id, name, description, status, created_at, (SELECT COUNT(*) FROM products p2 WHERE p2.category_id = categories.id) AS productsCount FROM categories ${whereSql} ORDER BY name ASC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
  const categories = await query(categoriesSql, params);
  const totalRes = await query(`SELECT COUNT(*) AS total FROM categories ${whereSql}`, params);
  const total = totalRes[0]?.total ?? categories.length;
  res.json({ categories, total, page, limit });
});

adminRouter.get("/:id", async (req, res) => {
  const category = await findOne(`SELECT id, name, description, status, created_at FROM categories WHERE id = ? LIMIT 1`, [req.params.id]);
  if (!category) {
    return res.status(404).json({ error: "Category not found." });
  }
  res.json({ category });
});

adminRouter.post("/", async (req, res) => {
  const { name, description, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required." });
  }

  const result = await query(
    `INSERT INTO categories (name, description, status, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())`,
    [name, description || "", status || "active"],
  );
  const id = result.insertId;
  const created = await findOne(`SELECT id, name, description, status, created_at FROM categories WHERE id = ? LIMIT 1`, [id]);
  res.status(201).json({ category: created });
});

adminRouter.put("/:id", async (req, res) => {
  const { name, description, status } = req.body;
  const existing = await findOne(`SELECT id FROM categories WHERE id = ?`, [req.params.id]);
  if (!existing) {
    return res.status(404).json({ error: "Category not found." });
  }
  if (!name) {
    return res.status(400).json({ error: "Category name is required." });
  }

  await query(
    `UPDATE categories SET name = ?, description = ?, status = ? WHERE id = ?`,
    [name, description || "", status || "active", req.params.id],
  );
  const updated = await findOne(`SELECT id, name, description, status, created_at FROM categories WHERE id = ? LIMIT 1`, [req.params.id]);
  res.json({ category: updated });
});

adminRouter.delete("/:id", async (req, res) => {
  const assignedProducts = await findOne(`SELECT COUNT(*) AS count FROM products WHERE category_id = ?`, [req.params.id]);
  if (assignedProducts?.count > 0) {
    return res.status(400).json({ error: "Cannot delete category because products are assigned." });
  }

  await query(`DELETE FROM categories WHERE id = ?`, [req.params.id]);
  res.json({ message: "Category deleted." });
});

const publicRouter = express.Router();
publicRouter.get("/", async (req, res) => {
  const categories = await query(
    `SELECT id, name, description, status, created_at, (SELECT COUNT(*) FROM products p2 WHERE p2.category_id = categories.id) AS productsCount FROM categories WHERE status = 'active' ORDER BY name ASC`,
  );
  res.json({ categories });
});

export { adminRouter as categoriesRouter, publicRouter as publicCategoriesRouter };
