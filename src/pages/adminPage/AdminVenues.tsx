import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaUsers,
  FaSpinner,
  FaSearch,
  FaTimes,
  FaCloudUploadAlt,
  FaGlobe,
} from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";
import { toastError, toastSuccess } from "../../../utility/toast";

interface Venue {
  _id: string;
  name: string;
  image?: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
}

const AdminVenues: React.FC = () => {
  const { getVenues, createVenue, updateVenue, deleteVenue } =
    useEventContext();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    capacity: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await getVenues();
      if (res.success) {
        setVenues(res.venues);
      }
    } catch (error) {
      toastError("Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", city: "", country: "", capacity: "" });
    setImage(null);
    setImagePreview(null);
    setEditingVenue(null);
    setShowModal(false);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address || "",
      city: venue.city || "",
      country: venue.country || "",
      capacity: venue.capacity?.toString() || "",
    });
    setImagePreview(venue.image || null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toastError("Venue name is required");

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, (formData as any)[key])
    );
    if (image) data.append("image", image);

    try {
      let res;
      if (editingVenue) {
        res = await updateVenue(editingVenue._id, data);
      } else {
        res = await createVenue(data);
      }

      if (res.success) {
        toastSuccess(
          `Venue ${editingVenue ? "updated" : "created"} successfully`
        );
        fetchVenues();
        resetForm();
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      const res = await deleteVenue(id);
      if (res.success) {
        toastSuccess("Venue deleted successfully");
        setVenues(venues.filter((v) => v._id !== id));
      }
    } catch (error) {
      toastError("Failed to delete venue");
    }
  };

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-64 p-8 pt-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaBuilding className="text-purple-600" />
              Manage Venues
            </h1>
            <p className="text-gray-600 mt-2">
              Add and manage locations where events take place
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <FaPlus />
            New Venue
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search by name or city..."
            className="flex-1 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-purple-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading venues...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-700">No venues found</h3>
            <p className="text-gray-500 mt-2">
              Start by adding a venue/location
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 relative group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={venue.image || "https://picsum.photos/400/300"}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {venue.name}
                  </h3>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-500" />
                      {venue.address}, {venue.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaGlobe className="text-purple-500" />
                      {venue.country}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUsers className="text-purple-500" />
                      Capacity: {venue.capacity}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(venue)}
                      className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-xl font-semibold hover:bg-purple-100 transition"
                    >
                      <FaEdit className="inline mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingVenue ? "Update Venue" : "Create New Venue"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Venue Image
                  </label>
                  <div className="relative group w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaCloudUploadAlt className="text-3xl text-gray-300" />
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : editingVenue ? (
                      "Update Venue"
                    ) : (
                      "Create Venue"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenues;
