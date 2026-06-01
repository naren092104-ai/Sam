import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { query, findOne } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "..", "uploads", "products");
fs.mkdirSync(uploadsDir, { recursive: true });

const publicRouter = express.Router();
const adminRouter = express.Router();
adminRouter.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

async function getNextProductCode() {
  const rows = await query(
    `SELECT code FROM products WHERE code REGEXP '^SAM-[0-9]{4}$' ORDER BY CAST(SUBSTRING(code, 5) AS UNSIGNED) DESC LIMIT 1`
  );

  const latestCode = rows[0]?.code ?? null;
  if (!latestCode) {
    return "SAM-0001";
  }

  const currentNumber = Number(latestCode.slice(4));
  const nextNumber = Number.isFinite(currentNumber) ? currentNumber + 1 : 1;
  return `SAM-${String(nextNumber).padStart(4, "0")}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});
const upload = multer({ storage });

async function listProducts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const whereClauses = [];
  const params = [];
  if (req.query.search) {
    whereClauses.push(`(p.name LIKE ? OR p.description LIKE ?)`);
    params.push(`%${req.query.search}%`, `%${req.query.search}%`);
  }
  if (req.query.category) {
    whereClauses.push(`c.id = ?`);
    params.push(req.query.category);
  }
  if (req.query.status) {
    // Accept frontend-friendly statuses and map to DB values
    const statusMap = { active: 'published', inactive: 'draft', draft: 'draft', out_of_stock: 'out_of_stock' };
    const dbStatus = statusMap[req.query.status] || req.query.status;
    whereClauses.push(`p.status = ?`);
    params.push(dbStatus);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const productsSql = `SELECT p.id, p.name, p.code, p.description, p.stock, p.original_price AS price, p.offer_price AS offerPrice, p.status, p.weight, p.weight_unit AS weightUnit, c.name AS category, p.image AS image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
      ORDER BY p.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    // eslint-disable-next-line no-console
    console.debug('[admin.products] productsSql:', productsSql.replace(/\s+/g,' '));
    // eslint-disable-next-line no-console
    console.debug('[admin.products] productsParams:', params);
    const products = await query(productsSql, params);


  const totalResult = await query(`SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereSql}`, params);
  const total = totalResult[0]?.total ?? products.length;
  res.json({ products, total, page, limit });
}

publicRouter.get("/", listProducts);
adminRouter.get("/", listProducts);

adminRouter.get("/:id", async (req, res) => {
  const product = await findOne(
    `SELECT p.id, p.name, p.code, p.description, p.stock, p.original_price AS price, p.offer_price AS offerPrice, p.offer_start_date AS offerStartDate, p.offer_end_date AS offerEndDate, p.status, p.weight, p.weight_unit AS weightUnit, p.category_id, c.name AS category, p.image FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1`,
    [req.params.id],
  );
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  const images = await query(`SELECT id, path FROM product_images WHERE product_id = ? ORDER BY id`, [req.params.id]);
  res.json({ product: { ...product, images } });
});

async function updateProductHandler(req, res) {
  const { name, description, category_id, stock, original_price, offer_price, status, code, weight, weightUnit, offerStartDate, offerEndDate, offerAvailable } = req.body;
  const product = await findOne(`SELECT * FROM products WHERE id = ?`, [req.params.id]);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  let resolvedCategoryId = Number(category_id);
  if (!Number.isInteger(resolvedCategoryId)) {
    const category = await findOne(`SELECT id FROM categories WHERE name = ?`, [category_id]);
    if (category) {
      resolvedCategoryId = category.id;
    }
  }

  if (!resolvedCategoryId) {
    return res.status(400).json({ error: "Invalid category." });
  }

  const imageFile = req.files?.image?.[0];
  const galleryFiles = req.files?.gallery || [];
  const imagePath = imageFile ? `/uploads/products/${imageFile.filename}` : product.image;
  
  const offerEnabled = String(offerAvailable) === 'true' || String(offerAvailable) === '1' || offerAvailable === true;
  const finalOfferPrice = offerEnabled ? (parseFloat(offer_price) || product.offer_price || 0) : 0;
  const finalOfferStart = offerEnabled ? (offerStartDate ? new Date(offerStartDate) : product.offer_start_date) : null;
  const finalOfferEnd = offerEnabled ? (offerEndDate ? new Date(offerEndDate) : product.offer_end_date) : null;

  const parsedWeight = weight !== undefined && weight !== null ? Number(weight) : product.weight;
  const normalizedWeightUnit = weightUnit || product.weight_unit || "kg";

  await query(
    `UPDATE products SET name = ?, code = ?, description = ?, category_id = ?, stock = ?, original_price = ?, offer_price = ?, offer_start_date = ?, offer_end_date = ?, status = ?, weight = ?, weight_unit = ?, image = ? WHERE id = ?`,
    [
      name || product.name,
      code?.trim() || product.code,
      description || product.description || "",
      resolvedCategoryId,
      Number(stock) || product.stock,
      parseFloat(original_price) || product.original_price || 0,
      finalOfferPrice,
      finalOfferStart,
      finalOfferEnd,
      status || product.status || "draft",
      parsedWeight,
      normalizedWeightUnit,
      imagePath,
      req.params.id,
    ],
  );

  if (galleryFiles.length) {
    await Promise.all(
      galleryFiles.map((file) =>
        query(`INSERT INTO product_images (product_id, path, created_at) VALUES (?, ?, UTC_TIMESTAMP())`, [req.params.id, `/uploads/products/${file.filename}`]),
      ),
    );
  }

  const updated = await findOne(`SELECT p.id, p.name, p.code, p.description, p.stock, p.original_price AS price, p.offer_price AS offerPrice, p.offer_start_date AS offerStartDate, p.offer_end_date AS offerEndDate, p.status, p.category_id, c.name AS category, p.image FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1`, [req.params.id]);
  res.json({ product: updated });
}

