import React from 'react';
import { CalendarDays, Users, CreditCard } from 'lucide-react';

const BookingCard = ({ booking }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'bg-green-500',
      PENDING: 'bg-yellow-500',
      CANCELLED: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with title, location, and status */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{booking.property.title}</h3>
            <p className="text-sm text-gray-500">{booking.property.location}</p>
          </div>
          <div className="flex flex-col gap-2">

          <span className={`${getStatusColor(booking.status)} px-3 py-1 rounded-full text-xs font-medium text-white`}>
            {booking.status}
          </span>
          <span className={`bg-red-400 px-3 py-1 rounded-full text-xs font-medium text-white`}>
            CANCEL
          </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-4">
        {/* Property image */}
        <img
          src={booking.property.images[0]}
          alt={booking.property.title}
          className="w-full h-48 object-cover rounded-md"
        />

        {/* Booking dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Check-in</p>
              <p className="text-sm text-gray-900">{formatDate(booking.checkIn)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Check-out</p>
              <p className="text-sm text-gray-900">{formatDate(booking.checkOut)}</p>
            </div>
          </div>
        </div>

        {/* Guest count and price */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{booking.numberOfGuests} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer with amenities */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {booking.property.amenities.map((amenity, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white text-xs font-medium text-gray-600 rounded-full border"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;