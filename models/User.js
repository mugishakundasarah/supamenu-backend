const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "CLIENT",
    enum: ["RESTAURANT_MANAGER", "CLIENT"]
  }, 
  token: {
    type: String 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
