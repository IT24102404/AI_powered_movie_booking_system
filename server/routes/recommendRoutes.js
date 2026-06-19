const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");
const Movie = require("../models/movie");

// 🎯 GET recommendations for user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. user liked movies (4-5 stars)
    const userRatings = await Rating.find({
      userId,
      rating: { $gte: 4 },
    });

    const likedMovieIds = userRatings.map((r) => r.movieId);

    if (likedMovieIds.length === 0) {
      return res.json([]); // no recommendations yet
    }

    // 2. similar users
    const similarRatings = await Rating.find({
      movieId: { $in: likedMovieIds },
      rating: { $gte: 4 },
      userId: { $ne: userId },
    });

    const similarUserIds = similarRatings.map((r) => r.userId);

    if (similarUserIds.length === 0) {
      return res.json([]);
    }

    // 3. movies liked by similar users
    const recommendedRatings = await Rating.find({
      userId: { $in: similarUserIds },
      rating: { $gte: 4 },
    });

    const recommendedMovieIds = [
      ...new Set(recommendedRatings.map((r) => r.movieId)),
    ];

    // 4. fetch movies
    const movies = await Movie.find({
      _id: { $in: recommendedMovieIds },
    });

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;