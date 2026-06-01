import express from "express";
import { query, findOne } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, requireRoles("Admin", "Manager", "Staff", "Delivery Agent"));

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

function buildWhereClauses(query) {
  const where = ["1 = 1"];
  const params = [];

  if (query.search) {
    const term = `%${query.search}%`;
    if (!Number.isNaN(Number(query.search))) {
      where.push(`(o.id = ? OR u.name LIKE ? OR u.phone LIKE ? OR p.method LIKE ? OR p.transaction_id LIKE ?)`);
      params.push(Number(query.search), term, term, term, term);
    } else {
      where.push(`(u.name LIKE ? OR u.phone LIKE ? OR p.method LIKE ? OR p.transaction_id LIKE ?)`);
      params.push(term, term, term, term);
    }
  }

  if (query.status) {
    where.push(`o.status = ?`);
    params.push(query.status);
  }

  if (query.paymentStatus) {
    where.push(`p.status = ?`);
    params.push(query.paymentStatus);
  }

  if (query.paymentMethod) {
    where.push(`p.method = ?`);
    params.push(query.paymentMethod);
  }

  if (query.startDate) {
    where.push(`o.order_date >= ?`);
    params.push(query.startDate);
  }

  if (query.endDate) {
    where.push(`o.order_date <= ?`);
    params.push(query.endDate);
  }

  return { where: where.join(" AND "), params };
}

async function fetchOrderById(id) {
  const order = await findOne(
    `SELECT
      o.id,
      o.order_date,
      o.subtotal,
      o.delivery_charge,
      o.discount,
      o.tax,
      o.total_amount,
      o.status,
      o.tracking_id,
      o.payment_id,
      o.delivery_agent_id,
      o.address_id,
      u.id AS user_id,
      u.name AS customer_name,
      u.email AS customer_email,
      u.phone AS customer_phone,
      p.method AS payment_method,
      p.status AS payment_status,
      p.transaction_id,
      a.full_name AS recipient_name,
      a.phone AS address_phone,
      a.line1,
      a.line2,
      a.area,
      a.city,
      a.district,
      a.state,
      a.pincode,
      a.country,
      da.name AS delivery_agent_name,
      da.phone AS delivery_agent_phone,
      s.status AS shipping_status,
      s.tracking_id AS shipping_tracking_id,
      s.courier_partner,
      s.expected_delivery_date,
      s.notes AS shipping_notes
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN payments p ON p.id = o.payment_id
    LEFT JOIN addresses a ON a.id = o.address_id
    LEFT JOIN delivery_agents da ON da.id = o.delivery_agent_id
    LEFT JOIN shipping s ON s.order_id = o.id
    WHERE o.id = ?
    LIMIT 1`,
    [id],
  );

  if (!order) {
    return null;
  }

  const items = await query(
    `SELECT
      oi.id,
      oi.product_id,
      COALESCE(oi.product_code, p.code) AS product_code,
      COALESCE(oi.category_name, c.name) AS category_name,
      COALESCE(p.name, oi.product_name) AS product_name,
      oi.quantity,
      oi.weight,
      oi.price,
      oi.total
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE oi.order_id = ?
    ORDER BY oi.id`,
    [id],
  );

  const history = await query(
    `SELECT status, note, created_at FROM order_history WHERE order_id = ? ORDER BY created_at ASC`,
    [id],
  );

  return { order, items, history };
}

