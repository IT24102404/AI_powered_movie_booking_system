import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar_2 from "../components/nav_2";
import jsPDF from "jspdf";
import QRCode from "qrcode";


function Booking() {
  const { id } = useParams();
  
 const seats = [
  ["A1", "A2", "A3", "A4", "A5", "A6"],
  ["B1", "B2", "B3", "B4", "B5", "B6"],
  ["C1", "C2", "C3", "C4", "C5", "C6"],
  ["D1", "D2", "D3", "D4", "D5", "D6"],
];

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lastBooking, setLastBooking] = useState(null); // ⭐ NEW
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
   const isPaymentDisabled = !movie || selectedSeats.length === 0;
  const handlePayment = async () => {
  if (!movie) {
    alert("Movie is still loading...");
    return;
  }

  const res = await axios.post(
    "http://localhost:5000/payment/create-checkout-session",
    {
      movieId: id,
    movieTitle: movie.title,
    amount: selectedSeats.length * 500,
    }
  );

  window.location.href = res.data.url;
};
  // GET MOVIE + BOOKED SEATS
  useEffect(() => {
  axios.get(`http://localhost:5000/movies/${id}`)
    .then((res) => {
      setMovie(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  fetchBookedSeats();
}, [id]);

  const fetchBookedSeats = () => {
    axios.get(`http://localhost:5000/bookings/${id}`)
      .then((res) => {
        setBookedSeats(res.data);
      })
      .catch((err) => console.log(err));
  };

  // HANDLE SEATS
  const handleSeatClick = (seat) => {
  if (bookedSeats.includes(seat)) return;

  setSelectedSeats((prev) =>
    prev.includes(seat)
      ? prev.filter((s) => s !== seat)
      : [...prev, seat]
  );
};

  // ⭐ BOOKING (NO PDF HERE)
  const handleBooking = () => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select seats first!");
      return;
    }

    axios.post(
      "http://localhost:5000/bookings",
      {
        movieId: id,
        movieTitle: movie?.title,
        seats: selectedSeats
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {

      alert("Booking Successful 🎉");

      setSelectedSeats([]);
      fetchBookedSeats();

      // ⭐ SAVE BOOKING ONLY (NO DOWNLOAD)
      setLastBooking(res.data);

    })
    .catch((err) => {
      console.log(err);
      alert("Booking Failed");
    });
  };

  // 🎫 DOWNLOAD TICKET (ONLY BUTTON CLICK)
const downloadTicket = async () => {
  if (!lastBooking) {
    alert("No booking found!");
    return;
  }

  const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("🎬 Movie Ticket", 20, 20);

//   doc.setFontSize(12);
//   doc.text(`Movie: ${movie?.title}`, 20, 40);
//   doc.text(`Seats: ${lastBooking.seats.join(", ")}`, 20, 50);
//   doc.text(`Booking ID: ${lastBooking._id}`, 20, 60);
//   doc.text(`Total: Rs. ${lastBooking.seats.length * 500}`, 20, 70);

  // 📌 QR DATA
  const qrData = `🎬 Movie Ticket

Movie: ${movie?.title}
Seats: ${lastBooking.seats.join(", ")}
Booking ID: ${lastBooking._id}
Total: Rs.${lastBooking.seats.length * 500}`;

  // 📌 Generate QR image
  const qrImage = await QRCode.toDataURL(qrData);

  // 📌 Add QR to PDF
  doc.addImage(qrImage, "PNG", 20, 80, 50, 50);

  doc.save("ticket.pdf");
};

  return (
    <div>
      <Navbar_2 />

      <div className="bg-gray-900 min-h-screen text-white p-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-2">
          {movie?.title}
        </h1>

        <h2 className="text-xl text-gray-400 mb-8">
          Select Your Seats
        </h2>

        {/* SEATS */}
        <div className="max-w-4xl mx-auto mb-8">

  <div className="bg-white text-black text-center py-3 rounded-lg font-bold">
    🎬 SCREEN
  </div>

</div>
       <div className="space-y-3">

  {seats.map((row, rowIndex) => (

    <div
      key={rowIndex}
      className="flex justify-center gap-3"
    >

      {row.map((seat) => {

        const isBooked = bookedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        return (
          <button
            key={seat}
            onClick={() => handleSeatClick(seat)}
            disabled={isBooked}
            className={`
              w-14 h-14 rounded font-bold transition-all border border-white

              ${
                isBooked
                  ? "bg-gray-600"
                  : isSelected
                  ? "bg-red-600"
                  : "bg-white-600 hover:scale-105"
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
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

          <p>🎬 Movie: {movie?.title}</p>
          <p>🎟 Seats: {selectedSeats.join(", ") || "None"}</p>
          <p>💳 Price: Rs. 500 per seat</p>

          <hr className="my-4" />

          <p className="text-xl font-bold">
            Total: Rs. {selectedSeats.length * 500}
          </p>
        </div>
        <button
  onClick={handlePayment}
  disabled={isPaymentDisabled}
  className={`mt-6 px-6 py-3 rounded transition
    ${
      isPaymentDisabled
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700"
    }
  `}
>
  Pay & Book
</button>

        {/* BOOK BUTTON */}
        {/* <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
          className={`mt-6 px-6 py-3 rounded
            ${selectedSeats.length === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
            }
          `}
        >
          Book Now
        </button> */}

        {/* ⭐ DOWNLOAD BUTTON (ONLY AFTER BOOKING) */}
        <button
          onClick={downloadTicket}
          disabled={!lastBooking}
          className={`mt-4 ml-3 px-6 py-3 rounded
            ${!lastBooking
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          Download Ticket 🎫
        </button>
        <div>------------------------------------------------------------</div>
     <div>
      <button
  onClick={() => navigate("/movies")}
  className="bg-blue-600 hover:bg-darkblue-700 text-white px-4 py-2 rounded-lg"
>
  Back to Movies
</button>
     </div>
      </div>
    </div>
  );
}

export default Booking;