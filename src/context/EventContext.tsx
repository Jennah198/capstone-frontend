import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios, { AxiosError } from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  profilePicture?: string;
  [key: string]: any;
}

interface ApiContextType {
  BASE_URL: string;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isSidebarVisible: boolean;
  isLoadingProfile: boolean;
  getUserProfile: () => Promise<void>;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;

  // Auth
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<any>;

  // Categories
  getCategories: () => Promise<any>;
  getSingleCategory: (id: string) => Promise<any>;
  createCategory: (formData: FormData) => Promise<any>;
  updateCategory: (id: string, formData: FormData) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;

  // Venues
  getVenues: () => Promise<any>;
  getVenueById: (id: string) => Promise<any>;
  createVenue: (formData: FormData) => Promise<any>;
  updateVenue: (id: string, formData: FormData) => Promise<any>;
  deleteVenue: (id: string) => Promise<any>;

  // Events
  getEvents: () => Promise<any[]>;
  getEventById: (id: string) => Promise<any>;
  getEventsByCategory: (categoryId: string) => Promise<any[]>;
  getEventsByVenue: (venueId: string) => Promise<any[]>;
  createEvent: (formData: FormData) => Promise<any>;
  updateEvent: (id: string, formData: FormData) => Promise<any>;
  deleteEvent: (id: string) => Promise<any>;
  updateEventPublishStatus: (eventId: string, isPublished: boolean) => Promise<any>;
  getAllEvents: (params?: any) => Promise<any>;

  // Orders
  createOrder: (data: any) => Promise<any>;
  getUserOrders: () => Promise<any>;
  getAllOrders: () => Promise<any[]>;
  updateOrderStatus: (id: string, status: string) => Promise<any>;
  deleteOrder: (id: string) => Promise<any>;

  // Payments
  pay: (data: any) => Promise<any>;
  verifyPayment: (tx_ref: string) => Promise<any>;

  // Tickets
  downloadOrderTickets: (orderId: string) => Promise<void>;

  // Admin
  getDashboardStats: () => Promise<any>;
  getAllUsers: () => Promise<any[]>;
  changeUserRole: (id: string, role: string) => Promise<any>;

  // Media
  getMedia: () => Promise<any>;
  createMedia: (formData: FormData) => Promise<any>;
  deleteMedia: (id: string) => Promise<any>;

  // Suppliers
  getAllSuppliers: () => Promise<any>;
  getPopularSuppliers: () => Promise<any>;
  getTrendingSuppliers: () => Promise<any>;
  createSupplier: (formData: FormData) => Promise<any>;
  updateSupplier: (id: string, formData: FormData) => Promise<any>;
  deleteSupplier: (id: string) => Promise<any>;
}

