const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash plain text passwords before saving to DB
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const hashedPassword = await bcryptjs.hash(user.password, 8);
    user.password = hashedPassword;
  }
  next();
});

// Find user by email and password
userSchema.statics.findByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new Error('Invalid Email');
  }
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid Password');
  }
  return user;
};

// Generate jwt
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toHexString(), isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '1 hour',
    }
  );
  user.tokens.push({
    token,
  });
  await user.save();
  return token;
};

// Remove password and tokens field from user
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.tokens;
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
