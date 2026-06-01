import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
// Load backend environment variables from backend/.env only.
// This keeps frontend and backend envs isolated after reorganization.

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MYSQL_HOST = process.env.MYSQL_HOST || "127.0.0.1";
export const MYSQL_PORT = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;
export const MYSQL_USER = process.env.MYSQL_USER || "root";
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "admin_panel";
export const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
export const INITIAL_ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";
export const INITIAL_ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "Admin123!";
export const API_PREFIX = "/api";
