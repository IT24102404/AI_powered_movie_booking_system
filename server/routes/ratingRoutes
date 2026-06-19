const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Rating = require("../models/Rating");

router.post("/:id/rate", async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const movieId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Save or update user's rating
    await Rating.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, rating, comment },
      { upsert: true, new: true }
    );

    // Get all ratings for this movie
    const ratings = await Rating.find({ movieId });

    const total = ratings.reduce(
      (sum, r) => sum + Number(r.rating),
      0
    );

    const averageRating =
      ratings.length > 0 ? total / ratings.length : 0;

    // Update movie rating directly (NO movie.save())
    await Movie.findByIdAndUpdate(
      movieId,
      {
        $set: {
          "rating.average": averageRating,
          "rating.count": ratings.length,
        },
      },
      { new: true }
    );

    // Latest reviews
    const reviews = await Rating.find({ movieId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      averageRating,
      ratingsCount: ratings.length,
      reviews,
    });
  } catch (err) {
    console.error("RATING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await require("../models/Rating").find({
      userId: req.params.userId,
    });

    const map = {};

    ratings.forEach((r) => {
      map[r.movieId] = {
        rating: r.rating,
        comment: r.comment,
      };
    });

    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;