import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaCalendarAlt,
  FaShoppingCart,
  FaDollarSign,
  FaSpinner,
  FaUser,
  FaUserTie,
  FaUserShield,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../../context/EventContext';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  image?: string;
  organizer?: User;
  category?: {
    name: string;
  };
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user?: User;
  event?: {
    title: string;
  };
  totalAmount?: number;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalOrders: number;
  totalCategories: number;
  totalVenues: number;
  totalRevenue: number;
  pendingOrders: number;
  publishedEvents: number;
  unpublishedEvents: number;
  totalTicketsSold: number;
  userRoles: {
    user?: number;
    admin?: number;
    organizer?: number;
  };
  recentOrders: Order[];
  recentEvents: Event[];
}

const AdminDashboardStats: React.FC = () => {
  const { getDashboardStats } = useEventContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getDashboardStats, navigate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-4 text-gray-600 text-lg">Loading Dashboard...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="ml-60 p-8 pt-20">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Overview of your event platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><FaUsers size={24} /></div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-500 font-medium">Total Users</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg text-green-600"><FaCalendarAlt size={24} /></div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalEvents}</span>
            </div>
            <p className="text-gray-500 font-medium">Total Events</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><FaShoppingCart size={24} /></div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-500 font-medium">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600"><FaDollarSign size={24} /></div>
              <span className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <p className="text-gray-500 font-medium">Total Revenue</p>
          </div>
        </div>

        {/* Roles Distribution & Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                <button onClick={() => navigate('/admin/admin-orders')} className="text-blue-600 hover:underline text-sm font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentOrders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber || order._id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.user?.name || 'Guest'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{formatCurrency(order.totalAmount || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* User Roles Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">User Roles</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium text-gray-700">Users</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.userRoles.user || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaUserTie className="text-green-600" />
                    <span className="font-medium text-gray-700">Organizers</span>
                  </div>
                  <span className="font-bold text-green-600">{stats.userRoles.organizer || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaUserShield className="text-red-600" />
                    <span className="font-medium text-gray-700">Admins</span>
                  </div>
                  <span className="font-bold text-red-600">{stats.userRoles.admin || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;