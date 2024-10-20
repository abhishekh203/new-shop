import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaPhoneAlt } from "react-icons/fa";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("users"));
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = () => {
    localStorage.removeItem("users");
    navigate("/login");
  };

  const largeNavList = (
    <ul className="flex flex-col lg:flex-row lg:space-x-8 font-medium text-lg px-5 text-white space-y-2 lg:space-y-0">
      <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
        <Link to="/">Home</Link>
      </li>
      <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
        <Link to="/allproduct">All Products</Link>
      </li>
      {!user && (
        <>
          <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/signup">Signup</Link>
          </li>
          <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/login">Login</Link>
          </li>
        </>
      )}
      {user?.role === "user" && (
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/user-dashboard">User</Link>
        </li>
      )}
      {user?.role === "admin" && (
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/admin-dashboard">Admin</Link>
        </li>
      )}
      {user && (
        <li
          className="cursor-pointer hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={logout}
        >
          Logout
        </li>
      )}
      <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
        <Link to="/cart">
          <FaShoppingCart className="inline-block mr-2" />
          Cart ({cartItems.length})
        </Link>
      </li>
      <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
        <Link to="/ContactUs">
          <FaPhoneAlt className="inline-block mr-2" />
          Contact Us
        </Link>
      </li>
    </ul>
  );

  const smallNavList = (
    <div className="flex flex-col items-center w-full">
      <ul className="flex space-x-4 font-medium text-sm text-white w-full justify-center">
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/allproduct">All Products</Link>
        </li>
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/cart">
            <FaShoppingCart className="inline-block mr-2" />
            Cart ({cartItems.length})
          </Link>
        </li>
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/ContactUs">Contact Us</Link>
        </li>
      </ul>
      <ul className="flex space-x-4 font-medium text-sm text-white w-full justify-center">
        {!user && (
          <>
            <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
              <Link to="/login">Login</Link>
            </li>
            <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user?.role === "user" && (
          <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/user-dashboard">User</Link>
          </li>
        )}
        {user?.role === "admin" && (
          <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/admin-dashboard">Admin</Link>
          </li>
        )}
        {user && (
          <li
            className="cursor-pointer hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={logout}
          >
            Logout
          </li>
        )}
        <li className="hover:text-teal-400 transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/">Home</Link>
        </li>
      </ul>
      {isNavOpen && (
        <h2 className="text-1xl font-bold leading-none mt-5">
          Digital Shop Nepal
        </h2>
      )}
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-black via-blue-900 to-black shadow-lg sticky top-0 z-50">
      <div className="flex flex-col lg:flex-row lg:justify-between items-center py-4 lg:px-8 px-5">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="text-white text-center lg:text-left flex-1">
            {isSmallDevice ? (
              smallNavList // Display small device layout
            ) : (
              <>
                <h2 className="text-3xl font-bold leading-none">
                  Digital Shop
                </h2>
                <h3 className="text-xl font-semibold">Nepal</h3>
              </>
            )}
          </div>
          <div className="lg:hidden flex items-center">
            <button
              className="text-white text-2xl"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        <div
          className={`lg:flex lg:items-center lg:space-x-6 font-medium text-lg px-5 text-white space-y-2 lg:space-y-0 ${
            isNavOpen ? "flex" : "hidden"
          } lg:flex lg:justify-end mt-4 lg:mt-0`}
        >
          {!isSmallDevice && largeNavList}
        </div>
        <div className="flex justify-center mt-4 lg:mt-0 lg:ml-8">
          <div className="relative">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
