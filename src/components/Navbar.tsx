// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaTimes, FaBars, FaSearch } from "react-icons/fa";
import { useEventContext } from "../context/EventContext";
import axios from "axios";

const Navbar: React.FC = () => {
  const { user, setUser, BASE_URL } = useEventContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path);

  // Public links — visible to everyone
  const publicLinks = [
    { to: "/", label: "Home", icon: <FaHome /> }, // Only Home has icon
    { to: "/events", label: "Events" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/my-order", label: "My Orders" },
  ];

  // Organizer-specific links
  const organizerLinks = [
    { to: "/organizer/event-list", label: "My Events" },
    { to: "/organizer/venue-list", label: "Venues" },
    { to: "/organizer/category-list", label: "Categories" },
    { to: "/organizer/event-analytics", label: "Analytics" },
  ];

  // Admin-specific links
  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/admin-orders", label: "Orders" },
  ];

  // Choose which links to show based on user role
  let navigationLinks = publicLinks;

  if (user?.role === "organizer") {
    // Show public links + organizer links inserted after Events
    navigationLinks = [
      ...publicLinks.slice(0, 2), // Home, Events
      ...organizerLinks,
      ...publicLinks.slice(2), // Suppliers, About, Contact, Blog, My Orders
    ];
  } else if (user?.role === "admin") {
    navigationLinks = adminLinks;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Logout API failed, clearing locally");
    } finally {
      setUser(null);
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
      setIsOpen(false);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 shadow-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-none">
            <Link to="/" className="flex items-center gap-3" aria-label="Home">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white font-extrabold shadow-sm">
                  EX
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                    Event<span className="text-green-600">X</span>
                  </h1>
                  <p className="text-xs text-gray-500 hidden md:block">Extraordinary Events</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex md:items-center md:flex-1 md:justify-center">
            <div className="flex items-center space-x-6 whitespace-nowrap">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  {link.icon && <span className="mr-1">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right actions: search + auth */}
          <div className="flex items-center gap-4 flex-none">
            <div className="hidden md:flex items-center border border-gray-200 rounded-lg px-2 py-1 bg-white shadow-sm">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                aria-label="Search events"
                placeholder="Search events, venues..."
                className="outline-none text-sm text-gray-700 placeholder:text-gray-400 w-60"
              />
            </div>

            {/* Auth Section (desktop) */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white ring-offset-2 hover:scale-105 transition-transform duration-200">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{user.name || "User"}</span>
                      <span className="text-xs text-gray-500 uppercase">{user.role || "Member"}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 p-2.5 rounded-full transition-all duration-300"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-2 rounded-full font-semibold shadow">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-green-600 p-2"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden transform origin-top transition-all ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-white border-t border-gray-200 px-4 pt-4 pb-6">
          <div className="mb-3">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input aria-label="Search mobile" placeholder="Search events" className="w-full outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition ${
                  isActive(link.to)
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {link.icon || null}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            {user ? (
              <>
                <div className="flex items-center gap-4 px-4 py-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name || "User"}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role || "guest"}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 font-medium">
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium mt-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
