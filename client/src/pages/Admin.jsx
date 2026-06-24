import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar_2 from "../components/nav_2";
import Sidebar from "../components/Sidebar";

function Admin() {

  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  
  // ========== STATS ==========
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0,
    topMovie: null,
  });

  // ========== MOVIES ==========
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMovies();
    fetchStats();
  }, []);

  // ========== FETCH MOVIES ==========
  const fetchMovies = () => {
    setLoading(true);

    axios
      .get("http://localhost:5000/movies")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // ========== FETCH STATS ==========
  const fetchStats = () => {
    axios
      .get("http://localhost:5000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  };

  // ========== DELETE MOVIE ==========
  const deleteMovie = (id) => {
    axios
      .delete(`http://localhost:5000/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Movie Deleted ❌");
        fetchMovies();
        fetchStats();
      })
      .catch((err) => console.log(err));
  };

  // ========== FILTER ==========
  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
  genre === "All" ||
  m.genre?.toLowerCase() === genre.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  return (
    <div>
      <Navbar_2 />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* LEFT SIDEBAR */}
        <Sidebar
  setActivePage={setActivePage}
  activePage={activePage}
/>

        {/* RIGHT CONTENT */}
        <div className="bg-gray-900 min-h-screen text-white p-10" style={{ flex: 1 }}>

          {/* ========== DASHBOARD ========== */}
          <h1 className="text-4xl font-bold mb-6">
            Admin Dashboard 👑
          </h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

            <div className="bg-blue-600 p-4 rounded">
              <h2>Total Movies</h2>
              <p className="text-2xl font-bold">{stats.totalMovies}</p>
            </div>

            <div className="bg-green-600 p-4 rounded">
              <h2>Total Users</h2>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>

            <div className="bg-red-600 p-4 rounded">
              <h2>Total Bookings</h2>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>

            <div className="bg-yellow-500 p-4 rounded">
              <h2>Revenue</h2>
              <p>Rs. {stats.revenue}</p>
            </div>

          </div>
<div className="flex items-center gap-4 mb-4">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md p-3 mb-6 rounded text-black"
          />

          {/* GENRE FILTER */}
<select
  value={genre}
  onChange={(e) => setGenre(e.target.value)}
  className="w-full max-w-md p-3 mb-6 rounded text-black"
>
  <option value="All">All Genres</option>
  <option value="Action">Action</option>
  <option value="Drama">Drama</option>
  <option value="Sci-Fi">Sci-Fi</option>
  <option value="Comedy">Comedy</option>
  <option value="Horror">Horror</option>
</select>
</div>
          {/* MOVIES LIST */}
          {loading && <p>Loading...</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {filteredMovies.map((movie) => (
              <div key={movie._id} className="bg-black rounded-lg overflow-hidden">

                <img
                  src={`http://localhost:5000${movie.poster}`}
                  className="w-full h-80 object-cover"
                  alt={movie.title}
                />

                <div className="p-4">

                  <h2 className="text-2xl font-bold">{movie.title}</h2>
                  <p className="text-gray-400">{movie.genre}</p>

                  <p className="mt-2 text-sm text-gray-300">
                    {movie.description}
                  </p>

                  <div className="mt-3 flex gap-2">

                    {/* ✅ EDIT → ROUTE NAVIGATION */}
                    <button
                      onClick={() => navigate(`/admin/edit/${movie._id}`)}
                      className="bg-yellow-500 px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteMovie(movie._id)}
                      className="bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Admin;