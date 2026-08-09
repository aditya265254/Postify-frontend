import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAPI } from "../config/post.api.js";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch {
      // ignore
    }
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 border-b border-gray-200/60 dark:border-slate-800/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300 shadow-xs">
      <div className="flex items-center gap-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight cursor-pointer flex items-center gap-2"
        >
          <span className="bg-blue-600 text-white dark:bg-blue-500 text-xs px-2 py-0.5 rounded-md font-extrabold tracking-wider uppercase shadow-xs">
            App
          </span>
          Postify
        </h1>

        {/* Direct Home Navigation Header Link - Only show when NOT on Home page */}
        {!isHomePage && (
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            🏠 Home Feed
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-200/80 dark:border-slate-700/80"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {!user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 text-sm transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-xs cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/create")}
              className="bg-blue-600 dark:bg-blue-500 text-white px-3.5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer shadow-xs flex items-center gap-1"
            >
              <span>+</span> Create Post
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="font-semibold text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 px-3.5 py-2 rounded-full transition flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>👤</span> {user?.fullName || "User"} <span className="text-xs">▼</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-md">
                  {/* Home Button inside Dropdown - ONLY shown when NOT on Home page */}
                  {!isHomePage && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition cursor-pointer"
                      >
                        🏠 Home
                      </button>
                      <hr className="my-1 border-gray-100 dark:border-slate-700/60" />
                    </>
                  )}

                  {user?.role === "admin" && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/admin/dashboard");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition cursor-pointer"
                      >
                        🛡️ Admin Dashboard
                      </button>
                      <hr className="my-1 border-gray-100 dark:border-slate-700/60" />
                    </>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/my-posts");
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition cursor-pointer"
                  >
                    🖼️ My Posts
                  </button>

                  <hr className="my-1 border-gray-100 dark:border-slate-700/60" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium text-sm transition cursor-pointer"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
