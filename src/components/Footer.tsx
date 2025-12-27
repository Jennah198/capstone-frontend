// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaCalendarAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4 text-center">
              <h3 className="text-2xl font-bold">Event<span className='text-green-600 text-3xl'>X</span></h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your gateway to extraordinary events. Discover, book, and experience unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
              <li><Link to="/events" className="hover:text-green-400 transition">All Events</Link></li>
              <li><Link to="/my-order" className="hover:text-green-400 transition">My Orders</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-green-400 transition">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-green-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                <FaYoutube />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 EventX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;