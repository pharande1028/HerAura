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

    // Total Orders and revenue including all orders (regardless of payment status)
    const totalOrders = await Order.countDocuments();
    const allOrders = await Order.find();
    const totalRevenueAll = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

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

    // Today's Sales (paid)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({ 
      orderDate: { $gte: today },
      paymentStatus: 'Paid'
    });
    const todaysSales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Today's Sales (all orders)
    const todayOrdersAll = await Order.find({ orderDate: { $gte: today } });
    const todaysSalesAll = todayOrdersAll.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Weekly Sales (paid)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekOrders = await Order.find({ 
      orderDate: { $gte: weekAgo },
      paymentStatus: 'Paid'
    });
    const weeklySales = weekOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Weekly Sales (all)
    const weekOrdersAll = await Order.find({ orderDate: { $gte: weekAgo } });
    const weeklySalesAll = weekOrdersAll.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Monthly Sales (paid)
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthOrders = await Order.find({ 
      orderDate: { $gte: monthAgo },
      paymentStatus: 'Paid'
    });
    const monthlySales = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Monthly Sales (all)
    const monthOrdersAll = await Order.find({ orderDate: { $gte: monthAgo } });
    const monthlySalesAll = monthOrdersAll.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Quarterly Sales (paid)
    const quarterAgo = new Date();
    quarterAgo.setMonth(quarterAgo.getMonth() - 3);
    const quarterOrders = await Order.find({ 
      orderDate: { $gte: quarterAgo },
      paymentStatus: 'Paid'
    });
    const quarterlySales = quarterOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Quarterly Sales (all)
    const quarterOrdersAll = await Order.find({ orderDate: { $gte: quarterAgo } });
    const quarterlySalesAll = quarterOrdersAll.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Yearly Sales (paid)
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const yearOrders = await Order.find({ 
      orderDate: { $gte: yearAgo },
      paymentStatus: 'Paid'
    });
    const yearlySales = yearOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Yearly Sales (all)
    const yearOrdersAll = await Order.find({ orderDate: { $gte: yearAgo } });
    const yearlySalesAll = yearOrdersAll.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Returns & Refunds (placeholder - implement when return system is ready)
    const returns = 0;
    const refunds = 0;

    // Support Requests (placeholder - implement when support system is ready)
    const supportRequests = 0;

    res.json({
      totalProducts,
      totalProductsValue,
      totalRevenue,
      // totals including all orders
      totalOrders,
      totalRevenueAll,
      recentOrders,
      pendingOrders,
      todaysSales,
      todaysSalesAll,
      weeklySales,
      weeklySalesAll,
      monthlySales,
      monthlySalesAll,
      quarterlySales,
      quarterlySalesAll,
      yearlySales,
      yearlySalesAll,
      returns,
      refunds,
      supportRequests
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Time-series endpoint: daily buckets (paid and all orders)
// GET /api/dashboard/timeseries?start=YYYY-MM-DD&end=YYYY-MM-DD&period=daily
router.get('/timeseries', async (req, res) => {
  try {
    const { start, end, period } = req.query;
    const endDate = end ? new Date(end) : new Date();
    const startDate = start ? new Date(start) : (() => { const d = new Date(); d.setDate(d.getDate()-30); return d; })();

    // normalize times
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);

    // load orders in range
    const orders = await Order.find({ orderDate: { $gte: startDate, $lte: endDate } });

    // build daily buckets
    const days = [];
    const dayMap = {};
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const key = cur.toISOString().slice(0,10);
      days.push(key);
      dayMap[key] = { paid: 0, all: 0 };
      cur.setDate(cur.getDate() + 1);
    }

    orders.forEach(o => {
      const key = new Date(o.orderDate).toISOString().slice(0,10);
      const amt = Number(o.totalAmount || 0) || 0;
      if (dayMap[key]) {
        dayMap[key].all += amt;
        if (o.paymentStatus === 'Paid') dayMap[key].paid += amt;
      }
    });

    const paidSeries = days.map(d => dayMap[d].paid);
    const allSeries = days.map(d => dayMap[d].all);

    res.json({ labels: days, paid: paidSeries, all: allSeries });
  } catch (error) {
    console.error('Timeseries error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



