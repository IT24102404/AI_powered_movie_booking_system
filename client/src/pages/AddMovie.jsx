import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddMovie() {
    const navigate = useNavigate();
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

  const [trailers, setTrailers] = useState([
    { title: "", file: null },
  ]);

  const addMovie = async () => {
    try {
      const formData = new FormData();

      formData.append("title", movie.title);
      formData.append("genre", movie.genre);
      formData.append("duration", movie.duration);
      formData.append("director", movie.director);
      formData.append("description", movie.description);
      formData.append("price", movie.price);

      if (movie.poster) {
        formData.append("poster", movie.poster);
      }

      trailers.forEach((t) => {
        if (t.file) {
          formData.append("trailers", t.file);
        }
      });

      await axios.post(
        "http://localhost:5000/movies",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      alert("Movie Added Successfully ✅");
      
      setMovie({
        title: "",
        genre: "",
        duration: "",
        director: "",
        description: "",
        price: "",
        poster: null,
      });

      setPreview("");

      setTrailers([
        { title: "", file: null },
      ]);
      navigate("/admin");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Add Movie Failed ❌");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">

      

      <div className="flex-1 p-10 text-white">

        <h1 className="text-4xl font-bold mb-8">
          Add New Movie 🎬
        </h1>

        <div className="bg-black p-6 rounded-lg">

          <input
            type="text"
            placeholder="Movie Title"
            className="w-full p-3 mb-3 text-black rounded"
            value={movie.title}
            onChange={(e) =>
              setMovie({
                ...movie,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Genre"
            className="w-full p-3 mb-3 text-black rounded"
            value={movie.genre}
            onChange={(e) =>
              setMovie({
                ...movie,
                genre: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Duration"
            className="w-full p-3 mb-3 text-black rounded"
            value={movie.duration}
            onChange={(e) =>
              setMovie({
                ...movie,
                duration: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Director"
            className="w-full p-3 mb-3 text-black rounded"
            value={movie.director}
            onChange={(e) =>
              setMovie({
                ...movie,
                director: e.target.value,
              })
            }
          />

          {/* <input
            type="number"
            placeholder="Price"
            className="w-full p-3 mb-3 text-black rounded"
            value={movie.price}
            onChange={(e) =>
              setMovie({
                ...movie,
                price: e.target.value,
              })
            }
          /> */}

          <textarea
            placeholder="Description"
            className="w-full p-3 mb-3 text-black rounded"
            rows="4"
            value={movie.description}
            onChange={(e) =>
              setMovie({
                ...movie,
                description: e.target.value,
              })
            }
          />

          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-64 object-cover rounded"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">
              Movie Poster
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full bg-white text-black p-3 rounded"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setMovie({
                    ...movie,
                    poster: file,
                  });

                  setPreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
            />
          </div>

          <h2 className="text-xl font-bold mb-3">
            Movie Trailers
          </h2>

          {trailers.map((t, index) => (
            <div
              key={index}
              className="mb-4 border p-3 rounded"
            >
              <input
                type="text"
                placeholder="Trailer Title"
                className="w-full p-2 mb-2 text-black rounded"
                value={t.title}
                onChange={(e) => {
                  const updated = [...trailers];
                  updated[index].title =
                    e.target.value;
                  setTrailers(updated);
                }}
              />

              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const updated = [...trailers];
                  updated[index].file =
                    e.target.files[0];
                  setTrailers(updated);
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setTrailers([
                ...trailers,
                { title: "", file: null },
              ])
            }
            className="bg-blue-600 px-4 py-2 rounded mr-3"
          >
            + Add Trailer
          </button>

          <button
  type="button"
  onClick={addMovie}
  className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
>
  Add Movie
</button>

        </div>
        <button
        onClick={() => navigate("/admin")}
        className="bg-red-700 px-4 py-2 rounded hover:bg-red-600"
      >
        ⬅ Back
      </button>
      </div>
      
    </div>
  );
}

export default AddMovie;