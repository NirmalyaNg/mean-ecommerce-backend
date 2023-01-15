const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const checkSelfAndAdmin = require('../middlewares/checkSelfAndAdmin');
const checkAdmin = require('../middlewares/checkAdmin');
const User = require('../models/User');
const router = express.Router();

// Get Profile Data
router.get('/profile', checkAuth, (req, res) => {
  res.send(req.user);
});

// Update User
// User cannot edit profile of any other user unless user is an admin
router.patch('/:id', checkAuth, checkSelfAndAdmin, async (req, res) => {
  const allowedUpdates = ['username', 'email', 'password'];
  const updateKeys = Object.keys(req.body);
  const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Invalid updates',
    });
  }
  const user = req.user;
  updateKeys.forEach((key) => (user[key] = req.body[key]));
  try {
    const modifiedUser = await user.save();
    res.status(200).send(modifiedUser);
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});

router.patch('/adminActions/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isAdmin = req.body.status;
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Delete a user
// Only a user will be able allowed to delete if its own profile or user is an admin
router.delete('/:id', checkAuth, checkSelfAndAdmin, async (req, res) => {
  const user = req.user;
  await user.remove();
  res.status(200).send(user);
});

// Get all users
router.get('/all', checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
