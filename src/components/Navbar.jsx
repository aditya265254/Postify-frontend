import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, User, LogOut, Image, ShieldCheck, Plus, ChevronDown, Home } from "lucide-react";
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
    }
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <nav className="bg-white/95 dark:bg-[#090D1A]/95 border-b border-slate-200/80 dark:border-[#1C2A4A] backdrop-blur-md px-4 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300 shadow-xs">
      <div className="flex items-center gap-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tight cursor-pointer"
        >
          Postify
        </h1>

        {!isHomePage && (
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-[#141D33] hover:bg-slate-200 dark:hover:bg-[#1C2A4A]"
          >
            <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Home
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#141D33] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1C2A4A] transition cursor-pointer flex items-center justify-center w-10 h-10 border border-slate-200/80 dark:border-[#1C2A4A]"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {!user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-700 dark:text-slate-300 font-semibold hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#141D33] border border-slate-200/80 dark:border-[#1C2A4A] px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer text-sm"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" /> {user?.fullName || "User"} <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 pt-2 w-52 z-50">
                <div className="bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] rounded-xl shadow-xl py-1.5 backdrop-blur-md">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/create");
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141D33] font-medium text-sm transition cursor-pointer rounded-xl"
                  >
                    <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Create Post
                  </button>

                  <hr className="my-1 border-slate-100 dark:border-[#1C2A4A]" />

                  {!isHomePage && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141D33] font-medium text-sm transition cursor-pointer rounded-xl"
                      >
                        <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Home
                      </button>
                      <hr className="my-1 border-slate-100 dark:border-[#1C2A4A]" />
                    </>
                  )}

                  {user?.role === "admin" && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/admin/dashboard");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141D33] font-medium text-sm transition cursor-pointer rounded-xl"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Admin Dashboard
                      </button>
                      <hr className="my-1 border-slate-100 dark:border-[#1C2A4A]" />
                    </>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/my-posts");
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141D33] font-medium text-sm transition cursor-pointer rounded-xl"
                  >
                    <Image className="w-4 h-4 text-slate-500 dark:text-slate-400" /> My Posts
                  </button>

                  <hr className="my-1 border-slate-100 dark:border-[#1C2A4A]/60" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium text-sm transition cursor-pointer rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


