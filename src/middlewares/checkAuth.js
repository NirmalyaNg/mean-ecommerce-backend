const jwt = require('jsonwebtoken');
const User = require('../models/User');
const checkAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenData) {
      throw new Error();
    }
    const user = await User.findOne({ _id: tokenData._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({
      error: 'Please Authenticate',
    });
  }
};

module.exports = checkAuth;
