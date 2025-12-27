// pages/UserOrdersPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaDownload,
  FaPrint,
  FaSearch,
  FaArrowLeft,
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { useEventContext } from '../../context/EventContext';

interface Ticket {
  _id: string;
  ticketType: string;
  ticketCode: string;
  isUsed: boolean;
}

interface EventInOrder {
  _id: string;
  title?: string;
  startDate?: string;
  venue?: { name?: string; city?: string };
}

interface Order {
  _id: string;
  orderNumber?: string;
  event?: EventInOrder;
  ticketType: string;
  quantity: number;
  totalAmount?: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  createdAt: string;
  tickets?: Ticket[];
}

const UserOrdersPage: React.FC = () => {
  const { BASE_URL, setUser } = useEventContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, { withCredentials: true });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
      } else {
        setError('Server not responding');
      }
    } finally {
      setLoading(false);
    }
  }; 

  const filteredOrders = orders.filter((order) => {
    if (filter !== 'all' && order.paymentStatus !== filter) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(lower) ||
        order.event?.title?.toLowerCase().includes(lower) ||
        order.event?.venue?.name?.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, any> = {
      paid: { text: 'Paid', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FaSpinner className="animate-spin" /> },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle /> },
    };
    return config[status] || config.pending;
  };

  const downloadAllTickets = async (orderId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tickets/download-tickets/${orderId}`, {
        withCredentials: true,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tickets-${orderId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Download failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-green-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-4"><FaArrowLeft /> Back</Link>
        <h1 className="text-3xl font-bold">My Orders</h1>

        {/* Filters, search, and orders list JSX as before */}
        {/* ... */}
      </div>
    </div>
  );
};

export default UserOrdersPage;