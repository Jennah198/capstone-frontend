// src/pages/userPage/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

// Mock data for categories
const categories = [
  { name: "Weddings", image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Concerts", image: "https://images.unsplash.com/photo-1493676304819-0d7c9c9a1d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Dinner", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "After Work", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

// Mock venues
const venues = [
  { name: "MELINIUM HALL", location: "Addis Ababa", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Pelican Resort Debrezyet", location: "Debrezyet", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Bulbula Park", location: "ABU DHABI", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Commercial Tower Addis Ababa", location: "Addis Ababa", image: "https://images.unsplash.com/photo-1486406146925-7a1d2e9f5e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

// Mock upcoming events
const upcomingEvents = [
  { id: 1, title: "Mohammod Ahmed Concert", artist: "Mohammod Ahmed", date: "Wed, Dec 25", time: "6:00 LT", price: "2500ETB" },
  { id: 2, title: "Aster Aweke Grand Concert", artist: "Aster Aweke", date: "Wed, Dec 31", time: "8:00 LT", price: "3000ETB" },
  { id: 3, title: "Bermel Fest", artist: "Various Artists", date: "Jan 10", time: "7:00 LT", price: "1500ETB" },
  { id: 4, title: "Fendika / Melaku Fendika Events", artist: "Melaku Fendika", date: "Jan 15", time: "9:00 LT", price: "2000ETB" },
  { id: 5, title: "Rophnan", artist: "Rophnan", date: "Feb 1", time: "8:00 LT", price: "3500ETB" },
  { id: 6, title: "Chillux Special Event No.3", artist: "Surprise Guest", date: "Feb 14", time: "7:30 LT", price: "2800ETB" },
  { id: 7, title: "After Work Special Event", artist: "DJ Mix", date: "Every Friday", time: "6:00 LT", price: "1000ETB" },
  { id: 8, title: "Kassmasse Concert", artist: "Kassmasse", date: "Mar 8", time: "8:00 LT", price: "2500ETB" },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/heroBg.jpg')`,
        }}
      >
        <div className="text-start z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            Your Number One Choice for  <br /><span className="text-green-400">Extraordinary Events</span>
          </h1>
          <p></p>
          
        </div>
      </div>

      {/* Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Browse By Category</h2>
          <Link to="/categories-list" className="text-green-600 hover:underline">View All (10)</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link to={`/events-by-category/${cat.name.toLowerCase()}`} key={cat.name} className="group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover group-hover:scale-110 transition" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Venue */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Venue</h2>
          <Link to="/venues" className="text-green-600 hover:underline">View All (1000)</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {venues.map((venue) => (
            <Link to={`/events-by-venue/${venue.name.replace(/\s+/g, '-').toLowerCase()}`} key={venue.name}>
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow hover:shadow-xl transition">
                <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
                  <p className="text-gray-600">{venue.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Join the Vibe Banner */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 items-center">
            <img
              src="/heroBg.jpg"
              alt="Live Concert"
              className="w-full h-full object-cover"
            />
            <div className="p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Join the Vibe</h2>
              <p className="text-xl mb-8">Be part of Ethiopia's growing festival and concert culture.</p>
              <button className="bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition text-lg">
                Explore Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Link to="/events" className="text-green-600 hover:underline">View All (50)</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {upcomingEvents.map((event) => (
            <Link to={`/user-event-detail/${event.id}`} key={event.id}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="h-48 bg-gray-200 border-2 border-dashed rounded-t-2xl" />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.date}, {event.time}</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-full transition">
                    Get Ticket
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Reviews</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow">
            <p className="text-gray-700 mb-6">"Bermel Fest was insane! The energy, the crowd, the music — everything felt alive. I love how easy it was to get my ticket through this platform."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div>
                <p className="font-bold">Nahom</p>
                <p className="text-sm text-gray-500">Addis Ababa</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow">
            <p className="text-gray-700 mb-6">"I found Zema Festival here and ended up having the best weekend. Super smooth booking and clear event details. Definitely using this site again."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div>
                <p className="font-bold">Lidia M.</p>
                <p className="text-sm text-gray-500">Addis Ababa</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow">
            <p className="text-gray-700 mb-6">"Actually reliable — no fake events, no stress. 10/10 experience spot. This site is the real deal!"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div>
                <p className="font-bold">S. Hawassa</p>
                <p className="text-sm text-gray-500">Hawassa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Media */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Media</h2>
          <Link to="/media" className="text-green-600 hover:underline">View All (100)</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gradient-to-b from-green-400 to-green-500 rounded-2xl p-6 text-white">
              <div className="bg-gray-300 h-32 rounded-lg mb-4" />
              <p className="text-sm mb-2">LOREM IPSUM dolor sit amet, consectetur</p>
              <Link to="/media" className="text-sm underline hover:no-underline">Read More</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;