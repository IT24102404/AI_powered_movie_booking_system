const express = require("express");
const router = express.Router();

const Movie = require("../models/movie");
const admin = require("../middleware/admin");

const multer = require("multer");

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= GET ALL MOVIES ================= */

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET SINGLE MOVIE ================= */

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD MOVIE ================= */

router.post(
  "/",
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "trailers", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const trailers = req.files?.trailers
        ? req.files.trailers.map((file, index) => ({
            title: `Trailer ${index + 1}`,
            url: `/uploads/${file.filename}`,
          }))
        : [];

      const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        duration: req.body.duration,
        director: req.body.director,
        description: req.body.description,
        price: req.body.price,

        poster: req.files?.poster
          ? `/uploads/${req.files.poster[0].filename}`
          : "",

        trailer: trailers,
      });

      await movie.save();

      res.status(201).json(movie);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ================= UPDATE MOVIE ================= */

router.put(
  "/:id",
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "trailers", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        genre: req.body.genre,
        duration: req.body.duration,
        director: req.body.director,
        description: req.body.description,
        price: req.body.price,
      };

      if (req.files?.poster) {
        updateData.poster =
          `/uploads/${req.files.poster[0].filename}`;
      }

      if (req.files?.trailers) {
        updateData.trailer = req.files.trailers.map(
          (file, index) => ({
            title: `Trailer ${index + 1}`,
            url: `/uploads/${file.filename}`,
          })
        );
      }

      const updatedMovie =
        await Movie.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      if (!updatedMovie) {
        return res.status(404).json({
          message: "Movie not found",
        });
      }

      res.json(updatedMovie);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ================= DELETE MOVIE ================= */

router.delete("/:id", admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(
      req.params.id
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json({
      message: "Movie deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;