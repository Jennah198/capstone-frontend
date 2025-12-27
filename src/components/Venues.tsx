import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useEventContext } from '../context/EventContext';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Venue {
  _id: string;
  name: string;
  address: string;
  city: string;
  image: string;
  capacity?: number;
  description?: string;
}

const VenueList: React.FC = () => {
  const { BASE_URL } = useEventContext();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/venues/get-venue`, { withCredentials: true });
        if (response.data.success) {
          setVenues(response.data.venues || []);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch venues');
        console.log('Error fetching venues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const { current } = scrollRef;
    if (current) {
      if (direction === "left") {
        current.scrollBy({ left: -200, behavior: "smooth" });
      } else {
        current.scrollBy({ left: 200, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Popular Venue</h2>
        <div className="text-center py-12 text-gray-500">Loading venues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Popular Venue</h2>
        <div className="text-center py-12 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-3xl font-semibold mb-5'>Popular Venues</h1>
        <div className='flex gap-3 items-center'>
          <FaArrowLeft 
            onClick={() => handleScroll("right")} 
            className='cursor-pointer' 
            size={15} 
          />
          <FaArrowRight 
            onClick={() => handleScroll("left")} 
            className='cursor-pointer' 
            size={15} 
          />
        </div>
      </div>

      <div ref={scrollRef} className="category-container w-full flex gap-3 overflow-x-scroll">
        {venues && venues.length ? (
          venues.map((venue) => (
            <div
              key={venue._id}
              className="group flex-none rounded-md overflow-hidden bg-white transition"
            >
              <div className="relative h-60 w-60 overflow-hidden">
                <img
                  src={`${BASE_URL}/uploads/${venue.image}`}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1492684223066-e9e4a9c05c99?w=800&auto=format&fit=crop';
                  }}
                />
                <span 
                  onClick={() => navigate(`/events-by-venue/${venue._id}`)} 
                  className="absolute cursor-pointer bottom-3 right-3 text-sm font-semibold text-white bg-black/60 px-3 py-1 rounded-lg"
                >
                  Explore
                </span>
              </div>

              {/* Info */}
              <div className="p-4 overflow-hidden">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                  {venue.name?.length > 20 ? venue.name.substring(0, 20) + '...' : venue.name}
                </h3>
                <p className="text-sm text-gray-600">{venue.address}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No venues available.</p>
        )}
      </div>
    </section>
  );
};

export default VenueList;