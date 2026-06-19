import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar_2 from "../components/nav_2";

function Movies() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const [ratingByMovie, setRatingByMovie] = useState({});
  const [commentByMovie, setCommentByMovie] = useState({});
  const [userRatings, setUserRatings] = useState({});

  // LOAD MOVIES
  useEffect(() => {
    axios
      .get("http://localhost:5000/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.log(err));
  }, []);

  // LOAD USER RATINGS
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`http://localhost:5000/ratings/user/${userId}`)
      .then((res) => setUserRatings(res.data))
      .catch((err) => console.log(err));
  }, []);

  // SUBMIT REVIEW
  const submitReview = async (movieId) => {
    try {
      const rating = ratingByMovie[movieId];
      const comment = commentByMovie[movieId];

      if (!rating) {
        alert("Please select rating ⭐");
        return;
      }

      await axios.post(`http://localhost:5000/ratings/${movieId}/rate`, {
        userId: localStorage.getItem("userId"),
        rating,
        comment,
      });

      alert("Review submitted!");

      // refresh user ratings after submit
      const userId = localStorage.getItem("userId");
      const res = await axios.get(
        `http://localhost:5000/ratings/user/${userId}`
      );
      setUserRatings(res.data);

      setCommentByMovie((prev) => ({
        ...prev,
        [movieId]: "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar_2 />

      <div className="bg-gray-900 min-h-screen text-white p-10">
        <h1 className="text-4xl font-bold mb-10">Movies</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {movies.map((movie) => {
            const userRating = userRatings[movie._id]?.rating || 0;

            return (
              <div
                key={movie._id}
                className="bg-black rounded-lg overflow-hidden shadow-lg"
                onMouseEnter={() => setHoveredMovie(movie._id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >

                {/* TRAILER / POSTER */}
                <div className="relative w-full h-96">

                  {hoveredMovie === movie._id &&
                  movie.trailer?.length > 0 ? (
                    <>
                      <video
                        className="w-full h-96 object-cover"
                        src={`http://localhost:5000${movie.trailer[0].url}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />

                      <div
                        onClick={() =>
                          navigate(`/movies/${movie._id}`)
                        }
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer"
                      >
                        <p className="text-white font-bold text-lg">
                          ▶ Click to view details
                        </p>
                      </div>
                    </>
                  ) : (
                    <img
                      src={`http://localhost:5000${movie.poster}`}
                      className="w-full h-96 object-cover"
                      alt={movie.title}
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2 className="text-2xl font-bold">{movie.title}</h2>

                  <p className="text-gray-400">{movie.genre}</p>
                  <p className="text-gray-400">{movie.duration}</p>

                  {/* ⭐ USER RATING */}
                  <p className="text-yellow-400 mt-2 font-semibold">
                    ⭐ Your Rating:{" "}
                    {ratingByMovie[movie._id] ||
                      userRating ||
                      "Not rated"}
                  </p>

                  {/* ⭐ STARS (FIXED HIGHLIGHT) */}
<div className="flex gap-1 mt-2">
  {[1, 2, 3, 4, 5].map((star) => {
    const selectedRating =
      ratingByMovie[movie._id] ?? userRatings[movie._id]?.rating ?? 0;

    return (
      <button
        key={star}
        onClick={() =>
          setRatingByMovie((prev) => ({
            ...prev,
            [movie._id]: star,
          }))
        }
        className={`text-3xl transition hover:scale-125 ${
          star <= selectedRating
            ? "text-yellow-400"
            : "text-gray-500"
        }`}
      >
        ⭐
      </button>
    );
  })}
</div>

                  {/* COMMENT */}
                  <textarea
                    value={commentByMovie[movie._id] || ""}
                    onChange={(e) =>
                      setCommentByMovie((prev) => ({
                        ...prev,
                        [movie._id]: e.target.value,
                      }))
                    }
                    placeholder="Write comment..."
                    rows="3"
                    className="w-full mt-3 p-2 rounded bg-gray-800 text-white"
                  />

                  {/* POST REVIEW */}
                  <button
                    onClick={() => submitReview(movie._id)}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 py-2 rounded"
                  >
                    💬 Post Review
                  </button>

                  {/* BOOK */}
                  <button
                    onClick={() =>
                      navigate(`/booking/${movie._id}`)
                    }
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded mt-5 w-full"
                  >
                    Book Now
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Movies;