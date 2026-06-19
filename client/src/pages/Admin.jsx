import { useState, useEffect } from "react";
import axios from "axios";
import Navbar_2 from "../components/nav_2";

function Admin() {
  // ================= STATS =================
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0,
    topMovie: null
  });
  const [search, setSearch] = useState("");
  
  // ================= MOVIES =================
  const [genre, setGenre] = useState("All");
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movie, setMovie] = useState({
  title: "",
  genre: "",
  duration: "",
  director: "",
  description: "",
  price: "",
  poster: null,
});
  
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailers, setTrailers] = useState([
  { title: "", file: null }
  ]);
  const token = localStorage.getItem("token");

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchMovies();
    fetchStats();
  }, []);

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

  const fetchStats = () => {
    axios
      .get("http://localhost:5000/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  };

  // ================= ADD MOVIE =================
const addMovie = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("duration", movie.duration);
    formData.append("director", movie.director);
    formData.append("description", movie.description);
    formData.append("price", movie.price);

    if (movie.poster) formData.append("poster", movie.poster);
    
    trailers.forEach((t) => {
  // formData.append("trailerTitles[]", t.title);
  formData.append("trailers", t.file);
});
    await axios.post("http://localhost:5000/movies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Movie Added ✅");

    fetchMovies();

    setMovie({
      title: "",
      genre: "",
      duration: "",
      description: "",
      poster: null,
      trailer: null,
    });

    setPreview("");

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

  // ================= DELETE =================
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

  // ================= EDIT =================
  const handleEdit = (m) => {
  setEditingId(m._id);

  setMovie({
  title: m.title,
  genre: m.genre,
  duration: m.duration,
  director: m.director || "",
  description: m.description,
  price: m.price || "",
  poster: null,
});

  setPreview(`http://localhost:5000${m.poster}`);
};

  // ================= UPDATE =================
  const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("duration", movie.duration);
    formData.append("description", movie.description);
    formData.append("director", movie.director);
    formData.append("price", movie.price);

    trailers.forEach((t) => {
    if (t.file) {
    formData.append("trailers", t.file);
    }
    });
    if (movie.poster) formData.append("poster", movie.poster);

    await axios.put(
      `http://localhost:5000/movies/${editingId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Updated ✅");

    fetchMovies();

    setEditingId(null);

    setMovie({
      title: "",
      genre: "",
      duration: "",
      description: "",
      poster: null,
      trailer: null,
    });

    setPreview("");

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  
   // ✅ FILTER: search + genre together
  const filteredMovies = movies.filter((m) => {
  const matchesSearch = m.title
    ?.toLowerCase()
    .includes(search.toLowerCase());

  const matchesGenre =
    genre === "All" ||
    m.genre?.toLowerCase().includes(genre.toLowerCase());

  return matchesSearch && matchesGenre;
});

  return (
    <div>
      <Navbar_2 />

      <div className="bg-gray-900 min-h-screen text-white p-10">

        {/* ================= HEADER ================= */}
        <h1 className="text-4xl font-bold mb-6">
          Admin Dashboard 👑
        </h1>

        {/* ================= STATS ================= */}
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
            <p className="text-2xl font-bold">
              Rs. {stats.revenue}
            </p>
          </div>

        </div>
            
        {/* ================= FORM ================= */}
        <div className="bg-black p-6 rounded-lg mb-10">

        <input
  placeholder="Movie Title"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.title}
  onChange={(e) =>
    setMovie({ ...movie, title: e.target.value })
  }
/>

<input
  placeholder="Genre"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.genre}
  onChange={(e) =>
    setMovie({ ...movie, genre: e.target.value })
  }
/>

<input
  placeholder="Duration"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.duration}
  onChange={(e) =>
    setMovie({ ...movie, duration: e.target.value })
  }
/>

<input
  placeholder="Director"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.director}
  onChange={(e) =>
    setMovie({ ...movie, director: e.target.value })
  }
/>

<input
  placeholder="Price"
  type="number"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.price}
  onChange={(e) =>
    setMovie({ ...movie, price: e.target.value })
  }
/>

<input
  placeholder="Description"
  className="w-full p-3 mb-3 text-black rounded"
  value={movie.description}
  onChange={(e) =>
    setMovie({ ...movie, description: e.target.value })
  }
/>

           {preview && (
  <div className="mb-3">
    <img
      src={preview}
      alt="Preview"
      className="w-48 h-64 object-cover rounded border"
    />
  </div>
)}
          <div className="mb-3">
  <label className="text-white">Movie Poster</label>

  <input
    type="file"
    accept="image/*"
    className="w-full p-3 text-black bg-white rounded"
    onChange={(e) => {
      const file = e.target.files[0];

      if (file) {
        setMovie((prev) => ({
          ...prev,
          poster: file,
        }));

        setPreview(URL.createObjectURL(file));
      }
    }}
  />
</div>

          {trailers.map((t, index) => (
  <div key={index} className="mb-3">

    <input
      placeholder="Trailer Title"
      className="w-full p-2 mb-2 text-black"
      value={t.title}
      onChange={(e) => {
        const updated = [...trailers];
        updated[index].title = e.target.value;
        setTrailers(updated);
      }}
    />

    <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        const updated = [...trailers];
        updated[index].file = e.target.files[0];
        setTrailers(updated);
      }}
    />
  </div>
))}
       
       <button
  onClick={() =>
    setTrailers([...trailers, { title: "", file: null }])
  }
>
  + Add Trailer
</button>

          <button
            onClick={editingId ? handleUpdate : addMovie}
            className="bg-red-600 px-5 py-3 rounded hover:bg-red-700"
          >
            {editingId ? "Update Movie" : "Add Movie"}
          </button>
           
        </div>
         {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 mb-6 rounded text-black"
        />
        {/* ================= MOVIES ================= */}
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

<p className="text-gray-300 mt-2 text-sm">
    {movie.description}
  </p>

<p className="text-yellow-400 mt-2 font-semibold">
  ⭐ Average Rating: {movie.rating?.average?.toFixed(1) || "0.0"}
</p>

<p className="text-gray-400 text-sm">
  👥 {movie.rating?.count || 0} users rated
</p>

                <div className="mt-3 flex gap-2">

                  <button
                    onClick={() => handleEdit(movie)}
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
  );
}

export default Admin;