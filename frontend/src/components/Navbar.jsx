import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = "text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-all duration-300 hover:tracking-[0.25em]";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link
          to="/"
          className="group flex flex-col items-center justify-center"
        >
          <span className="font-serif italic text-2xl text-black tracking-tighter group-hover:opacity-70 transition-opacity">
            Utaran
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>

          <Link to="/products" className={navLinkClass}>
            Collection
          </Link>

          {/* New Studio Link */}
          <Link to="/contact" className={navLinkClass}>
            Studio
          </Link>

          {/* Divider */}
          <div className="h-3 w-px bg-gray-200 hidden sm:block"></div>

          {user ? (
            <>
              <Link to="/cart" className={navLinkClass}>
                Bag
              </Link>

              <Link to="/dashboard" className={navLinkClass}>
                Account
              </Link>

              <button
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-[0.2em] font-medium text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                Exit
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-black text-white text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}