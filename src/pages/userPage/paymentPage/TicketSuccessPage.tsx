// src/pages/userPage/TicketSuccessPage.tsx
import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaDownload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import axios from "axios";
import { useEventContext } from "../../../context/EventContext";

const TicketSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  const { BASE_URL } = useEventContext();

  const { order, tickets, event } = location.state || {};

  if (!event || !order || !tickets) {
    navigate("/");
    return null;
  }

  const ticket = tickets[0]; // Show first ticket

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tickets/${ticket._id}/download`,
        {
          withCredentials: true,
          responseType: "blob", // Important for downloading files
        }
      );

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Ticket-${ticket.ticketCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Event → Event Details → Select Seat → Payment Details →{" "}
          <span className="text-green-600 font-medium">Completion</span>
        </div>

        {/* Success Header */}
        <div className="text-center mb-10">
          <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Congratulations! Your Ticket Is Booked!
          </h1>
          <button
            onClick={handleDownload}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full flex items-center gap-3 mx-auto transition"
          >
            <FaDownload /> Download Ticket
          </button>
        </div>

        {/* Ticket Card */}
        <div
          ref={ticketRef}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border-4 border-green-200"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            {event.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            {/* Left - QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4">
                <QRCode value={ticket.ticketCode} size={160} />
              </div>
              <p className="text-center text-sm text-gray-500">
                Scan the QR code at the Event Entrance
              </p>
              <p className="mt-2 font-mono text-lg font-semibold">
                ID: {ticket.ticketCode}
              </p>
            </div>

            {/* Right - Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-medium">Date and Time</p>
                  <p className="text-gray-600">
                    {formatDate(event.date)} at {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">
                    {event.venue?.name}, {event.venue?.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaTicketAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Ticket Type</p>
                    <p className="text-gray-900 font-semibold">
                      {order.ticketType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <FaUser className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Ticket Code</p>
                    <p className="text-gray-900 font-semibold">
                      {ticket.ticketCode}
                    </p>
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
            <Link
              to="/my-order"
              className="text-green-600 hover:underline font-medium"
            >
              View My Tickets
            </Link>
          </div>
        </div>

        {/* Show all tickets if multiple */}
        {tickets.length > 1 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              You have {tickets.length} tickets. Download each one individually.
            </p>
            {tickets.map((t: any, index: number) => (
              <div key={t._id} className="inline-block mx-2">
                <button
                  onClick={() => {
                    // For multiple, perhaps need separate refs or something, but for now, download first
                    handleDownload();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Download Ticket {index + 1}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSuccessPage;
