import { Link } from "react-router-dom";

function Navbar_1() {

  return (

    <nav className="bg-black text-white flex justify-between items-center p-5 shadow-lg">

      <h1 className="text-3xl font-bold text-red-600">
        CineBook
      </h1>

      <div className="space-x-6 text-lg">

        <Link
          to="/"
          className="hover:text-red-500"
        >
          Home
        </Link>

        {/* <Link
          to="/register"
          className="hover:text-red-500"
        >
          Register
        </Link>

        
         
         <Link to="/login" className="hover:text-red-500">
           Login
        </Link> */}

      </div>

    </nav>

  );
}

export default Navbar_1;