const express = require('express');
const Category = require('../models/Category');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Add a category
router.post('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Delete a  category
router.delete('/:cid', checkAuth, checkAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.cid);
    await category.remove();
    res.status(200).send();
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
