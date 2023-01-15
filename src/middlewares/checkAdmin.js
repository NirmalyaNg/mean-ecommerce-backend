const checkAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({
      error: 'You are not allowed to perform this action',
    });
  }
};
module.exports = checkAdmin;
