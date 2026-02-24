const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId').sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bulk sync local orders (admin only) - accepts array of order objects
router.post('/sync', adminAuth, async (req, res) => {
  try {
    const incoming = Array.isArray(req.body) ? req.body : req.body.orders || [];
    if (!incoming.length) return res.status(400).json({ error: 'No orders provided' });

    const created = [];
    for (const o of incoming) {
      // ensure required fields
      const payload = {
        orderId: o.orderId || ('ORD' + Date.now() + Math.floor(Math.random()*1000)),
        customerName: o.customerName || (o.customer?.firstName ? `${o.customer.firstName} ${o.customer.lastName || ''}`.trim() : 'Guest'),
        email: o.email || (o.customer?.email) || '',
        phone: o.phone || (o.customer?.phone) || '',
        products: o.products || o.items || [],
        totalAmount: o.totalAmount || o.total || 0,
        status: o.status || 'Pending',
        paymentStatus: o.paymentStatus || 'Pending',
        paymentMethod: o.paymentMethod || o.method || 'cod',
        shippingAddress: o.shippingAddress || o.customer?.address || {},
        orderDate: o.orderDate ? new Date(o.orderDate) : new Date()
      };
      const order = new Order(payload);
      await order.save();
      created.push(order);
    }

    res.status(201).json({ createdCount: created.length, createdIds: created.map(c=>c._id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
