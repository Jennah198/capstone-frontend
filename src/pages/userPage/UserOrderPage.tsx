// pages/UserOrdersPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
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
  const { getUserOrders, downloadOrderTickets } = useEventContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    const config: Record<string, any> = {
      paid: { text: 'Paid', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FaSpinner className="animate-spin" /> },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle /> },
    };
    return config[status] || config.pending;
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders();
        setOrders(data);
      } catch (err: any) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [getUserOrders]);
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

  const downloadAllTickets = async (orderId: string) => {
    try {
      await downloadOrderTickets(orderId);
    } catch {
      alert('Download failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-green-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-4"><FaArrowLeft /> Back</Link>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by order number or event..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => {
                  const status = getStatusBadge(order.paymentStatus);
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{order.event?.title || 'Unknown Event'}</div>
                        <div className="text-sm text-gray-500">#{order.orderNumber || order._id.slice(-8)}</div>
                        <div className="text-xs text-gray-400">{order.createdAt ? format(parseISO(order.createdAt), 'MMM dd, yyyy') : 'Recently'}</div>
                      </td>
                      <td className="px-6 py-4">{order.quantity} x {order.ticketType}</td>
                      <td className="px-6 py-4 font-bold">{order.totalAmount} ETB</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.icon} {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.paymentStatus === 'paid' && (
                          <button
                            onClick={() => downloadAllTickets(order._id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Download Tickets
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrdersPage;