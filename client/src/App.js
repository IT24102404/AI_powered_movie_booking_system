import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies";
// import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MovieProfile from "./pages/MovieProfile";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        {/* <Route path="/auth-dashboard" element={<Dashboard />} /> */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/my-bookings" element={<MyBookings />} />
        {/* <Route path="/booking" element={<Booking />} /> */}
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieProfile />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;