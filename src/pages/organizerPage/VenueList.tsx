// pages/VenueList.tsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUsers, FaSpinner, FaPlus, FaImage, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEventContext } from '../../context/EventContext';

interface Venue {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
  image?: string;
}

const VenueList: React.FC = () => {
  const { BASE_URL, getVenues, deleteVenue } = useEventContext();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const res = await getVenues();
        if (res.success) {
          setVenues(res.venues || []);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [getVenues]);

  const handleDelete = async (venueId: string) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    setDeleteLoading(venueId);
    try {
      const res = await deleteVenue(venueId);
      if (res.success) setVenues(venues.filter(v => v._id !== venueId));
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Failed to delete venue');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCapacity = (capacity?: number) => {
    if (!capacity) return 'N/A';
    if (capacity >= 1000) return `${(capacity / 1000).toFixed(1)}k`;
    return capacity.toString();
  };

  const getCapacityBadge = (capacity?: number) => {
    if (!capacity) return 'bg-gray-100 text-gray-800';
    if (capacity >= 5000) return 'bg-red-100 text-red-800';
    if (capacity >= 2000) return 'bg-orange-100 text-orange-800';
    if (capacity >= 1000) return 'bg-yellow-100 text-yellow-800';
    if (capacity >= 500) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="mt-8 w-full flex justify-center items-center p-4 sm:p-8 pt-20">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Venue Management</h1>
            <p className="text-gray-600 mt-2">Manage all your event venues</p>
          </div>
          <Link
            to="/organizer/create-venue"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus />
            Add New Venue
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            <span className="ml-3 text-gray-600">Loading venues...</span>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <FaMapMarkerAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No venues found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first venue</p>
            <Link
              to="/organizer/create-venue"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <FaPlus />
              Create Venue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Venue Cards */}
            {venues.map((venue) => (
              <div key={venue._id} className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50 transition">
                {/* Left: Image & Name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {venue.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${venue.image}`}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/Placeholder.png';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                      <FaImage className="text-white text-xl" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{venue.name}</h3>
                    {venue.address && <p className="text-gray-600 text-sm truncate">{venue.address}</p>}
                  </div>
                </div>

                {/* Middle: Location & Capacity */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
                  <div className="flex items-center text-gray-700 gap-1 truncate">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                    <span className="text-sm truncate">
                      {venue.city && venue.country
                        ? `${venue.city}, ${venue.country}`
                        : venue.city || venue.country || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers className="text-blue-500 shrink-0" />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCapacityBadge(venue.capacity)}`}>
                      {formatCapacity(venue.capacity)}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2 justify-end">
                  <Link
                    to={`/organizer/update-venue/${venue._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(venue._id)}
                    disabled={deleteLoading === venue._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === venue._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
          <div>Showing {venues.length} venue{venues.length !== 1 ? 's' : ''}</div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-100"></div>Small (&lt;500)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-100"></div>Medium (500-1000)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-100"></div>Large (1k-2k)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-100"></div>Very Large (&gt;2k)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueList;
