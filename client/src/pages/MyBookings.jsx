import { useEffect, useState } from "react";
import axios from "axios";
import Navbar_2 from "../components/nav_2";
import { useNavigate } from "react-router-dom";
function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/bookings/user/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setBookings(res.data);
    });

  }, []);

  return (
<div> <Navbar_2 />
    <div className="bg-gray-900 min-h-screen text-white p-10">
    
      <h1 className="text-4xl font-bold mb-10">
        My Bookings 🎟️
      </h1>

      <div className="space-y-6">

        {bookings.map((b) => (

          <div
            key={b._id}
            className="bg-black p-5 rounded"
          >

            <h2 className="text-2xl font-bold">
              {b.movieTitle}
            </h2>

            <p className="text-gray-400 mt-2">
              Seats: {b.seats.join(", ")}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {new Date(b.createdAt).toLocaleString()}
            </p>

          </div>

        ))}
  
      </div>
      <button
  onClick={() => navigate("/movies")}
  className="bg-blue-600 hover:bg-darkblue-700 text-white px-4 py-2 rounded-lg"
>
  Back to Movies
</button>
    </div>
    </div>

  );
}

export default MyBookings;