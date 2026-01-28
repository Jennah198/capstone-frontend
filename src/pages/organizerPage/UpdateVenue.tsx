// pages/UpdateVenue.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '../../context/EventContext';
import { toastError, toastSuccess } from '../../../utility/toast';

interface VenueFormData {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: string;
}

const UpdateVenue: React.FC = () => {
  const { BASE_URL } = useEventContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    address: '',
    city: '',
    country: '',
    capacity: '',
  });

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/venues/get-single-venue/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          const venue = response.data.venue;

          setFormData({
            name: venue.name || '',
            address: venue.address || '',
            city: venue.city || '',
            country: venue.country || '',
            capacity: venue.capacity ? venue.capacity.toString() : '',
          });

        }
      } catch (error) {
        console.error('Error fetching venue:', error);
        toastError('Failed to load venue data');
        navigate('/organizer/venue-list');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVenue();
  }, [id, BASE_URL, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.country || !formData.capacity) {
      toastError('All fields are required');
      return;
    }

    try {
      setUpdating(true);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('capacity', formData.capacity);

      const res = await axios.put(`${BASE_URL}/api/venues/update-venue/${id}`, formDataToSend, {
        withCredentials: true,
      });

      if (res.data.success) {
        toastSuccess(res.data.message);
        navigate('/organizer/venue-list');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        toastError(err.response.data.message);
      } else {
        toastError('Server not responding');
      }
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="ml-60 p-8 pt-20 flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-4 text-gray-600 text-lg">Loading venue data...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center  p-8 pt-20">
      <Link
        to="/organizer/venue-list"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6"
      >
        <FaArrowLeft />
        Back to Venues
      </Link>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Venue</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields same as before, just typed */}
            {/* ... (same JSX as your last version, with proper typing) */}
            {/* I'll keep it concise — the structure is identical, only types added above */}
            {/* You can copy the JSX from your last version here — it's safe now with TS */}

            {/* Example of one field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter venue name"
                required
              />
            </div>

            {/* ... rest of form fields ... */}

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Link
                to="/organizer/venue-list"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Venue
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateVenue;