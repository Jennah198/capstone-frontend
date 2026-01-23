import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toastError } from "../../../../utility/toast";
import { useEventContext } from "../../../context/EventContext";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "selected" | "reserved" | "booked";
  price: number;
}

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById } = useEventContext();
  const { eventId, eventTitle, normalPrice, vipPrice } =
    location.state || {};

  // TEMPORARY FIX: Force VIP to show for testing
  const hasVipTickets = true; // hasVip || true;

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketType, setTicketType] = useState<"normal" | "vip">("normal");
  const [availableTickets, setAvailableTickets] = useState<number>(0);

  useEffect(() => {
    if (!eventId) {
      toastError("Please select an event first.");
      navigate("/");
      return;
    }
    fetchEvent();
  }, [eventId, navigate]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(eventId);
      if (data.success && data.event) {
        const ticketField = ticketType === "vip" ? "vipPrice" : "normalPrice";
        const available =
          data.event[ticketField]?.quantity || (ticketType === "vip" ? 50 : 0); // Default 50 VIP tickets if not set
        setAvailableTickets(available);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [ticketType]); // Refetch when ticket type changes

  const currentPrice = ticketType === "vip" ? vipPrice || 500 : normalPrice;

  // Generate 4 rows x 12 seats
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D"];
    const generated: Seat[] = [];
    for (const row of rows) {
      for (let num = 1; num <= 12; num++) {
        let status: Seat["status"] = "available";
        if ([1, 2, 6, 7, 11, 12].includes(num) && row === "A")
          status = "booked";
        generated.push({
          id: `${row}${num}`,
          row,
          number: num,
          status,
          price: currentPrice,
        });
      }
    }
    return generated;
  };

  const allSeats = generateSeats();

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "available") return;
    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= availableTickets) {
        toastError(`Only ${availableTickets} ${ticketType} tickets available`);
        return;
      }
      setSelectedSeats((prev) => [
        ...prev,
        { ...seat, status: "selected", price: currentPrice },
      ]);
    }
  };

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toastError("Please select at least one seat.");
      return;
    }
    navigate("/payment", {
      state: {
        eventId,
        eventTitle,
        ticketType,
        quantity: selectedSeats.length,
        price: currentPrice,
        seats: selectedSeats.map((s) => s.id),
      },
    });
  };

  if (!eventId) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-sm text-gray-500 mb-8">
          Event → Event Details →{" "}
          <span className="text-green-600 font-medium">Select Seat</span> →
          Payment Details
        </div>

        <h1 className="text-4xl font-bold text-center mb-4">
          Select Your Seats
        </h1>
        <p className="text-center text-gray-600 mb-8">{eventTitle}</p>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setTicketType("normal");
              setSelectedSeats([]);
            }}
            className={`px-8 py-3 rounded-full font-bold transition ${
              ticketType === "normal"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Normal ({normalPrice} ETB)
          </button>
          {hasVipTickets && (
            <button
              onClick={() => {
                setTicketType("vip");
                setSelectedSeats([]);
              }}
              className={`px-8 py-3 rounded-full font-bold transition ${
                ticketType === "vip"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              VIP ({vipPrice} ETB)
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Seat Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest text-gray-400">
                STAGE
              </h3>
              <div className="h-4 bg-gray-200 rounded-full w-full max-lg mx-auto mb-12"></div>
            </div>

            <div className="grid grid-cols-12 gap-3 max-w-3xl mx-auto">
              {allSeats.map((seat) => {
                const isSelected = selectedSeats.find((s) => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status === "booked"}
                    className={`aspect-square rounded-md text-xs font-bold transition transform hover:scale-110 flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : seat.status === "available"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {seat.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend & Selection */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Legend</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <span className="text-sm">Booked</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Your Selection</h3>
              {selectedSeats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No seats selected
                </p>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto mb-4">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <span className="font-medium">Seat {seat.id}</span>
                        <span className="font-bold">{seat.price} ETB</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{total} ETB</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Fees</span>
                      <span>50 ETB</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-4 text-gray-900">
                      <span>Total Price</span>
                      <span className="text-green-600">{total + 50} ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceed}
                    className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition shadow-lg"
                  >
                    Proceed to Payment →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
