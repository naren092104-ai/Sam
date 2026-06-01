import express from "express";
import { findOne, query } from "../db.js";
import { authenticate, requireRoles, hashPassword } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/", async (req, res) => {
  const { search = "", searchType = "", role = "", status = "", sortBy = "created_at", sortOrder = "desc", page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const whereClauses = [];
  const params = [];

  if (search) {
    if (searchType === "email") {
      whereClauses.push(`u.email LIKE ?`);
      params.push(`%${search}%`);
    } else if (searchType === "name") {
      whereClauses.push(`u.name LIKE ?`);
      params.push(`%${search}%`);
    } else {
      whereClauses.push(`(u.name LIKE ? OR u.email LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
  }

  if (role) {
    whereClauses.push(`r.name = ?`);
    params.push(role);
  }

  if (status) {
    whereClauses.push(`u.status = ?`);
    params.push(status);
  }

  const allowedSortFields = ["created_at", "name", "email", "status", "role"];
  const sortField = allowedSortFields.includes(String(sortBy)) ? String(sortBy) : "created_at";
  const sortDirection = String(sortOrder).toLowerCase() === "asc" ? "ASC" : "DESC";
  
  let sortFieldSql = "u.created_at";
  if (sortField === "name") sortFieldSql = "u.name";
  if (sortField === "email") sortFieldSql = "u.email";
  if (sortField === "status") sortFieldSql = "u.status";
  if (sortField === "role") sortFieldSql = "r.name";

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const users = await query(
    `SELECT u.id, u.name, u.email, u.phone, r.name AS role, u.status, u.is_active FROM users u JOIN roles r ON u.role_id = r.id ${whereSql} ORDER BY ${sortFieldSql} ${sortDirection} LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset],
  );
  const countRow = await query(`SELECT COUNT(*) AS total FROM users u JOIN roles r ON u.role_id = r.id ${whereSql}`, params);
  res.json({ users, total: countRow[0]?.total ?? 0, page: Number(page), limit: Number(limit) });
});

router.get("/stats", async (req, res) => {
  const statsRows = await query(
    `SELECT r.name AS role_name, COUNT(*) AS count FROM users u JOIN roles r ON u.role_id = r.id GROUP BY r.name`,
  );
  const activeUsersRow = await query(`SELECT COUNT(*) AS count FROM users WHERE is_active = 1`);

  const stats = {
    totalManagers: 0,
    totalStaff: 0,
    totalDeliveryAgents: 0,
    activeUsers: activeUsersRow[0]?.count ?? 0,
  };

  statsRows.forEach((row) => {
    if (row.role_name === "Manager") stats.totalManagers = row.count;
    if (row.role_name === "Staff") stats.totalStaff = row.count;
    if (row.role_name === "Delivery Agent" || row.role_name === "DeliveryAgent") {
      stats.totalDeliveryAgents = row.count;
    }
  });

  res.json(stats);
});

router.post("/", async (req, res) => {
  const { fullName, name, email, password, phoneNumber, role_id, role, status = "active" } = req.body;
  const normalizedName = fullName || name;
  if (!normalizedName || !email || !password) {
    return res.status(400).json({ error: "Missing required user fields." });
  }

  const existing = await findOne(`SELECT id FROM users WHERE email = ?`, [email]);
  if (existing) {
    return res.status(409).json({ error: "Email already exists." });
  }

  let resolvedRoleId = Number(role_id) || null;
  if (!resolvedRoleId && role) {
    const roleRow = await findOne(`SELECT id FROM roles WHERE name = ? LIMIT 1`, [role]);
    resolvedRoleId = roleRow?.id ?? null;
  }
  if (!resolvedRoleId) {
    const defaultRole = await findOne(`SELECT id FROM roles WHERE name = 'Staff' LIMIT 1`);
    resolvedRoleId = defaultRole?.id || 2;
  }

  const hash = hashPassword(password);
  await query(
    `INSERT INTO users (role_id, name, email, password, phone, status, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, UTC_TIMESTAMP())`,
    [resolvedRoleId, normalizedName, email, hash, phoneNumber || "", status],
  );
  res.status(201).json({ message: "User created." });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, name, email, phoneNumber, role_id, role, status, password } = req.body;
  const existing = await findOne(`SELECT * FROM users WHERE id = ?`, [id]);
  if (!existing) {
    return res.status(404).json({ error: "User not found." });
  }
  const fields = [];
  const values = [];
  if (fullName || name) { fields.push(`name = ?`); values.push(fullName || name); }
  if (email) { fields.push(`email = ?`); values.push(email); }
  if (phoneNumber !== undefined) { fields.push(`phone = ?`); values.push(phoneNumber); }
  if (role_id) { fields.push(`role_id = ?`); values.push(role_id); }
  if (role && !role_id) {
    const roleRow = await findOne(`SELECT id FROM roles WHERE name = ? LIMIT 1`, [role]);
    if (roleRow) {
      fields.push(`role_id = ?`);
      values.push(roleRow.id);
    }
  }
  if (status) { fields.push(`status = ?`); values.push(status); }
  if (password) { fields.push(`password = ?`); values.push(hashPassword(password)); }
  if (!fields.length) {
    return res.status(400).json({ error: "No update fields provided." });
  }
  values.push(id);
  await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  res.json({ message: "User updated." });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, name, email, phoneNumber, role_id, role, status, password } = req.body;
  const existing = await findOne(`SELECT * FROM users WHERE id = ?`, [id]);
  if (!existing) {
    return res.status(404).json({ error: "User not found." });
  }
  const fields = [];
  const values = [];
  if (fullName || name) { fields.push(`name = ?`); values.push(fullName || name); }
  if (email) { fields.push(`email = ?`); values.push(email); }
  if (phoneNumber !== undefined) { fields.push(`phone = ?`); values.push(phoneNumber); }
  if (role_id) { fields.push(`role_id = ?`); values.push(role_id); }
  if (role && !role_id) {
    const roleRow = await findOne(`SELECT id FROM roles WHERE name = ? LIMIT 1`, [role]);
    if (roleRow) {
      fields.push(`role_id = ?`);
      values.push(roleRow.id);
    }
  }
  if (status) { fields.push(`status = ?`); values.push(status); }
  if (password) { fields.push(`password = ?`); values.push(hashPassword(password)); }
  if (!fields.length) {
    return res.status(400).json({ error: "No update fields provided." });
  }
  values.push(id);
  await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  res.json({ message: "User updated." });
});

router.delete("/:id", async (req, res) => {
  await query(`DELETE FROM users WHERE id = ?`, [req.params.id]);
  res.json({ message: "User deleted." });
});

router.patch("/:id/activate", async (req, res) => {
  await query(`UPDATE users SET is_active = 1 WHERE id = ?`, [req.params.id]);
  res.json({ message: "User activated." });
});

router.patch("/:id/deactivate", async (req, res) => {
  await query(`UPDATE users SET is_active = 0 WHERE id = ?`, [req.params.id]);
  res.json({ message: "User deactivated." });
});

export { router as usersRouter };
