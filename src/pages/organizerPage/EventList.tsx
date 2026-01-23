// pages/EventList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaSearch,
  FaEdit,
  FaEye,
  FaTrash,
  FaSpinner,
  FaPlus,
  FaClock,
} from "react-icons/fa";
import { format, parseISO, isPast, isFuture } from "date-fns";
import { useEventContext } from "../../context/EventContext";

interface Category {
  _id?: string;
  id?: string;
  name: string;
}

interface Venue {
  name?: string;
}

interface NormalPrice {
  price: number;
}

interface Event {
  id: string;
  title: string;
  image?: string;
  category?: Category;
  venue?: Venue;
  normalPrice?: NormalPrice;
  startDate: string;
  endDate?: string;
  isPublished: boolean;
}

interface Filters {
  status: string;
  category: string;
  dateRange: string;
}

const EventList: React.FC = () => {
  const { BASE_URL, getAllEvents, getCategories, deleteEvent } =
    useEventContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    category: "",
    dateRange: "all",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm,
      };

      const res = await getAllEvents(params);
      if (res.success) {
        setEvents(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "all", category: "", dateRange: "all" });
    setSearchTerm("");
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy • hh:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getEventStatus = (event: Event): string => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    if (!event.isPublished) return "draft";
    if (isPast(startDate)) {
      if (endDate && isPast(endDate)) return "completed";
      return "ongoing";
    }
    if (isFuture(startDate)) return "upcoming";
    return "published";
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-blue-100 text-blue-800",
      upcoming: "bg-green-100 text-green-800",
      ongoing: "bg-yellow-100 text-yellow-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.draft;
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="ml-60 p-8 pt-20">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Events</h1>
            <p className="text-gray-600 mt-2">Manage all your events</p>
          </div>
          <Link
            to="/organizer/create-event"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus />
            Create New Event
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  placeholder="Search events by title..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="past">Past Events</option>
                <option value="future">Future Events</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first event
              </p>
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                <FaPlus />
                Create Event
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Event
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Venue
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Pricing
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => {
                      const status = getEventStatus(event);
                      return (
                        <tr
                          key={event.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-4">
                              {event.image && (
                                <img
                                  src={
                                    event.image.startsWith("http")
                                      ? event.image
                                      : `${BASE_URL}/uploads/${event.image}`
                                  }
                                  alt={event.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(
                                    e: React.SyntheticEvent<HTMLImageElement>
                                  ) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      "https://picsum.photos/150";
                                  }}
                                />
                              )}
                              <div>
                                <h4 className="font-medium text-gray-800 mb-1">
                                  {event.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {event.category?.name || "No category"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <FaTag className="text-gray-400" />
                              <span className="text-sm">
                                {event.category?.name || "—"}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              <span className="text-sm">
                                {event.venue?.name || "—"}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              {event.normalPrice &&
                              event.normalPrice.price > 0 ? (
                                <span className="text-sm">
                                  ${event.normalPrice.price}
                                </span>
                              ) : event.normalPrice &&
                                event.normalPrice.price === 0 ? (
                                <span className="text-sm text-green-600">
                                  Free
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                status
                              )}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/organizer/event-detail/${event.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View"
                              >
                                <FaEye />
                              </Link>
                              <Link
                                to={`/organizer/edit-event/${event.id}`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-200">
                {events.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <FaTag className="text-gray-400 text-xs" />
                            <span className="text-xs text-gray-600">
                              {event.category?.name || "No category"}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              status
                            )}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/organizer/edit-event/${event.id}`}
                            className="p-1 text-green-600"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-1 text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock />
                          <span className="text-xs">
                            {formatDate(event.startDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkerAlt />
                          <span className="text-xs">
                            {event.venue?.name || "No venue"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {event.normalPrice && event.normalPrice.price > 0 ? (
                            <span className="text-xs">
                              ${event.normalPrice.price}
                            </span>
                          ) : event.normalPrice &&
                            event.normalPrice.price === 0 ? (
                            <span className="text-xs text-green-600">Free</span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No price
                            </span>
                          )}
                        </div>

                        <div>
                          <Link
                            to={`/organizer/event-detail/${event.id}`}
                            className="text-blue-600 font-medium text-xs flex items-center gap-1"
                          >
                            View Details <FaEye className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {events.length > 0 && (
          <div className="mt-4 text-right text-sm text-gray-600">
            Showing {events.length} events
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
