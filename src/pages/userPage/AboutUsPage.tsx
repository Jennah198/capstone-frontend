// src/pages/userPage/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaUsers, FaCalendarCheck, FaStar } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">We are Event<span className='text-green-600'>X</span></h1>
          <p className="text-2xl md:text-3xl font-light">We bring dream Events to life!</p>
        </div>
      </div>

      {/* About Us Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              EventX is Ethiopia's premier event discovery and ticketing platform, dedicated to connecting people with extraordinary experiences. From world-class concerts and cultural festivals to intimate gatherings and corporate events, we make it seamless to find, book, and enjoy the moments that matter.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded with a passion for live entertainment and community, we believe every event should be accessible, secure, and unforgettable. Our platform empowers organizers to reach wider audiences while giving attendees a trusted, user-friendly way to discover events tailored to their interests.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're planning your next night out or organizing a major concert, EventX is here to make it happen — effortlessly and with joy.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/bgImg (1).jpg"
              alt="Live Event"
              className="rounded-2xl shadow-2xl w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold">10,000+</p>
              <p className="text-xl mt-2">Event Vendors</p>
            </div>
            <div>
              <p className="text-5xl font-bold">20,000+</p>
              <p className="text-xl mt-2">Annual Events</p>
            </div>
            <div>
              <p className="text-5xl font-bold">1,000+</p>
              <p className="text-xl mt-2">Event Venues</p>
            </div>
            <div>
              <p className="text-5xl font-bold">1.5M+</p>
              <p className="text-xl mt-2">Monthly Followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What We Offer?</h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/bgImgg.jpg"
              alt="Artist Performing"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Who We Are?</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We are a passionate team of event enthusiasts, tech innovators, and experience creators dedicated to transforming how Ethiopia discovers and enjoys live events. Our mission is to make every moment count — from the first ticket purchase to the final encore.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With secure payments, real-time seat selection, instant ticket delivery, and a curated selection of the best events, EventX is more than a platform — it's your gateway to unforgettable memories.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 items-center">
            <img
              src="/heroBg.jpg"
              alt="Crowd at Concert"
              className="w-full h-full object-cover"
            />
            <div className="p-12 text-white text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-6">Get Tickets Instantly</h2>
              <p className="text-xl mb-8">Fast, secure, and stress-free booking for every event.</p>
              <Link
                to="/events"
                className="inline-block bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition text-lg"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;