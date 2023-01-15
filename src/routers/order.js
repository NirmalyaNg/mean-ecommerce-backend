const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const Order = require('../models/Order');
const checkAdmin = require('../middlewares/checkAdmin');
const checkSelfAndAdmin = require('../middlewares/checkSelfAndAdmin');
const router = express.Router();

// Create a order
router.post('/', checkAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const order = new Order({
      ...req.body,
      userId,
    });
    await order.save();
    res.status(201).send(order);
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// Fetch Specific order
router.get('/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        message: 'Order not found',
      });
    }
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// Get all orders
router.get('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).send(orders);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Get all orders by userId
router.get('/user/:id', checkAuth, checkSelfAndAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({
      userId,
    });
    res.status(200).send(orders);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Update an order
router.patch('/:orderId', checkAuth, checkAdmin, async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({
        error: 'Order does not exist',
      });
    }
    const keys = Object.keys(req.body);
    keys.forEach((k) => (order[k] = req.body[k]));
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Delete an order
router.delete('/:orderId', checkAuth, async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({ userId: req.user._id, _id: orderId });
    if (!order) {
      return res.status(404).send({
        error: 'Order not found',
      });
    }
    await order.remove();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
