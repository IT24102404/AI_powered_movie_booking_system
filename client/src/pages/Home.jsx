import React from 'react';
import axios from "axios";
import Navbar_1 from "../components/nav_1";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  // const handleLogin = () => {
  //   axios
  //     .post("http://localhost:5000/auth/login", {
  //       email,
  //       password,
  //     })
  //     .then((res) => {
  //       alert("Login Successful 🎉");

  //       localStorage.setItem("token", res.data.token);

  //       if (res.data.user.isAdmin) {
  //         navigate("/admin");
  //       } else {
  //         navigate("/movies");
  //       }
  //     })
  //     .catch(() => {
  //       alert("Login Failed");
  //     });
  // };

  return (
    <div>
      <Navbar_1 />
      
      <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage: `linear-gradient(
//       rgba(0,0,0,0.7),
//       rgba(0,0,0,0.7)
//     ), url('/images/tyson-moultrie-BQTHOGNHo08-unsplash_3.jpg')`
//   }}
style={{
  backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba')"
}}
>
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-red-400 tracking-wider drop-shadow-lg">
            Welcome to CineBook
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto font-medium">
            Book your favorite movies and experience cinema like never before.
          </p>
        
        <div>-----------------<button
      onClick={() => navigate("/register")}
      className="bg-gray-800 hover:bg-gray-900 w-full p-3 text-white rounded-lg font-bold transition"
    >
      Register
    </button>
        </div>
    <div>
  <button
  onClick={() => navigate("/login")}
  className="mt-2 bg-red-600 hover:bg-red-700 w-full p-3 text-white rounded-lg font-bold text-lg transition"
>
  Login
</button>
</div>
      </div>
    </div>
  </div>
  );
}

export default Home;