interface ApiProviderProps {
  children: ReactNode;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  // Auth
  const login = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, data, { withCredentials: true });
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };

  const register = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, data, { withCredentials: true });
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    return res.data;
  };

  // Categories
  const getCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/get-category`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getCategories error:", err);
      return { success: false, categories: [] };
    }
  };

  const getSingleCategory = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/get-single-category/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getSingleCategory error:", err);
      return { success: false, category: null };
    }
  };

  const createCategory = async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/categories/create-category`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("createCategory error:", err);
      throw err;
    }
  };

  const updateCategory = async (id: string, formData: FormData) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/categories/update-category/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("updateCategory error:", err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/categories/delete-category/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteCategory error:", err);
      throw err;
    }
  };

  // Venues
  const getVenues = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/venues/get-venue`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getVenues error:", err);
      return { success: false, venues: [] };
    }
  };

  const getVenueById = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/venues/get-venueById/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getVenueById error:", err);
      return { success: false };
    }
  };

  const createVenue = async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/venues/create-venue`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("createVenue error:", err);
      throw err;
    }
  };

  const updateVenue = async (id: string, formData: FormData) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/venues/update-venue/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("updateVenue error:", err);
      throw err;
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/venues/delete-venue/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteVenue error:", err);
      throw err;
    }
  };

  // Events
  const getEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/events/get-all-events`);
      return response.data?.data || response.data || [];
    } catch (err) {
      console.error("getEvents error:", err);
      return [];
    }
  };

  const getEventById = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/get-eventById/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getEventById error:", err);
      return { success: false };
    }
  };

  const getEventsByCategory = async (categoryId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/get-eventByCategory/${categoryId}`, { withCredentials: true });
      return res.data.success && Array.isArray(res.data.events) ? res.data.events : [];
    } catch (err) {
      console.error("getEventsByCategory error:", err);
      return [];
    }
  };

  const getEventsByVenue = async (venueId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/get-event-by-venue/${venueId}`, { withCredentials: true });
      return res.data.success && Array.isArray(res.data.events) ? res.data.events : [];
    } catch (err) {
      console.error("getEventsByVenue error:", err);
      return [];
    }
  };

  const createEvent = async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/events/create-event`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("createEvent error:", err);
      throw err;
    }
  };

  const updateEvent = async (id: string, formData: FormData) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/events/update-event/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("updateEvent error:", err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/events/delete-event/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteEvent error:", err);
      throw err;
    }
  };

  const updateEventPublishStatus = async (eventId: string, isPublished: boolean) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/update-publish-status/${eventId}`,
        { isPublished },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("updateEventPublishStatus error:", err);
      throw err;
    }
  };

  const getAllEvents = async (params?: any) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/get-all-events`, {
        params,
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("getAllEvents error:", err);
      return { success: false, data: [] };
    }
  };

  // Orders
  const createOrder = async (data: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/create-order`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("createOrder error:", err);
      throw err;
    }
  };

  const getUserOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/user-orders`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getUserOrders error:", err);
      return [];
    }
  };

  const getAllOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/get-orders`, { withCredentials: true });
      return res.data.success ? res.data.orders : [];
    } catch (err) {
      console.error("getAllOrders error:", err);
      return [];
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/admin/delete-order/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteOrder error:", err);
      throw err;
    }
  };

  // Payments
  const pay = async (data: any) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/payment/pay`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("pay error:", err);
      throw err;
    }
  };

  const verifyPayment = async (tx_ref: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/payment/verify-payment/${tx_ref}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("verifyPayment error:", err);
      throw err;
    }
  };

  // Tickets
  const downloadOrderTickets = async (orderId: string): Promise<void> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/download-tickets/${orderId}`, {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tickets-${orderId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("downloadOrderTickets error:", err);
      throw err;
    }
  };

  // Admin
  const getDashboardStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/admin-dashboard-stats`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getDashboardStats error:", err);
      return { success: false };
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/get-users`, { withCredentials: true });
      return res.data.success ? res.data.users : [];
    } catch (err) {
      console.error("getAllUsers error:", err);
      return [];
    }
  };

  const changeUserRole = async (id: string, role: string) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/auth/change-role/${id}`, { role }, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("changeUserRole error:", err);
      throw err;
    }
  };

  // Media
  const getMedia = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/media/get-all`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("getMedia error:", err);
      return [];
    }
  };

  const createMedia = async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/media/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("createMedia error:", err);
      throw err;
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/media/delete/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteMedia error:", err);
      throw err;
    }
  };

  // Suppliers
  const getAllSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers/all`);
      return res.data;
    } catch (err) {
      console.error("getAllSuppliers error:", err);
      return [];
    }
  };

  const getPopularSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers/popular`);
      return res.data;
    } catch (err) {
      console.error("getPopularSuppliers error:", err);
      return [];
    }
  };

  const getTrendingSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers/trending`);
      return res.data;
    } catch (err) {
      console.error("getTrendingSuppliers error:", err);
      return [];
    }
  };

  const createSupplier = async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/suppliers/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("createSupplier error:", err);
      throw err;
    }
  };

  const updateSupplier = async (id: string, formData: FormData) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/suppliers/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("updateSupplier error:", err);
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/suppliers/delete/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("deleteSupplier error:", err);
      throw err;
    }
  };

  // User Profile
  const getUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res = await axios.get(`${BASE_URL}/api/auth/user-profile`, { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        setUser(null);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        BASE_URL,
        user,
        setUser,
        isSidebarVisible,
        isLoadingProfile,
        getUserProfile,
        setIsSidebarVisible,

        login,
        register,
        logout,

        getCategories,
        getSingleCategory,              // ← now included (fixes your error)
        createCategory,
        updateCategory,
        deleteCategory,

        getVenues,
        getVenueById,
        createVenue,
        updateVenue,
        deleteVenue,

        getEvents,
        getEventById,
        getEventsByCategory,
        getEventsByVenue,
        createEvent,
        updateEvent,
        deleteEvent,
        updateEventPublishStatus,
        getAllEvents,

        createOrder,
        getUserOrders,
        getAllOrders,
        updateOrderStatus,
        deleteOrder,

        pay,
        verifyPayment,

        downloadOrderTickets,

        getDashboardStats,
        getAllUsers,
        changeUserRole,

        getMedia,
        createMedia,
        deleteMedia,

        getAllSuppliers,
        getPopularSuppliers,
        getTrendingSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useEventContext = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useEventContext must be used within an ApiProvider");
  }
  return context;
};