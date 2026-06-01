import express from "express";
import { query, findOne } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager"));

router.get("/", async (req, res) => {
  let settings = await findOne(`SELECT * FROM settings ORDER BY id DESC LIMIT 1`);
  if (!settings) {
    settings = { website_name: "", logo_url: "", seo_title: "", seo_description: "", contact_email: "", contact_phone: "", social_links: "{}" };
  }
  res.json({ settings });
});

router.put("/", async (req, res) => {
  const { website_name, logo_url, seo_title, seo_description, contact_email, contact_phone, social_links } = req.body;
  const existing = await findOne(`SELECT id FROM settings ORDER BY id DESC LIMIT 1`);
  if (existing) {
    await query(`UPDATE settings SET website_name = ?, logo_url = ?, seo_title = ?, seo_description = ?, contact_email = ?, contact_phone = ?, social_links = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?`, [website_name || "", logo_url || "", seo_title || "", seo_description || "", contact_email || "", contact_phone || "", JSON.stringify(social_links || {}), existing.id]);
  } else {
    await query(`INSERT INTO settings (website_name, logo_url, seo_title, seo_description, contact_email, contact_phone, social_links, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`, [website_name || "", logo_url || "", seo_title || "", seo_description || "", contact_email || "", contact_phone || "", JSON.stringify(social_links || {})]);
  }
  res.json({ message: "Settings saved." });
});

export { router as settingsRouter };
