// src/pages/userPage/SuppliersPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaCamera,
  FaPalette,
  FaMicrophone,
  FaChair,
  FaUtensils,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";

const SuppliersPage: React.FC = () => {
  const {
    user,
    getPopularSuppliers,
    getTrendingSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useEventContext();
  const isAdmin = user?.role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [supplierName, setSupplierName] = useState("");
  const [supplierCategory, setSupplierCategory] = useState("");
  const [supplierLocation, setSupplierLocation] = useState("");
  const [loading, setLoading] = useState(true);

  // Real data from API
  const [popularPhotographers, setPopularPhotographers] = useState<any[]>([]);
  const [trendingDesigners, setTrendingDesigners] = useState<any[]>([]);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const [popularRes, trendingRes] = await Promise.all([
        getPopularSuppliers(),
        getTrendingSuppliers(),
      ]);

      if (popularRes.success) {
        setPopularPhotographers(popularRes.suppliers);
      }
      if (trendingRes.success) {
        setTrendingDesigners(trendingRes.suppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "PHOTOGRAPHER / VIDEOGRAPHER", icon: <FaCamera /> },
    { name: "DECORATORS", icon: <FaPalette /> },
    { name: "VENUE PLANNERS", icon: <FaChair /> },
    { name: "CHOREOGRAPHERS", icon: <FaMicrophone /> },
    { name: "DESIGNERS", icon: <FaPalette /> },
    { name: "MAKEUP ARTIST", icon: <FaPalette /> },
    { name: "BAR SERVICES", icon: <FaUtensils /> },
  ];

  // Admin functions
  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierName("");
    setSupplierCategory("photographer");
    setSupplierLocation("");
    setShowModal(true);
  };

  const handleEditSupplier = (
    supplier: any,
    type: "photographer" | "designer"
  ) => {
    setEditingSupplier({ ...supplier, type });
    setSupplierName(supplier.name);
    setSupplierCategory(type);
    setSupplierLocation(supplier.location || "");
    setShowModal(true);
  };

  const handleDeleteSupplier = async (
    id: string,
    type: "photographer" | "designer"
  ) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      // Refresh data
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    }
  };

  const handleSaveSupplier = async () => {
    if (!supplierName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", supplierName);
      formData.append(
        "category",
        supplierCategory === "photographer" ? "photographer" : "designer"
      );
      formData.append("location", supplierLocation);
      formData.append(
        "isPopular",
        supplierCategory === "photographer" ? "true" : "false"
      );
      formData.append(
        "isTrending",
        supplierCategory === "designer" ? "true" : "false"
      );

      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, formData);
      } else {
        await createSupplier(formData);
      }

      setShowModal(false);
      setEditingSupplier(null);
      setSupplierName("");
      setSupplierCategory("");
      setSupplierLocation("");
      // Refresh data
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Failed to save supplier");
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/heroBg.jpg')`,
        }}
      >
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Suppliers</h1>

          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mt-10">
            <select className="px-6 py-4 bg-white text-gray-800 rounded-l-full md:rounded-l-full md:rounded-r-none">
              <option>Select Category</option>
            </select>
            <select className="px-6 py-4 bg-white text-gray-800 rounded-none hidden md:block">
              <option>Select Location</option>
            </select>
            <button className="bg-green-400 hover:bg-green-500 px-10 py-4 rounded-r-full font-medium transition">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Categories */}
        <h2 className="text-3xl font-bold mb-10">Suppliers Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-16">
          {categories.map((cat) => (
            <div key={cat.name} className="text-center">
              <div className="w-24 h-24 mx-auto bg-gray-200 border-2 border-dashed rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-gray-500">{cat.icon}</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Popular Photographers */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Popular Photographers / Videographers
            </h2>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={handleAddSupplier}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaPlus /> Add Supplier
                </button>
              )}
              <Link to="/" className="text-teal-600 hover:underline">
                View All (22)
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
                <span className="ml-4 text-gray-600">Loading suppliers...</span>
              </div>
            ) : popularPhotographers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No popular photographers found.</p>
                {isAdmin && (
                  <button
                    onClick={handleAddSupplier}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add First Supplier
                  </button>
                )}
              </div>
            ) : (
              popularPhotographers.map((supplier) => (
                <div
                  key={supplier._id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center relative"
                >
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() =>
                          handleEditSupplier(supplier, "photographer")
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSupplier(supplier._id, "photographer")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4" />
                  <h3 className="font-bold text-lg mb-2">{supplier.name}</h3>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderStars(supplier.rating)}
                  </div>
                  <p className="text-sm text-gray-600">
                    ({supplier.reviews} reviews)
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trending Designers */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Designers</h2>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => {
                    setSupplierCategory("designer");
                    handleAddSupplier();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaPlus /> Add Designer
                </button>
              )}
              <Link to="/" className="text-teal-600 hover:underline">
                View All (22)
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
                <span className="ml-4 text-gray-600">Loading designers...</span>
              </div>
            ) : trendingDesigners.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No trending designers found.</p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setSupplierCategory("designer");
                      handleAddSupplier();
                    }}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add First Designer
                  </button>
                )}
              </div>
            ) : (
              trendingDesigners.map((designer) => (
                <div
                  key={designer._id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center relative"
                >
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => handleEditSupplier(designer, "designer")}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSupplier(designer._id, "designer")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4" />
                  <h3 className="font-bold text-lg mb-2">{designer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {designer.location}
                  </p>
                  <div className="flex justify-center gap-1">
                    {renderStars(designer.rating)}
                  </div>
                  <p className="text-sm text-gray-600">
                    ({designer.reviews} reviews)
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gray-100 rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-8" />
            <h2 className="text-4xl font-bold mb-6">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
            <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-10 py-4 rounded-full transition">
              CTA
            </button>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={supplierCategory}
                  onChange={(e) => setSupplierCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="photographer">Photographer</option>
                  <option value="designer">Designer</option>
                </select>
              </div>

              {supplierCategory === "designer" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={supplierLocation}
                    onChange={(e) => setSupplierLocation(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Location"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveSupplier}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                {editingSupplier ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
