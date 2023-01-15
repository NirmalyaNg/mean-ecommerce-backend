const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const Product = require('../models/Product');
const router = express.Router();

// Add a product
router.post('/', checkAuth, checkAdmin, async (req, res) => {
  const product = new Product({
    ...req.body,
    user: req.user._id,
  });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Fetch All Products
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let products = null;
    if (category) {
      products = await Product.find({
        category,
      });
    } else {
      products = await Product.find({});
    }
    res.status(200).send(products);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Fetch specific product
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({
        error: 'Product not found',
      });
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Update a product
router.patch('/:id', checkAuth, checkAdmin, async (req, res) => {
  const id = req.params.id;
  const allowedUpdates = ['title', 'description', 'price', 'image', 'category'];
  const updateKeys = Object.keys(req.body);
  const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Invalid Updates',
    });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({
        error: 'Product not found',
      });
    }
    updateKeys.forEach((key) => (product[key] = req.body[key]));
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Delete a product
router.delete('/:id', checkAuth, checkAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
