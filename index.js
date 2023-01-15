const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
require('./src/db/mongoose');
const userRouter = require('./src/routers/user');
const productRouter = require('./src/routers/product');
const cartRouter = require('./src/routers/cart');
const authRouter = require('./src/routers/auth');
const orderRouter = require('./src/routers/order');
const categoryRouter = require('./src/routers/category');
const stripeRouter = require('./src/routers/stripe');
const dashboardRouter = require('./src/routers/dashboard');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/checkout', stripeRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server is up and running on port ' + PORT);
});
