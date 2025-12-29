import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCreditCard, FaSpinner } from "react-icons/fa";
import { useEventContext } from "../../../context/EventContext";
import { toastError } from "../../../../utility/toast";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrder, pay, user } = useEventContext();

  // Data passed from seat selection or event detail
  const { eventId, ticketType, quantity, price, eventTitle } =
    location.state || {};

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("chapa");
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const serviceFee = 50;
  const total = (price || 0) * (quantity || 1) + serviceFee;

  useEffect(() => {
    if (!eventId) {
      toastError("Invalid checkout session. Redirecting...");
      navigate("/");
    }
  }, [eventId, navigate]);

  const paymentMethods = [
    { id: "chapa", label: "Chapa (Card/Telebirr/CBE)", color: "bg-green-600" },
  ];

  const handlePayment = async () => {
    if (!user) {
      toastError("Please login to continue payment");
      navigate("/login");
      return;
    }

    // Validate contact information
    if (!contactInfo.name.trim() || !contactInfo.phone.trim()) {
      toastError("Please fill in all contact information");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        eventId,
        ticketType,
        quantity,
        totalAmount: total,
      };

      const orderRes = await createOrder(orderData);

      if (orderRes.success) {
        const nameParts = contactInfo.name.trim().split(" ");
        const firstName = nameParts[0] || "User";
        const lastName = nameParts.slice(1).join(" ") || "User";

        const paymentData = {
          orderId: orderRes.order._id,
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          phone_number: contactInfo.phone.trim(),
        };

        const payRes = await pay(paymentData);

        if (payRes.success) {
          navigate("/ticket-success", {
            state: {
              order: payRes.order,
              tickets: payRes.tickets,
              event: payRes.event,
            },
          });
        } else {
          throw new Error("Payment failed");
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);

      let errorMessage = "Something went wrong. Try again.";

      if (err.response?.status === 409 && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!eventId) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-gray-500 mb-8">
          Event → Event Details →{" "}
          <span className="text-green-600 font-medium">Payment Details</span>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">
          Complete Your Payment
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Finalize your Payments in a secure way
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact & Payment */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid md:grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                    placeholder="Full Name"
                    className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                    className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`py-6 rounded-2xl font-medium transition transform hover:scale-105 ${
                      selectedMethod === method.id
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                <p className="font-bold text-xl">{eventTitle}</p>
                <p>
                  {quantity} {ticketType} Ticket(s)
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Tickets</span>
                  <span className="font-medium">
                    {(price || 0) * (quantity || 1)} ETB
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span className="font-medium">{serviceFee} ETB</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{total} ETB</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-full flex items-center justify-center gap-3 transition text-lg disabled:opacity-70"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  <FaCreditCard />
                )}
                {loading ? "Processing..." : `Pay ${total} ETB Now`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
