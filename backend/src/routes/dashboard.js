const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Total Products (Active only)
    const totalProducts = await Product.countDocuments({ status: 'Active' });

    // Total Products Value (price * stock for all active products)
    const products = await Product.find({ status: 'Active' });
    const totalProductsValue = products.reduce((sum, product) => {
      const price = product.discountPrice || product.price;
      return sum + (price * product.stock);
    }, 0);

    // Total Revenue (sum of all paid orders)
    const paidOrders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Recent Orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.countDocuments({ 
      orderDate: { $gte: thirtyDaysAgo } 
    });

    // Pending Orders
    const pendingOrders = await Order.countDocuments({ 
      status: { $in: ['Pending', 'Processing'] } 
    });

    // Today's Sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({ 
      orderDate: { $gte: today },
      paymentStatus: 'Paid'
    });
    const todaysSales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Weekly Sales
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekOrders = await Order.find({ 
      orderDate: { $gte: weekAgo },
      paymentStatus: 'Paid'
    });
    const weeklySales = weekOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Monthly Sales
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthOrders = await Order.find({ 
      orderDate: { $gte: monthAgo },
      paymentStatus: 'Paid'
    });
    const monthlySales = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Quarterly Sales
    const quarterAgo = new Date();
    quarterAgo.setMonth(quarterAgo.getMonth() - 3);
    const quarterOrders = await Order.find({ 
      orderDate: { $gte: quarterAgo },
      paymentStatus: 'Paid'
    });
    const quarterlySales = quarterOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Yearly Sales
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const yearOrders = await Order.find({ 
      orderDate: { $gte: yearAgo },
      paymentStatus: 'Paid'
    });
    const yearlySales = yearOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Returns & Refunds (placeholder - implement when return system is ready)
    const returns = 0;
    const refunds = 0;

    // Support Requests (placeholder - implement when support system is ready)
    const supportRequests = 0;

    res.json({
      totalProducts,
      totalProductsValue,
      totalRevenue,
      recentOrders,
      pendingOrders,
      todaysSales,
      weeklySales,
      monthlySales,
      quarterlySales,
      yearlySales,
      returns,
      refunds,
      supportRequests
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
