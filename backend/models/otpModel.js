const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 600, // Set TTL index to auto-delete documents after 10 minutes
  },
});
const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
