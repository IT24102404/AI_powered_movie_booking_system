import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AllBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-white p-10">Loading bookings...</p>;
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">
        All Bookings 🎟️
      </h1>

      <div className="grid gap-4">

        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-black p-4 rounded"
          >

            <p><b>User:</b> {b.user?.name}</p>
            <p><b>Movie:</b> {b.movie?.title}</p>
            <p><b>Seats:</b> {b.seats?.join(", ")}</p>
            <p><b>Date:</b> {new Date(b.createdAt).toLocaleString()}</p>

          </div>
        ))}
       
      </div>
      <button
        onClick={() => navigate("/admin")}
        className="bg-red-700 px-4 py-2 rounded hover:bg-red-600"
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default AllBookings;