const mongoose = require('mongoose');


const restaurantSchema = new mongoose.Schema({
  name: {
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
  ownerName: {
    type: String,
    required: true,
  },
  ownerPhoneNumber: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["restaurant" , "pub", "hotel", "coffeeshop", "other"],
  },
  description: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  closingHours: {
    type: String,
    required: true,
  },
  images : {
    type: Array,
    required: true,
  },
  menus: {
    type: Array
  }

});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
