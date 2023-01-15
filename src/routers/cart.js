const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const checkSelfAndAdmin = require('../middlewares/checkSelfAndAdmin');
const checkAdmin = require('../middlewares/checkAdmin');
const Cart = require('../models/Cart');
const router = express.Router();

// Create cart
router.post('/', checkAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({
      userId,
    });
    console.log(cart);
    console.log(req.body);
    // If cart is not present then update cart
    if (!cart) {
      const newCart = new Cart({
        userId,
        products: req.body,
      });
      await newCart.save();
      res.status(201).send(newCart);
    } else {
      // Create a new cart
      cart['products'] = req.body;
      await cart.save();
      res.status(200).send(cart);
    }
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Get cart
router.get('/:id', checkAuth, checkSelfAndAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).send({});
    }
    res.status(200).send(cart);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Get all carts
router.get('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).send(carts);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Delete a cart
router.delete('/:cartId', checkAuth, checkAdmin, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findByIdAndDelete(cartId);
    res.status(200).send(cart);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
