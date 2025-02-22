import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogIn, UserPlus , LogOut, Bell } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { getIsAuthenticated, logout } from "../redux/auth/authSlice";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector(getIsAuthenticated);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  useEffect(() => {
    if (isAuthenticated && isModalOpen) {
      setIsModalOpen(false);
      navigate("/dashboard");
    }
  }, [isAuthenticated, isModalOpen, navigate]);

  return (
    <div className="px-20 py-8 fixed w-full flex items-center justify-between z-10">
      <Link to="/">
        <h1 className="text-2xl font-bold">Lala</h1>
      </Link>
      <div
        onClick={toggleMenu}
        className="flex gap-3 bg-slate-100 p-2 cursor-pointer rounded-xl items-center"
      >
        <Menu className="w-6 h-6 cursor-pointer" />
        <div className="ml-4">
          {isAuthenticated ? (
            <div
              className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <User className="w-5 h-5" />
            </div>
          ) : (
            <button
              className="bg-gray-200 p-2 rounded-full cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Hamburger Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-24 right-20 bg-white shadow-lg rounded-lg p-4 z-20 w-48">
          <div className="flex flex-col space-y-3">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <div className="flex flex-col gap-2 items-center">
                <Link
                  to="/notification"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notification</span>
                </Link>
                <button
                  className="bg-red-400 text-white flex items-center gap-2 px-3 py-2 rounded-md w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>

                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
