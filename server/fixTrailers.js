const mongoose = require("mongoose");
const Movie = require("./models/movie");

mongoose.connect("mongodb://127.0.0.1:27017/movie_db");

async function fix() {
  const result = await Movie.updateMany(
    {
      $or: [
        { trailer: "" },
        { trailer: { $type: "string" } },
        { trailer: null }
      ]
    },
    {
      $set: { trailer: [] }
    }
  );

  console.log(result);
  process.exit();
}

fix();