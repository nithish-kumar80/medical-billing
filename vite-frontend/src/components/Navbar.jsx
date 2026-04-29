import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">

      <h1 className="font-bold">🏥 Med System</h1>

      <div className="flex items-center space-x-4">

        {user?.role === "admin" && (
          <>
            <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
            <Link to="/patients" className="hover:text-blue-300 transition">Patients</Link>
          </>
        )}

        {user?.role === "doctor" && (
          <Link to="/doctor-dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
        )}

        {user?.role === "patient" && (
          <Link to="/patient-portal" className="hover:text-blue-300 transition">My Portal</Link>
        )}

        {user && (
          <div className="flex items-center space-x-3 ml-4 border-l border-gray-700 pl-4">
            <span className="text-sm text-gray-400">
              {user.name} <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full ml-1">{user.role}</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;