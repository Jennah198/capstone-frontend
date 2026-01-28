// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";
import { useEventContext } from "../context/EventContext";
import axios from "axios";

const Navbar: React.FC = () => {
  const { user, setUser, BASE_URL } = useEventContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Public links (shown when not logged in or regular user)
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  // Only shown to logged-in non-organizer/non-admin users
  const userOnlyLinks = [{ to: "/my-orders", label: "My Orders" }];

  // Pure organizer links — only these when role === "organizer"
  const organizerLinks = [
    { to: "/organizer", label: "My Events" },
    { to: "/organizer/venues", label: "Venues" },
    { to: "/organizer/categories", label: "Categories" },
    { to: "/organizer/analytics", label: "Analytics" },
  ];

  // Admin links
  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/admin-orders", label: "Orders" },
  ];

  // Decide navigation links based on role
  let navLinks = [...publicLinks];

  if (user) {
    if (user.role === "organizer") {
      navLinks = [...organizerLinks]; // ONLY organizer tabs — no public links
    } else if (user.role === "admin") {
      navLinks = [...adminLinks];
    } else {
      // Regular logged-in user
      navLinks = [...publicLinks, ...userOnlyLinks];
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      setUser(null);
      navigate("/");
      setIsOpen(false);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="EventX Home">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white font-extrabold shadow-sm">
              EX
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Event<span className="text-green-600">X</span>
              </h1>
              <p className="text-xs text-gray-500">Extraordinary Events</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive(link.to)
                      ? "text-green-700 bg-green-50 font-semibold"
                      : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                  }`}
                >
                  {link.icon && <span className="mr-1.5">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Auth / Profile (no search anymore) */}
          <div className="flex items-center gap-4">
            {/* Auth / Profile (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow ring-2 ring-white">
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <FaSignOutAlt size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-700 font-medium transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium shadow transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-gray-700 hover:text-green-700 p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-200 px-4 py-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${
                  isActive(link.to)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section (Mobile) */}
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 text-gray-800 font-medium hover:bg-gray-100 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;