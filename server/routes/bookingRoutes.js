const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
// Save booking
router.post("/",auth ,async (req, res) => {

  try {

    const booking = new Booking({
      userId: req.user.id,   // ⭐ from JWT
      movieId: req.body.movieId,
      movieTitle: req.body.movieTitle,
      seats: req.body.seats,
      ticketId: "TICKET_" + uuidv4(),
    });

    const saved = await booking.save();
    res.json(saved);

  } catch (err) {
    res.status(500).json(err);
  }

});

// GET bookings for logged user
router.get("/user/me", auth, async (req, res) => {

  try {

    const bookings = await Booking.find({
      userId: req.user.id
    });

    res.json(bookings);

  } catch (err) {
    res.status(500).json(err);
  }

});

// GET booked seats for a movie
router.get("/:movieId",  async (req, res) => {
  try {

    const bookings = await Booking.find({
      movieId: req.params.movieId
    });

    //  FLATTEN ALL SEATS INTO ONE ARRAY
    let bookedSeats = [];

    bookings.forEach((booking) => {
      bookedSeats = bookedSeats.concat(booking.seats);
    });

    res.json(bookedSeats);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;