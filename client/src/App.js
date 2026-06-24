import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies";
import AllBookings from "./pages/AllBookings";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MovieProfile from "./pages/MovieProfile";
import EditMovie from "./pages/EditMovie";
import AddMovie from "./pages/AddMovie";
// import BookingSuccess from "./pages/BookingSuccess";
import Success from "./pages/Success";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        {/* <Route path="/auth-dashboard" element={<Dashboard />} /> */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add" element={<AddMovie />} />
        <Route path="/admin/edit/:id" element={<EditMovie />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        {/* <Route path="/booking" element={<Booking />} /> */}
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieProfile />} />
        {/* <Route path="/booking-success" element={<BookingSuccess />} /> */}
        <Route path="/success" element={<Success />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;