const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to DB Successfully');
  })
  .catch((err) => {
    console.log(err);
  });
