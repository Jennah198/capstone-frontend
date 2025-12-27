import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

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
  getUserProfile: () => Promise<void>;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ApiProviderProps {
  children: ReactNode;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const BASE_URL = "https://event-management-server-br57.onrender.com";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/user-profile`, { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          // Don't navigate here to avoid redirect loops when other components call getUserProfile automatically.
          // We still clear the local user so UI knows auth is not established.
          setUser(null);
        }
      } else {
        console.log("Server is not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <ApiContext.Provider value={{ 
      BASE_URL, 
      user, 
      setUser, 
      isSidebarVisible, 
      getUserProfile, 
      setIsSidebarVisible 
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useEventContext = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an ApiProvider');
  }
  return context;
};