import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config.js";
import { findOne, query } from "../db.js";

export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyJwt(token);
  if (!decoded || typeof decoded !== "object") {
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = await findOne(
    `SELECT u.id, u.name, u.email, u.role_id, r.name AS role_name, u.status, u.is_active FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.is_active = 1`,
    [decoded.id],
  );

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role_name)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export async function ensureInitialAdmin() {
  const initialEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";

  // Check if any other admin user exists in the database
  const otherAdmin = await findOne(
    `SELECT u.id FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email != ? AND r.name = 'Admin' LIMIT 1`,
    [initialEmail],
  );

  if (otherAdmin) {
    // If a permanent admin exists, ensure the initial demo admin is completely deleted from the database
    await query(
      `DELETE u FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND r.name = 'Admin'`,
      [initialEmail]
    );
    return;
  }

  const adminUser = await findOne(
    `SELECT u.id FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND r.name = 'Admin'`,
    [initialEmail],
  );

  if (adminUser) {
    return;
  }

  const role = await findOne(`SELECT id FROM roles WHERE name = 'Admin' LIMIT 1`);
  const roleId = role?.id ?? 1;
  const passwordHash = hashPassword(process.env.INITIAL_ADMIN_PASSWORD || "Admin123!");
  await query(
    `INSERT INTO users (role_id, name, email, password, phone, status, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
    [roleId, "Administrator", initialEmail, passwordHash, "", "active", 1],
  );
}
