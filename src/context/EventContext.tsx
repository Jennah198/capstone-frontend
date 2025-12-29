import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

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
  updateEventPublishStatus: (
    eventId: string,
    isPublished: boolean
  ) => Promise<any>;
  getAllEvents: (params?: any) => Promise<any>; // Add getAllEvents

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
}

interface ApiProviderProps {
  children: ReactNode;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  // Auth
  const login = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, data, {
      withCredentials: true,
    });
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };

  const register = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, data, {
      withCredentials: true,
    });
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    const res = await axios.post(
      `${BASE_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    return res.data;
  };

  // Categories
  const getCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/get-category`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return { success: false, categories: [] };
    }
  };

  const getSingleCategory = async (id: string) => {
    const res = await axios.get(
      `${BASE_URL}/api/categories/get-single-category/${id}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const createCategory = async (formData: FormData) => {
    return (
      await axios.post(`${BASE_URL}/api/categories/create-category`, formData, {
        withCredentials: true,
      })
    ).data;
  };

  const updateCategory = async (id: string, formData: FormData) => {
    return (
      await axios.put(
        `${BASE_URL}/api/categories/update-category/${id}`,
        formData,
        { withCredentials: true }
      )
    ).data;
  };

  const deleteCategory = async (id: string) => {
    return (
      await axios.delete(`${BASE_URL}/api/categories/delete-category/${id}`, {
        withCredentials: true,
      })
    ).data;
  };

  // Venues
  const getVenues = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/venues/get-venue`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return { success: false, venues: [] };
    }
  };

  const getVenueById = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/api/venues/get-venueById/${id}`, {
      withCredentials: true,
    });
    return res.data;
  };

  const createVenue = async (formData: FormData) => {
    return (
      await axios.post(`${BASE_URL}/api/venues/create-venue`, formData, {
        withCredentials: true,
      })
    ).data;
  };

  const updateVenue = async (id: string, formData: FormData) => {
    return (
      await axios.put(`${BASE_URL}/api/venues/update-venue/${id}`, formData, {
        withCredentials: true,
      })
    ).data;
  };

  const deleteVenue = async (id: string) => {
    return (
      await axios.delete(`${BASE_URL}/api/venues/delete-venue/${id}`, {
        withCredentials: true,
      })
    ).data;
  };

  // Events
  const getEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/get-all-events`, {
        withCredentials: true,
      });
      return res.data.success && Array.isArray(res.data.events)
        ? res.data.events
        : [];
    } catch (err) {
      return [];
    }
  };

  const getEventById = async (id: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/events/get-eventById/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return { success: false };
    }
  };

  const getEventsByCategory = async (categoryId: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/events/get-eventByCategory/${categoryId}`,
        { withCredentials: true }
      );
      return res.data.success && Array.isArray(res.data.events)
        ? res.data.events
        : [];
    } catch (err) {
      return [];
    }
  };

  const getEventsByVenue = async (venueId: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/events/get-event-by-venue/${venueId}`,
        { withCredentials: true }
      );
      return res.data.success && Array.isArray(res.data.events)
        ? res.data.events
        : [];
    } catch (err) {
      return [];
    }
  };

  const createEvent = async (data: FormData) => {
    return (
      await axios.post(`${BASE_URL}/api/events/create-event`, data, {
        withCredentials: true,
      })
    ).data;
  };

  const updateEvent = async (id: string, formData: FormData) => {
    return (
      await axios.put(`${BASE_URL}/api/events/update-event/${id}`, formData, {
        withCredentials: true,
      })
    ).data;
  };

  const deleteEvent = async (id: string) => {
    return (
      await axios.delete(`${BASE_URL}/api/events/delete-event/${id}`, {
        withCredentials: true,
      })
    ).data;
  };

  const updateEventPublishStatus = async (
    eventId: string,
    isPublished: boolean
  ) => {
    return (
      await axios.put(
        `${BASE_URL}/api/admin/update-publish-status/${eventId}`,
        { isPublished },
        { withCredentials: true }
      )
    ).data;
  };

  const getAllEvents = async (params?: any) => {
    try {
      return (
        await axios.get(`${BASE_URL}/api/events/get-all-events`, {
          params,
          withCredentials: true,
        })
      ).data;
    } catch (err) {
      return { success: false, data: [] };
    }
  };

  // Orders
  const createOrder = async (data: any) => {
    return (
      await axios.post(`${BASE_URL}/api/orders/create-order`, data, {
        withCredentials: true,
      })
    ).data;
  };

  const getUserOrders = async () => {
    const res = await axios.get(`${BASE_URL}/api/orders/user-orders`, {
      withCredentials: true,
    });
    return res.data;
  };

  const getAllOrders = async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/get-orders`, {
      withCredentials: true,
    });
    return res.data.success ? res.data.orders : [];
  };

  const updateOrderStatus = async (id: string, status: string) => {
    return (
      await axios.put(
        `${BASE_URL}/api/admin/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      )
    ).data;
  };

  const deleteOrder = async (id: string) => {
    return (
      await axios.delete(`${BASE_URL}/api/admin/delete-order/${id}`, {
        withCredentials: true,
      })
    ).data;
  };

  // Payments
  const pay = async (data: any) => {
    return (
      await axios.post(`${BASE_URL}/api/payment/pay`, data, {
        withCredentials: true,
      })
    ).data;
  };

  const verifyPayment = async (tx_ref: string) => {
    return (
      await axios.get(`${BASE_URL}/api/payment/verify-payment/${tx_ref}`, {
        withCredentials: true,
      })
    ).data;
  };

  // Tickets
  const downloadOrderTickets = async (orderId: string): Promise<void> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/orders/download-tickets/${orderId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tickets-${orderId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Error downloading tickets:", err);
      throw err;
    }
  };

  // Admin
  const getDashboardStats = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/admin-dashboard-stats`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return { success: false };
    }
  };

  const getAllUsers = async () => {
    const res = await axios.get(`${BASE_URL}/api/auth/get-users`, {
      withCredentials: true,
    });
    return res.data.success ? res.data.users : [];
  };

  const changeUserRole = async (id: string, role: string) => {
    return (
      await axios.put(
        `${BASE_URL}/api/auth/change-role/${id}`,
        { role },
        { withCredentials: true }
      )
    ).data;
  };

  // Media
  const getMedia = async () => {
    const res = await axios.get(`${BASE_URL}/api/media/get-all`, {
      withCredentials: true,
    });
    return res.data;
  };

  const createMedia = async (formData: FormData) => {
    return (
      await axios.post(`${BASE_URL}/api/media/create`, formData, {
        withCredentials: true,
      })
    ).data;
  };

  const deleteMedia = async (id: string) => {
    return (
      await axios.delete(`${BASE_URL}/api/media/delete/${id}`, {
        withCredentials: true,
      })
    ).data;
  };

  const getUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res = await axios.get(`${BASE_URL}/api/auth/user-profile`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
        }
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
        getSingleCategory,
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