router.get("/agents", async (req, res) => {
  const agents = await query(`SELECT id, name, phone, status FROM delivery_agents ORDER BY name`);
  res.json({ agents });
});

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const { where, params } = buildWhereClauses(req.query);

  const orders = await query(
    `SELECT
      o.id,
      o.order_date,
      o.total_amount,
      o.status,
      o.subtotal,
      o.delivery_charge,
      o.discount,
      o.tax,
      u.name AS customer_name,
      u.phone AS customer_phone,
      p.method AS payment_method,
      p.status AS payment_status,
      p.transaction_id,
      s.tracking_id,
      da.name AS delivery_agent,
      COUNT(DISTINCT oi.id) AS products_count
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN payments p ON p.id = o.payment_id
    LEFT JOIN shipping s ON s.order_id = o.id
    LEFT JOIN delivery_agents da ON da.id = o.delivery_agent_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ${where}
    GROUP BY o.id
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const totalRows = await query(
    `SELECT COUNT(DISTINCT o.id) AS total
     FROM orders o
     JOIN users u ON u.id = o.user_id
     LEFT JOIN payments p ON p.id = o.payment_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE ${where}`,
    params,
  );

  const statsRows = await query(
    `SELECT
      COUNT(*) AS totalOrders,
      SUM(CASE WHEN DATE(o.order_date) = CURRENT_DATE() THEN 1 ELSE 0 END) AS todayOrders,
      SUM(CASE WHEN o.status = 'Pending' THEN 1 ELSE 0 END) AS pendingOrders,
      SUM(CASE WHEN o.status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmedOrders,
      SUM(CASE WHEN o.status = 'Processing' THEN 1 ELSE 0 END) AS processingOrders,
      SUM(CASE WHEN o.status = 'Packed' THEN 1 ELSE 0 END) AS packedOrders,
      SUM(CASE WHEN o.status = 'Shipped' THEN 1 ELSE 0 END) AS shippedOrders,
      SUM(CASE WHEN o.status = 'Out For Delivery' THEN 1 ELSE 0 END) AS outForDeliveryOrders,
      SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) AS deliveredOrders,
      SUM(CASE WHEN o.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledOrders,
      SUM(o.total_amount) AS totalRevenue
    FROM orders o`,
  );

  res.json({
    orders,
    total: totalRows[0]?.total ?? 0,
    page,
    limit,
    stats: statsRows[0] || {
      totalOrders: 0,
      todayOrders: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      processingOrders: 0,
      packedOrders: 0,
      shippedOrders: 0,
      outForDeliveryOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
    },
  });
});

router.get("/:id", async (req, res) => {
  const result = await fetchOrderById(req.params.id);
  if (!result) return res.status(404).json({ error: "Order not found." });
  res.json(result);
});

router.put("/:id/status", async (req, res) => {
  const { status, note } = req.body;
  if (!status || !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid order status." });
  }

  await query(`UPDATE orders SET status = ? WHERE id = ?`, [status, req.params.id]);
  await query(
    `INSERT INTO order_history (order_id, status, note, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())`,
    [req.params.id, status, note || `${status} by admin`],
  );

  res.json({ message: "Order status updated." });
});

router.put("/:id/assign-agent", async (req, res) => {
  const { delivery_agent_id } = req.body;
  if (!delivery_agent_id) return res.status(400).json({ error: "Delivery agent is required." });

  const agent = await findOne(`SELECT id FROM delivery_agents WHERE id = ? LIMIT 1`, [delivery_agent_id]);
  if (!agent) return res.status(404).json({ error: "Delivery agent not found." });

  await query(`UPDATE orders SET delivery_agent_id = ? WHERE id = ?`, [delivery_agent_id, req.params.id]);
  res.json({ message: "Delivery agent assigned." });
});

router.put("/:id/shipping", async (req, res) => {
  const { trackingId, courierPartner, expectedDeliveryDate, notes, shippingStatus } = req.body;
  const order = await findOne(`SELECT id FROM orders WHERE id = ? LIMIT 1`, [req.params.id]);
  if (!order) return res.status(404).json({ error: "Order not found." });

  const existing = await findOne(`SELECT id FROM shipping WHERE order_id = ? LIMIT 1`, [req.params.id]);
  if (existing) {
    await query(
      `UPDATE shipping SET tracking_id = ?, courier_partner = ?, expected_delivery_date = ?, notes = ?, status = ?, updated_at = UTC_TIMESTAMP() WHERE order_id = ?`,
      [trackingId || null, courierPartner || null, expectedDeliveryDate ? new Date(expectedDeliveryDate) : null, notes || "", shippingStatus || null, req.params.id],
    );
  } else {
    await query(
      `INSERT INTO shipping (order_id, tracking_id, courier_partner, expected_delivery_date, notes, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [req.params.id, trackingId || null, courierPartner || null, expectedDeliveryDate ? new Date(expectedDeliveryDate) : null, notes || "", shippingStatus || "pending"],
    );
  }

  res.json({ message: "Shipping details updated." });
});

router.get("/:id/invoice", async (req, res) => {
  const result = await fetchOrderById(req.params.id);
  if (!result) return res.status(404).json({ error: "Order not found." });

  res.json({
    invoice: {
      company: {
        name: "Sam Enterprises",
        address: "Premium Pickles & Foods, HQ Road, Local Market, India",
        phone: "+91 98765 43210",
        email: "support@samenterprises.com",
      },
      order: result.order,
      items: result.items,
      history: result.history,
    },
  });
});

router.post("/print", async (req, res) => {
  const { orderId, printType } = req.body;
  if (!orderId) return res.status(400).json({ error: "Order ID is required for printing." });
  const result = await fetchOrderById(orderId);
  if (!result) return res.status(404).json({ error: "Order not found." });

  res.json({
    message: "Print payload generated.",
    printType: printType || "invoice",
    order: result.order,
    items: result.items,
    history: result.history,
  });
});

export { router as ordersRouter };
