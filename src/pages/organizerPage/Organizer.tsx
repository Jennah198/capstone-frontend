// src/components/Organizer.tsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEventContext } from "../../context/EventContext";
import axios from "axios";
import { Menu } from "lucide-react";

const Organizer: React.FC = () => {
  const { user } = useEventContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
      if (res.data.success) navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { title: "Events", to: "/organizer" },
    { title: "Venues", to: "/organizer/venues" },
    { title: "Categories", to: "/organizer/categories" },
    { title: "Analytics", to: "/organizer/analytics" },
  ];

  return (
    <div className="w-full border-b bg-white fixed top-0 left-0 z-10 flex items-center justify-between px-4 sm:px-6 h-16">
      
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden sm:block">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex items-center gap-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `py-2 px-4 rounded hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            {tab.title}
          </NavLink>
        ))}

        {/* Logout Button on Desktop */}
        <button
          onClick={handleLogout}
          className="bg-blue-700 text-white px-3 py-1.5 rounded ml-4"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden flex items-center gap-2">
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-blue-700 text-white px-3 py-1.5 rounded"
        >
          Logout
        </button>
      </div>

      {/* Mobile Tabs Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t sm:hidden flex flex-col">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `py-3 px-4 hover:bg-gray-100 border-b ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {tab.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organizer;
