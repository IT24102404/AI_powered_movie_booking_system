// 

import { useState } from "react";
import axios from "axios";
import Navbar_1 from "../components/nav_1";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/auth/login", {
        email,
        password,
      })
      .then((res) => {
        // alert("Login Successful 🎉");
console.log(res.data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        if (res.data.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/movies");
        }
      })
      .catch(() => {
        alert("Login Failed");
      });
  };

  return (
    <div>
      <Navbar_1 />

      <div className="bg-gray-900 min-h-screen flex items-center justify-center">

        <div className="bg-black/80 backdrop-blur-sm p-10 rounded-xl w-[500px] shadow-2xl">

          <h1 className="text-4xl text-white mb-8 text-center font-bold">
            Login
          </h1>

          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 mb-4 focus:outline-none focus:border-red-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 mb-6 focus:outline-none focus:border-red-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-red-600 hover:bg-red-700 w-full p-3 text-white rounded-lg font-bold text-lg transition"
          >
            Login
          </button>

          <p className="text-gray-400 text-center mt-6">
            Don't have an account?{" "}
            <span
              className="text-red-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
          {/* <button
  onClick={() => navigate("/")}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  Back to Home
</button> */}
        </div>
      
      </div>
    </div>
  );
}

export default Login;