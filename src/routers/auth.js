const express = require('express');
const User = require('../models/User');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

router.post('/checkAdmin', checkAuth, async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(200).send({
      isAdmin: true,
    });
  } else {
    return res.status(200).send({
      isAdmin: false,
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByEmailAndPassword(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Logout
router.post('/logout', checkAuth, async (req, res) => {
  try {
    const token = req.token;
    const user = req.user;
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    res.status(200).send({
      message: 'Logout Successfull',
    });
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Logout All
router.post('/logoutAll', checkAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({
      message: 'Logged out of all devices',
    });
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

// Check if username is already taken
router.post('/checkUsername', async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(200).send(null);
  } else {
    return res.status(200).send({
      usernameTaken: true,
    });
  }
});

// Check if email is already taken
router.post('/checkEmail', async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).send(null);
  } else {
    return res.status(200).send({
      emailTaken: true,
    });
  }
});

module.exports = router;
