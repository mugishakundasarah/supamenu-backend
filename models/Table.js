const mongoose = require('mongoose');


const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
