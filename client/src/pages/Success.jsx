import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import QRCode from "qrcode";

function Success() {
  const navigate = useNavigate();

  const movieId = localStorage.getItem("movieId");
  const booking = JSON.parse(localStorage.getItem("latestBooking"));

  useEffect(() => {
    const saveBookingAndGenerateTicket = async () => {
      try {
        // 1. Save booking in DB
        const res = await axios.post(
          "http://localhost:5000/bookings",
          {
            movieId: booking.movieId,
            movieTitle: booking.movieTitle,
            seats: booking.seats,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const savedBooking = res.data;

        // 2. Create PDF
        const doc = new jsPDF();

        const qrImage = await QRCode.toDataURL(savedBooking.ticketId);

        doc.text("🎬 Movie Ticket", 20, 20);
        doc.text(`Movie: ${savedBooking.movieTitle}`, 20, 40);
        doc.text(`Seats: ${savedBooking.seats.join(", ")}`, 20, 50);
        doc.text(`Ticket ID: ${savedBooking.ticketId}`, 20, 60);

        doc.addImage(qrImage, "PNG", 20, 70, 50, 50);

        doc.save("ticket.pdf");
        

      } catch (err) {
        console.log(err);
      }
    };

    if (booking) {
      saveBookingAndGenerateTicket();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-green-500 text-3xl">
        Payment Successful ✅
      </h1>

      <button onClick={() => navigate("/movies")} className="mt-5 bg-red-600 px-4 py-2">
        Back
      </button>
    </div>
  );
}

export default Success;