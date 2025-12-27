// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaTimes, FaBars } from 'react-icons/fa';
import { useEventContext } from '../context/EventContext';
import axios from 'axios';

const Navbar: React.FC = () => {
  const { user, setUser, BASE_URL, getUserProfile } = useEventContext();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      await getUserProfile();
      setLoading(false);
    };
    fetchUser();
  }, [getUserProfile, location.pathname]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  // Public links — visible to everyone
  const publicLinks = [
    { to: '/', label: 'Home', icon: <FaHome /> }, // Only Home has icon
    { to: '/events', label: 'Events' },
    { to: '/suppliers', label: 'Suppliers' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/my-order', label: 'My Orders' },
  ];

  // Organizer-specific links
  const organizerLinks = [
    { to: '/organizer/event-list', label: 'My Events' },
    { to: '/organizer/venue-list', label: 'Venues' },
    { to: '/organizer/category-list', label: 'Categories' },
    { to: '/organizer/event-analytics', label: 'Analytics' },
  ];

  // Admin-specific links
  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/events', label: 'Events' },
    { to: '/admin/admin-orders', label: 'Orders' },
  ];

  // Choose which links to show based on user role
  let navigationLinks = publicLinks;

  if (user?.role === 'organizer') {
    // Show public links + organizer links inserted after Events
    navigationLinks = [
      ...publicLinks.slice(0, 2), // Home, Events
      ...organizerLinks,
      ...publicLinks.slice(2),    // Suppliers, About, Contact, Blog, My Orders
    ];
  } else if (user?.role === 'admin') {
    navigationLinks = adminLinks;
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout API failed, clearing locally');
    } finally {
      setUser(null);
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/');
      setIsOpen(false);
    }
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="w-40 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="hidden md:flex gap-8">
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Event<span className='text-gray-900'>X</span>
                </h1>
                <p className="text-[15px] text-gray-500">| Extraordinary Events</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {link.icon || null} {/* Only show icon if it exists (only Home has one) */}
                {link.label}
              </Link>
            ))}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-gray-300 pl-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role || 'guest'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 flex items-center gap-2 font-medium transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-3xl font-medium transition shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition ${
                  isActive(link.to)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {link.icon || null}
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-4 px-4 py-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name || 'User'}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role || 'guest'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 font-medium"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;