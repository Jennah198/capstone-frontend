// src/pages/userPage/UserEventDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaArrowLeft,
  FaDollarSign,
  FaUsers,
  FaClock,
  FaUser,
  FaShare,
  FaTicketAlt,
  FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { useEventContext } from '../../context/EventContext';

interface Organizer {
  name?: string;
  email?: string;
}

interface Venue {
  name?: string;
  city?: string;
  address?: string;
  capacity?: number;
}

interface Price {
  price?: number;
  quantity?: number;
}

interface Event {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  organizer?: Organizer;
  venue?: Venue;
  category?: { name: string };
  normalPrice?: Price;
  vipPrice?: Price;
  hasNormalTicket: boolean;
  hasVipTicket: boolean;
  totalTickets: number;
  ticketsSold: number;
  minPrice?: number;
}

const UserEventDetailPage: React.FC = () => {
  const { BASE_URL } = useEventContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // === MOCK DATA FOR DEMO (when no real event found) ===
  const mockEvents: Record<string, Event> = {
    "1": {
      _id: "1",
      title: "Aster Aweke Grand Last Concert",
      description: "Join us for an unforgettable night with the legendary Ethiopian singer Aster Aweke as she performs her greatest hits in a grand farewell concert. A once-in-a-lifetime musical experience filled with emotion, culture, and timeless melodies.",
      image: "https://images.unsplash.com/photo-1493676304819-0d7c9c9a1d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      startDate: "2025-12-31T20:00:00",
      isPublished: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      organizer: { name: "Chillux Events" },
      venue: { name: "Millennium Hall", city: "Addis Ababa", address: "Bole, Addis Ababa", capacity: 10000 },
      category: { name: "Concert" },
      normalPrice: { price: 1250 },
      vipPrice: { price: 2500 },
      hasNormalTicket: true,
      hasVipTicket: true,
      totalTickets: 10000,
      ticketsSold: 6780,
    },
    "2": {
      _id: "2",
      title: "Teddy Afro Live in Addis",
      description: "The king of Ethiopian music returns! Teddy Afro brings his powerful voice and inspiring lyrics to the stage for a night of unity, love, and celebration.",
      image: "https://images.unsplash.com/photo-1470229722913-1d039db7465b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      startDate: "2025-12-25T19:00:00",
      isPublished: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      organizer: { name: "Ethio Entertainment" },
      venue: { name: "Addis Ababa Stadium", city: "Addis Ababa", capacity: 30000 },
      normalPrice: { price: 1500 },
      vipPrice: { price: 3000 },
      hasNormalTicket: true,
      hasVipTicket: true,
      totalTickets: 30000,
      ticketsSold: 24500,
    },
    "3": {
      _id: "3",
      title: "Kassmasse New Year Concert",
      description: "Celebrate the New Year with the soulful voice of Kassmasse. A night of heartfelt music, joy, and celebration to welcome 2026!",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      startDate: "2025-12-31T21:00:00",
      isPublished: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      organizer: { name: "Music Ethiopia" },
      venue: { name: "Ghion Hotel", city: "Addis Ababa" },
      normalPrice: { price: 2000 },
      hasNormalTicket: true,
      hasVipTicket: false,
      totalTickets: 5000,
      ticketsSold: 3800,
    },
  };

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${BASE_URL}/api/events/get-eventById/${id}`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.event) {
        setEvent(response.data.event);
      } else {
        throw new Error('Event not found');
      }
    } catch (err: any) {
      console.warn('Real event not found, falling back to mock data for demo...');
      // === FALLBACK TO MOCK DATA ===
      const mockEvent = mockEvents[id as keyof typeof mockEvents];
      if (mockEvent) {
        setEvent(mockEvent);
        setError(''); // Clear error so page renders
      } else {
        setError('Event not found. Try a valid event ID (1, 2, or 3 for demo).');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return 'Date TBD';
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'hh:mm a');
    } catch {
      return 'Time TBD';
    }
  };

  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied!');
    }
  };

  const handleGetTicket = () => {
    navigate('/seat-selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <FaSpinner className="animate-spin text-green-600 text-4xl" />
        <span className="ml-4 text-gray-600 text-lg">Loading event details...</span>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">Event</Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900 font-medium">Event Details</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left - Image */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1493676304819-0d7c9c9a1d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <FaShare className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Music</span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Concert</span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Live</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Date and Time</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatDate(event.startDate)} at {formatTime(event.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaMapMarkerAlt className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Location</p>
                    <p className="text-xl font-bold text-gray-900">{event.venue?.name || 'TBD'}</p>
                    <p className="text-gray-600">{event.venue?.city}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 mb-12">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Regular</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {event.normalPrice?.price ? `${event.normalPrice.price}ETB` : 'Free'}
                  </p>
                </div>
                {event.vipPrice?.price && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">VIP</p>
                    <p className="text-3xl font-bold text-purple-600">{event.vipPrice.price}ETB</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGetTicket}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-6 rounded-full transition shadow-lg"
              >
                Get Ticket
              </button>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Event</h2>
                <p className="text-gray-700 leading-relaxed">
                  {event.description || 'Experience an amazing night of live music and entertainment.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEventDetailPage;