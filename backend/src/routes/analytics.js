import express from "express";
import { query } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff"));

router.get("/wishlist", async (req, res) => {
  const mostWishlisted = await query(`SELECT p.id, p.name, COUNT(w.id) AS wishlist_count FROM wishlist w JOIN products p ON w.product_id = p.id GROUP BY p.id ORDER BY wishlist_count DESC LIMIT 10`);
  const totalCounts = await query(`SELECT COUNT(*) AS totalWishlists FROM wishlist`);
  res.json({ mostWishlisted, totals: totalCounts[0] || { totalWishlists: 0 } });
});

router.get("/cart", async (req, res) => {
  const mostAdded = await query(`SELECT p.id, p.name, SUM(c.quantity) AS added_count FROM cart c JOIN products p ON c.product_id = p.id GROUP BY p.id ORDER BY added_count DESC LIMIT 10`);
  const conversion = await query(`SELECT COUNT(*) AS totalCarts, SUM(CASE WHEN o.id IS NULL THEN 1 ELSE 0 END) AS openCarts FROM cart c LEFT JOIN orders o ON c.user_id = o.user_id`);
  res.json({ mostAdded, conversion: conversion[0] || { totalCarts: 0, openCarts: 0 } });
});

export { router as analyticsRouter };
