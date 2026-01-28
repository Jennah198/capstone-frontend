// src/pages/userPage/EventsPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";

interface Event {
  id: string;                    // ← matches backend ("id", not "_id")
  title: string;
  startDate: string;
  normalPrice: {                 // ← real pricing structure
    price: number;
    quantity: number;
  };
  vipPrice?: {                   // optional, but good to include
    price: number;
    quantity: number;
  };
  image?: string;
  venue?: {
    name: string;
    city?: string;               // optional, present in real data
  };
  isPublished?: boolean;
}

const EventsPage: React.FC = () => {
  const { getEvents, BASE_URL } = useEventContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("All Years");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [spaceFilter, setSpaceFilter] = useState("All Spaces");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const evts = await getEvents();
        console.log("Events fetched from backend:", evts);
        console.log("Number of events:", evts?.length || 0);
        setEvents(evts);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [getEvents]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/heroBg.jpg')`,
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold mb-6">Our Upcoming Events</h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <select className="px-6 py-4 rounded-l-full sm:rounded-l-full sm:rounded-r-none bg-white text-gray-800">
              <option>Select Category</option>
              <option>Music</option>
              <option>Festival</option>
              <option>Concert</option>
            </select>
            <select className="px-6 py-4 bg-white text-gray-800 sm:rounded-none">
              <option>Select Location</option>
              <option>Addis Ababa</option>
              <option>Bole</option>
              <option>Piassa</option>
            </select>
            <button className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-r-full font-medium flex items-center justify-center gap-3 transition">
              <FaSearch /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-6 py-3 border rounded-lg"
          >
            <option>All Years</option>
            <option>2025</option>
            <option>2026</option>
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-6 py-3 border rounded-lg"
          >
            <option>All Locations</option>
            <option>Addis Ababa</option>
            <option>Bahir Dar</option>
          </select>
          <select
            value={spaceFilter}
            onChange={(e) => setSpaceFilter(e.target.value)}
            className="px-6 py-3 border rounded-lg"
          >
            <option>All Spaces</option>
            <option>Indoor</option>
            <option>Outdoor</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-6 py-3 border rounded-lg flex items-center gap-2"
          >
            <option>All Ratings</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
          </select>
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition">
            Search
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="text-green-600 hover:underline">
              View All ({events.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No upcoming events found.
              </div>
            ) : (
              events.slice(0, 9).map((event) => (
                <Link
                  to={`/user-event-detail/${event.id}`}  // ← fixed: event.id
                  key={event.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                    <div className="relative">
                      <img
                        src={
                          event.image && event.image.startsWith("http")
                            ? event.image
                            : event.image
                            ? `${BASE_URL}/uploads/${event.image}`
                            : "https://picsum.photos/300/200"
                        }
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                          Explore
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-green-600 font-bold text-xl">
                        Price: {event.normalPrice?.price ?? "N/A"} ETB
                        {/* Optional: show VIP too → VIP: {event.vipPrice?.price ?? "N/A"} ETB */}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Popular Events */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Popular Events</h2>
            <Link to="/events" className="text-green-600 hover:underline">
              View All ({events.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No popular events found.
              </div>
            ) : (
              events.slice(0, 8).map((event) => (
                <Link
                  to={`/user-event-detail/${event.id}`}  // ← fixed: event.id
                  key={event.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow hover:shadow-xl transition">
                    <img
                      src={
                        event.image && event.image.startsWith("http")
                          ? event.image
                          : event.image
                          ? `${BASE_URL}/uploads/${event.image}`
                          : "https://picsum.photos/300/200"
                      }
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-t-2xl group-hover:scale-105 transition"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-green-600 font-bold mt-2">
                        Price: {event.normalPrice?.price ?? "N/A"} ETB
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination - static for now, can make dynamic later */}
          <div className="flex justify-center gap-2 mt-10">
            <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
              &lt;
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-full font-medium transition ${
                  page === 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
              &gt;
            </button>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-green-900 to-green-600 rounded-3xl p-12 text-white text-center mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Live Event"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Book Your Next Experience
              </h2>
              <p className="text-xl mb-8">
                Discover trending concerts, festivals, and nightlife moments.
              </p>
              <button className="bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition text-lg">
                Explore All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;