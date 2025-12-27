// src/pages/userPage/TicketSuccessPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaUser } from 'react-icons/fa';

const TicketSuccessPage: React.FC = () => {
  // In real app, get this from context or location state
  const ticketData = {
    eventTitle: "Aster Awoke Grand Last Concert",
    date: "Saturday, December 31, 2025 at 8:00 LT",
    location: "Millennium Hall, Bole, Addis Ababa, Ethiopia",
    ticketType: "VIP Ticket",
    seat: "Section A, Row 5, Seat 12",
    ticketId: "1234-5678-9012",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Event → Event Details → Select Seat → Payment Details → <span className="text-green-600 font-medium">Completion</span>
        </div>

        {/* Success Header */}
        <div className="text-center mb-10">
          <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Congratulation Your Ticket Is Booked!</h1>
          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full flex items-center gap-3 mx-auto transition">
            <FaDownload /> Download Ticket
          </button>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">{ticketData.eventTitle}</h2>

          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            {/* Left - QR Placeholder */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 mb-4" />
              <p className="text-center text-sm text-gray-500">
                Scan the QR code at the Event Entrance
              </p>
              <p className="mt-2 font-mono text-lg">ID: {ticketData.ticketId}</p>
            </div>

            {/* Right - Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-medium">Date and Time</p>
                  <p className="text-gray-600">{ticketData.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">{ticketData.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaTicketAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Ticket Type</p>
                    <p className="text-gray-900 font-semibold">{ticketData.ticketType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <FaUser className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Seat Place</p>
                    <p className="text-gray-900 font-semibold">{ticketData.seat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="flex justify-center gap-8 text-center">
            <Link to="/" className="text-green-600 hover:underline font-medium">
              Browse More Events
            </Link>
            <Link to="/my-order" className="text-green-600 hover:underline font-medium">
              View My Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccessPage;