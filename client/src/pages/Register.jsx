import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar_1 from "../components/nav_1";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // alert("Registration Successful 🎉");
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div>
      <Navbar_1 />

      <div className="bg-gray-900 min-h-screen flex items-center justify-center">

        <div className="bg-black/80 backdrop-blur-sm p-10 rounded-xl w-[500px] shadow-2xl">

          <h1 className="text-4xl text-white mb-8 text-center font-bold">
            Register
          </h1>

          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 mb-4 focus:outline-none focus:border-red-500"
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={handleRegister}
            className="bg-red-600 hover:bg-red-700 w-full p-3 text-white rounded-lg font-bold text-lg transition"
          >
            Register
          </button>

          <p className="text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <span
              className="text-red-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
           {/* <button
  onClick={() => navigate("/")}
  className="bg-blue-600 hover:bg-darkblue-700 text-white px-4 py-2 rounded-lg"
>
  Back to Home
</button> */}
        </div>
        </div>
      </div>
  );
}

export default Register;