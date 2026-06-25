import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar_2 from "../components/nav_2";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRec, setLoadingRec] = useState(true);

  // 🎯 LOAD MOVIE
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // 🎯 LOAD RECOMMENDATIONS (FIXED + SAFE)
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setRecommendations([]);
      setLoadingRec(false);
      return;
    }

    setLoadingRec(true);

    axios
      .get(`http://localhost:5000/recommend/${userId}`)
      .then((res) => {
        setRecommendations(res.data || []);
      })
      .catch((err) => {
        console.log(err);
        setRecommendations([]);
      })
      .finally(() => setLoadingRec(false));
  }, [id]); // 🔥 keep updated when page changes

  if (!movie) {
    return <p className="text-white p-10">Loading...</p>;
  }

  const posterUrl = movie.poster
    ? `http://localhost:5000${movie.poster}`
    : "";

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar_2 />

      <div className="p-10">
       
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/movies")}
          className="mb-6 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded"
        >
          ← Back to Movies
        </button>

        {/* MOVIE DETAILS */}
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={posterUrl}
            className="w-full rounded-xl shadow-xl"
            alt={movie.title}
          />

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-gray-400 text-lg">{movie.genre}</p>
            <p className="text-gray-300">{movie.description}</p>

            <p>🎬 <b>{movie.director}</b></p>
            <p>⏱ {movie.duration}</p>

            <p className="text-yellow-400 font-semibold text-lg">
              ⭐ {movie.rating?.average || 0}
            </p>

             <button
                    onClick={() =>
                      navigate(`/booking/${movie._id}`)
                    }
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded mt-5 w-full"
                  >
                    Book Now
                  </button>

        {/* TRAILERS */}
        {movie.trailer?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Trailers</h2>

            <div className="space-y-5">
              {movie.trailer.map((t, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-gray-800 p-4 rounded-xl"
                >
                  <video
                    className="w-56 h-32 rounded-lg object-cover"
                    controls
                    src={`http://localhost:5000${t.url}`}
                  />

                  <div>
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-gray-400 text-sm">
                      Trailer {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
        

        {/* ⭐ RECOMMENDATIONS */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Recommended for You ⭐
          </h2>

          {loadingRec ? (
            <p className="text-gray-400">Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-gray-400">
              No recommendations yet (rate more movies)
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((recMovie) => (
                <div
                  key={recMovie._id}
                  onClick={() => navigate(`/movies/${recMovie._id}`)}
                  className="cursor-pointer bg-gray-800 rounded p-2 hover:scale-105 transition"
                >
                  <img
                    src={`http://localhost:5000${recMovie.poster}`}
                    className="w-full h-40 object-cover rounded"
                    alt={recMovie.title}
                  />
                  <p className="text-white mt-2 text-sm font-semibold">
                    {recMovie.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MovieDetails;