adminRouter.post("/", upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 5 }]), async (req, res) => {
  try {
    // Log incoming request for debugging
    // eslint-disable-next-line no-console
    console.debug('[admin.products] POST body:', req.body);
    // eslint-disable-next-line no-console
    console.debug('[admin.products] files:', Object.keys(req.files || {}).reduce((acc, k) => ({ ...acc, [k]: (req.files[k] || []).map(f=>f.originalname) }), {}));

    const {
      name,
      description,
      category_id,
      stock,
      original_price,
      offer_price,
      status,
      code,
      weight,
      weightUnit,
      offerAvailable,
      offerStartDate,
      offerEndDate,
    } = req.body;

    if (!name) return res.status(400).json({ success: false, error: 'Product name is required' });
    if (!category_id) return res.status(400).json({ success: false, error: 'Category is required' });

    // Resolve category id (accept numeric id or category name)
    let resolvedCategoryId = Number(category_id);
    if (!Number.isInteger(resolvedCategoryId)) {
      const category = await findOne(`SELECT id FROM categories WHERE name = ?`, [category_id]);
      if (category) resolvedCategoryId = category.id;
    }
    if (!resolvedCategoryId) return res.status(400).json({ success: false, error: 'Invalid category' });

    // Check category exists explicitly
    const categoryExists = await findOne(`SELECT id FROM categories WHERE id = ? LIMIT 1`, [resolvedCategoryId]);
    if (!categoryExists) return res.status(400).json({ success: false, error: 'Selected category does not exist' });

    const resolvedCode = code?.trim() || (await getNextProductCode());

    // Check duplicate product code
    const existingCode = await findOne(`SELECT id FROM products WHERE code = ? LIMIT 1`, [resolvedCode]);
    if (existingCode) return res.status(409).json({ success: false, error: 'Product code already exists' });

    // Map frontend status values to DB enum where needed
    const statusMap = { active: 'published', inactive: 'draft', draft: 'draft', out_of_stock: 'out_of_stock' };
    const resolvedStatus = statusMap[status] || status || 'draft';

    const imageFile = req.files?.image?.[0];
    const galleryFiles = req.files?.gallery || [];
    const imagePath = imageFile ? `/uploads/products/${imageFile.filename}` : "";

    const parsedStock = Number(stock) || 0;
    const parsedWeight = weight !== undefined && weight !== null ? Number(weight) : 0;
    const parsedOriginalPrice = parseFloat(original_price) || 0;
    const parsedOfferPrice = parseFloat(offer_price) || 0;

    // Offer validation
    const offerEnabled = String(offerAvailable) === 'true' || String(offerAvailable) === '1' || offerAvailable === true;
    if (offerEnabled) {
      if (!offer_price) return res.status(400).json({ success: false, error: 'Offer price is required when offerAvailable is true' });
      if (!offerStartDate) return res.status(400).json({ success: false, error: 'Offer start date is required when offerAvailable is true' });
      if (!offerEndDate) return res.status(400).json({ success: false, error: 'Offer end date is required when offerAvailable is true' });
    }

    const normalizedWeightUnit = weightUnit || "kg";
    const result = await query(
      `INSERT INTO products (name, code, description, category_id, stock, original_price, offer_price, offer_start_date, offer_end_date, status, weight, weight_unit, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [
        name,
        resolvedCode,
        description || "",
        resolvedCategoryId,
        parsedStock,
        parsedOriginalPrice,
        parsedOfferPrice,
        offerEnabled && offerStartDate ? new Date(offerStartDate) : null,
        offerEnabled && offerEndDate ? new Date(offerEndDate) : null,
        resolvedStatus,
        parsedWeight,
        normalizedWeightUnit,
        imagePath,
      ],
    );
    const productId = result.insertId ?? null;

    await Promise.all(
      galleryFiles.map((file) =>
        query(`INSERT INTO product_images (product_id, path, created_at) VALUES (?, ?, UTC_TIMESTAMP())`, [productId, `/uploads/products/${file.filename}`]),
      ),
    );

    const created = await findOne(`SELECT p.id, p.name, p.code, p.description, p.stock, p.original_price AS price, p.offer_price AS offerPrice, p.offer_start_date AS offerStartDate, p.offer_end_date AS offerEndDate, p.status, p.weight, p.weight_unit AS weightUnit, c.name AS category, p.image FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1`, [productId]);
    return res.status(201).json({ success: true, product: created });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin.products] error creating product:', err && err.stack ? err.stack : err);
    const message = err && err.message ? err.message : 'Server error';
    return res.status(500).json({ success: false, error: message });
  }
});

adminRouter.put("/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 5 }]), updateProductHandler);
adminRouter.patch("/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 5 }]), updateProductHandler);

adminRouter.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }
  const imagePath = `/uploads/products/${req.file.filename}`;
  res.status(201).json({ image: imagePath, success: true });
});

adminRouter.delete("/image/:id", async (req, res) => {
  const image = await findOne(`SELECT path FROM product_images WHERE id = ? LIMIT 1`, [req.params.id]);
  if (!image) {
    return res.status(404).json({ error: "Image not found." });
  }
  await query(`DELETE FROM product_images WHERE id = ?`, [req.params.id]);
  res.json({ message: "Image deleted." });
});

adminRouter.delete("/:id", async (req, res) => {
  await query(`DELETE FROM product_images WHERE product_id = ?`, [req.params.id]);
  await query(`DELETE FROM products WHERE id = ?`, [req.params.id]);
  res.json({ message: "Product deleted." });
});

export { publicRouter as productsRouter, adminRouter as adminProductsRouter };
