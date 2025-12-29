import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  FaPlus,
  FaSpinner,
  FaCalendar,
  FaTag,
  FaMapMarkerAlt,
  FaImage,
  FaDollarSign,
  FaCrown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../../context/EventContext";
import { toastSuccess, toastError } from "../../../utility/toast";

interface Category {
  _id: string;
  name: string;
}

interface Venue {
  _id: string;
  name: string;
  city: string;
}

interface PriceData {
  price: string;
  quantity: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  venue: string;
  startDate: string;
  endDate: string;
  normalPrice: PriceData;
  vipPrice: PriceData;
  isPublished: boolean;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

const CreateEvent: React.FC = () => {
  const { getCategories, getVenues, createEvent } = useEventContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    venue: "",
    startDate: "",
    endDate: "",
    normalPrice: {
      price: "",
      quantity: "",
    },
    vipPrice: {
      price: "",
      quantity: "",
    },
    isPublished: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.success) setCategories(catRes.categories || []);

        const venueRes = await getVenues();
        if (venueRes.success) setVenues(venueRes.venues || []);
      } catch (error) {
        console.error("Error fetching categories/venues:", error);
      }
    };
    fetchData();
  }, [getCategories, getVenues]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const showMessage = (
    type: "success" | "error",
    text: string,
    duration = 3000
  ) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), duration);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as PriceData),
          [child]: value,
        },
      }));
    } else {
      const input = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: input.type === "checkbox" ? input.checked : value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showMessage("error", "Event title is required");
      return false;
    }
    if (!formData.startDate) {
      showMessage("error", "Start date is required");
      return false;
    }
    if (!formData.normalPrice.price) {
      showMessage("error", "Normal price is required");
      return false;
    }
    if (!formData.venue) {
      showMessage("error", "Venue is required");
      return false;
    }
    if (!formData.category) {
      showMessage("error", "Category is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append(
        "startDate",
        new Date(formData.startDate).toISOString()
      );
      if (formData.endDate)
        formDataToSend.append(
          "endDate",
          new Date(formData.endDate).toISOString()
        );

      formDataToSend.append(
        "normalPrice",
        JSON.stringify({
          price: parseFloat(formData.normalPrice.price),
          quantity: formData.normalPrice.quantity
            ? parseInt(formData.normalPrice.quantity)
            : undefined,
        })
      );

      formDataToSend.append(
        "vipPrice",
        JSON.stringify({
          price: parseFloat(formData.vipPrice.price),
          quantity: formData.vipPrice.quantity
            ? parseInt(formData.vipPrice.quantity)
            : undefined,
        })
      );

      formDataToSend.append("isPublished", formData.isPublished.toString());
      if (image) formDataToSend.append("image", image);

      const res = await createEvent(formDataToSend);
      if (res.success) {
        toastSuccess(res.message || "Event created successfully");
        navigate("/organizer/event-list");
      } else {
        showMessage("error", res.message || "Failed to create event");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Server error. Please try again.";
      showMessage("error", errorMsg);
      toastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-60 p-8 pt-20">
      <div className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Event
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create a new event
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-lg"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaTag className="text-blue-600" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Venue
                  </label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="">Select a venue</option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} - {v.city}
                      </option>
                    ))}
                  </select>
                  {venues.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      No venues available. Please{" "}
                      <a href="/organizer/create-venue" className="underline">
                        create a venue
                      </a>{" "}
                      first.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Pricing & Tickets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaDollarSign className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Normal Tickets
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (ETB)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ETB
                        </span>
                        <input
                          type="number"
                          name="normalPrice.price"
                          value={formData.normalPrice.price}
                          onChange={handleChange}
                          min="0"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Quantity
                      </label>
                      <input
                        type="number"
                        name="normalPrice.quantity"
                        value={formData.normalPrice.quantity}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Unlimited if empty"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaCrown className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      VIP Tickets
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (ETB)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ETB
                        </span>
                        <input
                          type="number"
                          name="vipPrice.price"
                          value={formData.vipPrice.price}
                          onChange={handleChange}
                          min="0"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Quantity
                      </label>
                      <input
                        type="number"
                        name="vipPrice.quantity"
                        value={formData.vipPrice.quantity}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Unlimited if empty"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload & Publishing Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaImage className="text-blue-600" />
                    Event Image
                  </h3>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto max-w-full max-h-32 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <FaImage className="text-blue-600 text-xl" />
                        </div>
                      )}
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      {image && (
                        <p className="text-sm text-green-600">
                          Image selected: {image.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Publishing
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          Publish Event
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Make visible to public immediately
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 min-w-[160px]"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Event
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

export default CreateEvent;
