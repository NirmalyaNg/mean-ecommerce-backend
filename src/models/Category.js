const mongoose = require('mongoose');
const Product = require('./Product');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

categorySchema.pre('remove', async function (next) {
  const category = this;
  await Product.deleteMany({
    category: category.name,
  });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
