const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  CardNumber: {
    type: String,
    required: true
  },
  ExpDate: {
    type: String,
    required: true
  },
  Cvv: {
    type: String,
    required: true
  },
  Amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Payments", PaymentSchema, "Payments")