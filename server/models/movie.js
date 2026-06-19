const mongoose = require("mongoose");

const trailerSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  duration: String,
  director: String,
  poster: String,

  trailer: [trailerSchema],

  price: {
    type: Number,
    default: 1000,
  },

  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },

  description: String,
});

module.exports =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);