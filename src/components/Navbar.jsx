import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-extrabold text-blue-600 tracking-tight cursor-pointer"
      >
        Postify
      </h1>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => navigate("/Create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
        >
          + Create Post
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="font-semibold text-gray-700 hover:text-blue-600 bg-gray-100 px-4 py-2 rounded-full transition flex items-center gap-2"
          >
            {user?.fullName} <span className="text-xs">▼</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/my-posts");
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                My Posts
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
