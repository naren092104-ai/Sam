import mysql from "mysql2/promise";
import { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from "./config.js";

export const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
});

export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db.query] SQL Error', { sql: sql.replace(/\s+/g, ' '), params, err: err && err.message ? err.message : err });
    throw err;
  }
}

export async function findOne(sql, params = []) {
  const rows = await query(sql, params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}
