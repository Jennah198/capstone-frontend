// src/pages/userPage/PaymentPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('telebirr');

  const orderSummary = {
    event: "Rophnan Concert",
    seat: "Section A, Row 5, Seat 12",
    date: "Dec 31, 2025 at 8:00 LT",
    ticketPrice: 1200,
    serviceFee: 50,
    total: 1250,
  };

  const paymentMethods = [
    { id: 'telebirr', label: 'TeleBirr', color: 'bg-blue-500' },
    { id: 'cbe', label: 'CBE', color: 'bg-yellow-500' },
    { id: 'mpessa', label: 'MPessa', color: 'bg-green-500' },
    { id: 'apollo', label: 'Apollo', color: 'bg-red-500' },
  ];

  const handlePayment = () => {
    // In real app: call API → on success:
    navigate('/ticket-success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-8">
          Event → Event Details → Select Seat → <span className="text-green-600 font-medium">Payment Details</span>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">Complete Your Payment</h1>
        <p className="text-center text-gray-600 mb-12">Finalize your Payments in a secure way</p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact & Payment */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  defaultValue="Tomas Melesse"
                  className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  defaultValue="+251 91234567890"
                  className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`py-6 rounded-2xl font-medium transition transform hover:scale-105 ${
                      selectedMethod === method.id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="bg-white rounded-2xl shadow p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-xl">{orderSummary.event}</p>
                <p>{orderSummary.seat}</p>
                <p className="text-sm text-gray-500">{orderSummary.date}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span className="font-medium">{orderSummary.serviceFee}ETB</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{orderSummary.total}ETB</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-full flex items-center justify-center gap-3 transition text-lg"
              >
                <FaCreditCard /> Pay {orderSummary.total}ETB Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;