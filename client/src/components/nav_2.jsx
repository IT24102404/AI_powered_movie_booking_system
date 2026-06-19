import { Link, useNavigate } from "react-router-dom";

function Navbar_2() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white flex justify-between items-center p-5 shadow-lg">

      <h1 className="text-3xl font-bold text-red-600">
        CineBook
      </h1>

      <div className="space-x-6 text-lg">

        <Link to="/movies" className="hover:text-red-500">
          Movies
        </Link>

        <Link to="/my-bookings" className="hover:text-red-500">
          My Bookings
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar_2;