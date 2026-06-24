import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar_2 from "../components/nav_2";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const seats = [
    ["A1", "A2", "A3", "A4", "A5", "A6"],
    ["B1", "B2", "B3", "B4", "B5", "B6"],
    ["C1", "C2", "C3", "C4", "C5", "C6"],
    ["D1", "D2", "D3", "D4", "D5", "D6"],
  ];

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const isPaymentDisabled =
    !movie || selectedSeats.length === 0 || loading;

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!movie || selectedSeats.length === 0) return;

    if (!token) {
      alert("Please login first!");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem("movieId", id);

      const response = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          movieId: id,
          movieTitle: movie.title,
          amount: selectedSeats.length * 500,
        }
      );

      window.location.href = response.data.url;
    } catch (err) {
      console.log(err);
      alert("Payment failed");
      setLoading(false);
    }
  };

  // ================= LOAD MOVIE =================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.log(err));

    fetchBookedSeats();
  }, [id]);

  const fetchBookedSeats = () => {
    axios
      .get(`http://localhost:5000/bookings/${id}`)
      .then((res) => setBookedSeats(res.data))
      .catch((err) => console.log(err));
  };

  // ================= SEAT SELECT =================
  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div>
      <Navbar_2 />

      <div className="bg-gray-900 min-h-screen text-white p-10">

        <h1 className="text-4xl font-bold mb-2">
          {movie?.title}
        </h1>

        <h2 className="text-xl text-gray-400 mb-8">
          Select Your Seats
        </h2>

        {/* SCREEN */}
        <div className="bg-white text-black text-center py-3 rounded-lg font-bold mb-6">
          🎬 SCREEN
        </div>

        {/* SEATS */}
        <div className="space-y-3">
          {seats.map((row, i) => (
            <div key={i} className="flex justify-center gap-3">
              {row.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    onClick={() => handleSeatClick(seat)}
                    disabled={isBooked}
                    className={`w-14 h-14 rounded font-bold border transition
                      ${
                        isBooked
                          ? "bg-gray-600"
                          : isSelected
                          ? "bg-red-600"
                          : "bg-white text-black hover:scale-105"
                      }
                    `}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* SELECTED */}
        <p className="mt-6">
          Selected Seats: {selectedSeats.join(", ")}
        </p>

        {/* PAYMENT SUMMARY */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">
            Payment Summary
          </h2>

          <p>🎬 Movie: {movie?.title}</p>
          <p>🎟 Seats: {selectedSeats.join(", ") || "None"}</p>
          <p>💳 Price: Rs. 500 per seat</p>

          <hr className="my-4" />

          <p className="text-xl font-bold">
            Total: Rs. {selectedSeats.length * 500}
          </p>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePayment}
          disabled={isPaymentDisabled}
          className={`mt-6 px-6 py-3 rounded transition flex items-center gap-2
            ${
              isPaymentDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }
          `}
        >
          {loading ? "Processing..." : "Pay & Book"}
        </button>

        {/* BACK */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/movies")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Movies
          </button>
        </div>

      </div>
    </div>
  );
}

export default Booking;