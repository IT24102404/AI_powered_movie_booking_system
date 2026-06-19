const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  movieTitle: String,
  seats: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Booking", bookingSchema);