import axios from "axios";
import { useEffect, useState } from "react";

function Recommendations({ userId }) {

  const [movies, setMovies] = useState([]);

  useEffect(() => {

    axios.get(`http://localhost:5000/api/recommend/${userId}`)
      .then(res => {
        setMovies(res.data.recommendations);
      })
      .catch(err => console.log(err));

  }, [userId]);

  return (
    <div>
      <h2>Recommended Movies</h2>

      {movies.map(movie => (
        <div key={movie._id}>
          <h3>{movie.title}</h3>
          <p>{movie.genre}</p>
          <img src={movie.poster} width="150" />
        </div>
      ))}

    </div>
  );
}

export default Recommendations;