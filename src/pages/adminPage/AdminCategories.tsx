import React, { useState, useEffect } from "react";
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSpinner,
  FaSearch,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";
import { toastError, toastSuccess } from "../../../utility/toast";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const AdminCategories: React.FC = () => {
  const { getCategories, createCategory, updateCategory, deleteCategory } =
    useEventContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (error) {
      toastError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setImagePreview(null);
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setImagePreview(category.image || null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toastError("Category name is required");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory._id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.success) {
        toastSuccess(
          `Category ${editingCategory ? "updated" : "created"} successfully`
        );
        fetchCategories();
        resetForm();
      } else {
        toastError(res.message);
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        toastSuccess("Category deleted successfully");
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (error) {
      toastError("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-64 p-8 pt-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaTags className="text-blue-600" />
              Manage Categories
            </h1>
            <p className="text-gray-600 mt-2">
              Create and organize event categories for your platform
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200"
          >
            <FaPlus />
            New Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search categories..."
            className="flex-1 outline-none text-gray-700 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">
              Loading your categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTags className="text-3xl text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">
              No categories found
            </h3>
            <p className="text-gray-500 mt-2">
              Start by creating your first event category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="relative h-48">
                  <img
                    src={category.image || "https://picsum.photos/400/300"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-white font-bold text-xl">
                      {category.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4 flex justify-between gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingCategory ? "Update Category" : "Create New Category"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Music, Tech, Business"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Image
                  </label>
                  <div className="relative group">
                    <div
                      className={`w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition ${
                        !imagePreview &&
                        "hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                              <FaCloudUploadAlt /> Change Image
                              <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3">
                          <div className="bg-blue-50 p-4 rounded-full">
                            <FaCloudUploadAlt className="text-3xl text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-500">
                            Click to upload image
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Create Category"
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

export default AdminCategories;
