import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";

interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

const CategoriesPage: React.FC = () => {
  const { getCategories } = useEventContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                All Categories
              </h1>
            </div>
            <p className="text-gray-600">{categories.length} categories</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/events-by-category/${category._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-3 text-green-600 font-medium">
                    View Events →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
