import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl tracking-[0.2em] uppercase text-gray-900 hover:text-black transition"
        >
          UTARAN
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-base text-gray-500">
          <Link
            to="/"
            className="hover:text-black transition-colors duration-200"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-black transition-colors duration-200"
          >
            Products
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="hover:text-black transition">
                Cart
              </Link>

              <Link
                to="/dashboard"
                className="hover:text-black transition-colors duration-200"
              >
                Account
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-black transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-black transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
