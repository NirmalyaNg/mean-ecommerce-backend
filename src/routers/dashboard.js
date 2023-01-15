const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

router.get('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({
      _id: {
        $ne: req.user._id,
      },
    });
    const orders = await Order.find({});
    res.status(200).send({
      users: users.length,
      orders: orders.length,
      income: orders.map((order) => order.amount).reduce((o1, o2) => o1 + o2, 0),
    });
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
