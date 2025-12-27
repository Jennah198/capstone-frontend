// src/pages/userPage/SeatSelectionPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'reserved' | 'booked';
  price: number;
}

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Mock seat data
  const seats: Seat[] = [
    // Row A
    { id: 'A1', row: 'A', number: 1, status: 'booked', price: 1200 },
    { id: 'A2', row: 'A', number: 2, status: 'booked', price: 1200 },
    { id: 'A3', row: 'A', number: 3, status: 'available', price: 1200 },
    // ... more seats
    // I'll generate a realistic grid
  ];

  // Generate 4 rows x 12 seats
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D'];
    const generated: Seat[] = [];
    let id = 1;
    for (const row of rows) {
      for (let num = 1; num <= 12; num++) {
        let status: Seat['status'] = 'available';
        if ([1, 2, 6, 7, 11, 12].includes(num) && row === 'A') status = 'booked';
        if (num === 5 && row === 'B') status = 'reserved';
        if (num === 8 && row === 'C') status = 'reserved';
        generated.push({ id: `${row}${num}`, row, number: num, status, price: 1200 });
        id++;
      }
    }
    return generated;
  };

  const allSeats = generateSeats();

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;

    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, { ...seat, status: 'selected' }]);
    }
  };

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-sm text-gray-500 mb-8">
          Event → Event Details → <span className="text-green-600 font-medium">Select Seat</span> → Payment Details
        </div>

        <h1 className="text-4xl font-bold text-center mb-12">Select Your Seats</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Seat Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">STAGE</h3>
              <div className="h-12 bg-purple-100 rounded-t-lg"></div>
            </div>

            <div className="grid grid-cols-12 gap-2 max-w-3xl mx-auto">
              {allSeats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat)}
                  disabled={seat.status !== 'available' && seat.status !== 'selected'}
                  className={`aspect-square rounded-lg font-medium transition transform hover:scale-110 ${
                    seat.status === 'available' ? 'bg-green-500 hover:bg-green-600 text-white' :
                    seat.status === 'selected' ? 'bg-blue-600 text-white' :
                    seat.status === 'reserved' ? 'bg-yellow-500 text-black' :
                    'bg-red-600 text-white'
                  }`}
                >
                  {seat.number}
                </button>
              ))}
            </div>

            {/* Row Labels */}
            <div className="grid grid-cols-12 gap-2 mt-4 max-w-3xl mx-auto">
              {['A', 'B', 'C', 'D'].map(row => (
                <div key={row} className="col-span-3 text-center font-bold text-gray-700">
                  {row}
                </div>
              ))}
            </div>
          </div>

          {/* Legend & Selection */}
          <div className="space-y-8">
            {/* Legend */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-green-500 rounded"></div><span>Available</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-600 rounded"></div><span>Selected</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-yellow-500 rounded"></div><span>Reserved</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-600 rounded"></div><span>Booked</span></div>
              </div>
            </div>

            {/* Your Selection */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Your Selection</h3>
              {selectedSeats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No seats selected</p>
              ) : (
                <>
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium">Seat {seat.row}{seat.number}</p>
                        <p className="text-sm text-gray-500">Section A</p>
                      </div>
                      <p className="font-bold">{seat.price}ETB</p>
                    </div>
                  ))}

                  <div className="pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{total}ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees</span>
                      <span>50ETB</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-4 border-t">
                      <span>Total Price</span>
                      <span className="text-green-600">{total + 50}ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/payment')}
                    className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition"
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