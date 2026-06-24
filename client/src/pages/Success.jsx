import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode";

function Success() {
  const navigate = useNavigate();

  const movieId = localStorage.getItem("movieId");
  const booking = JSON.parse(localStorage.getItem("latestBooking"));

  useEffect(() => {
    const generateTicket = async () => {
      try {
        if (!booking) {
          console.log("No booking data found");
          return;
        }

        const doc = new jsPDF();

        const qrData = `
Movie: ${booking.movieTitle}
Seats: ${booking.seats.join(", ")}
Movie ID: ${booking.movieId}
        `;

        const qrImage = await QRCode.toDataURL(qrData);

        doc.setFontSize(18);
        doc.text("🎬 Movie Ticket", 20, 20);

        doc.setFontSize(12);
        doc.text(`Movie: ${booking.movieTitle}`, 20, 40);
        doc.text(`Seats: ${booking.seats.join(", ")}`, 20, 50);

        doc.addImage(qrImage, "PNG", 20, 70, 50, 50);

        doc.save("ticket.pdf");

        console.log("Ticket generated");
      } catch (err) {
        console.log("PDF ERROR:", err);
      }
    };

    generateTicket();
  }, []);

  const handleBack = () => {
    if (!movieId) {
      navigate("/movies");
    } else {
      navigate(`/booking/${movieId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

      <h1 className="text-3xl font-bold text-green-500">
        Payment Successful ✅
      </h1>

      <button
        onClick={handleBack}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        Back
      </button>

    </div>
  );
}

export default Success;