const express = require("express");
const router = express.Router();

const Movie = require("../models/Movie");
const User = require("../models/User");
const Booking = require("../models/Booking");
const admin = require("../middleware/admin");

// 🔐 ADMIN STATS (SECURE)
router.get("/stats", admin, async (req, res) => {
  try {

    // 🎬 REAL DATA FROM DATABASE
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // 💰 REVENUE CALCULATION
    const bookings = await Booking.find();

    let revenue = 0;

    bookings.forEach((b) => {
      revenue += b.seats.length * 500; // seat price
    });

    const topMovie = await Booking.aggregate([
      { $unwind: "$seats" },
      {
        $group: {
          _id: "$movieTitle",
          totalSeats: { $sum: 1 }
        }
      },
      { $sort: { totalSeats: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      totalMovies,
      totalUsers,
      totalBookings,
      revenue,
      topMovie: topMovie[0] || null
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

module.exports = router;