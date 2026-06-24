import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState("");
  const [trailers, setTrailers] = useState([]);

  // ================= FETCH MOVIE =================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/movies/${id}`)
      .then((res) => {
        const movie = res.data;

        setForm({
          title: movie.title || "",
          genre: movie.genre || "",
          duration: movie.duration || "",
          director: movie.director || "",
          description: movie.description || "",
          price: movie.price || "",
          poster: null,
        });

        setPreview(movie.poster || "");

        // ✅ FIXED TRAILER MAPPING
        setTrailers(
          movie.trailer?.length
            ? movie.trailer.map((t) => ({
                title: t.title || "",
                file: null,
                url: t.url || "",
              }))
            : [{ title: "", file: null, url: "" }]
        );
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!form) return <p className="text-white">Loading...</p>;

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD TRAILER =================
  const addTrailer = () => {
    setTrailers([...trailers, { title: "", file: null, url: "" }]);
  };

  // ================= UPDATE MOVIE =================
  const updateMovie = async () => {
    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("genre", form.genre);
      formData.append("duration", form.duration);
      formData.append("director", form.director);
      formData.append("description", form.description);
      formData.append("price", form.price);

      if (form.poster) {
        formData.append("poster", form.poster);
      }

      // only new files
      trailers.forEach((t) => {
        if (t.file) {
          formData.append("trailers", t.file);
        }
      });

      await axios.put(
        `http://localhost:5000/movies/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Movie Updated Successfully ✅");
      navigate("/admin");

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ================= UI =================
  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">
        Edit Movie 🎬
      </h1>

      {/* TITLE */}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Title"
      />

      {/* GENRE */}
      <input
        name="genre"
        value={form.genre}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Genre"
      />

      {/* DURATION */}
      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Duration"
      />

      {/* DIRECTOR */}
      <input
        name="director"
        value={form.director}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Director"
      />

      {/* PRICE */}
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Price"
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="p-2 text-black w-full mb-3"
        placeholder="Description"
      />

      {/* POSTER */}
      {preview && (
        <img
          src={`http://localhost:5000${preview}`}
          className="w-40 h-56 object-cover mb-3"
        />
      )}

      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setForm({ ...form, poster: file });
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      {/* TRAILERS */}
      <h2 className="text-xl font-bold mb-2">
        Trailers
      </h2>

      {trailers.map((t, index) => (
        <div key={index} className="mb-4 border p-3 rounded">

          {/* SHOW EXISTING VIDEO */}
          {t.url && (
            <p className="text-sm text-gray-400 mb-2">
              Existing: {t.url}
            </p>
          )}

          <input
            type="text"
            value={t.title}
            placeholder="Trailer Title"
            className="p-2 text-black w-full mb-2"
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
        onClick={addTrailer}
        className="bg-blue-600 px-4 py-2 rounded mb-4"
      >
        + Add Trailer
      </button>

      {/* BUTTONS */}
      <div className="flex gap-3">

        <button
          onClick={updateMovie}
          className="bg-green-600 px-5 py-2 rounded"
        >
          Update Movie
        </button>

        <button
          onClick={() => navigate("/admin")}
          className="bg-red-600 px-5 py-2 rounded"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default EditMovie;