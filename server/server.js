require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const recommendRoutes = require("./routes/recommendRoutes");


const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const app = express();  

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/movies", movieRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/ratings", ratingRoutes);
app.use("/recommend", recommendRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Movie Theater API Running");
});
       
app.listen(5000, () => {
  console.log("Server running on port 5000");
});