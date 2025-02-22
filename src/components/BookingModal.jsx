import React, { useState, useEffect } from "react";
import { createBooking } from "../redux/bookings/bookingsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBookingLoading,
  selectBookingError,
} from "../redux/bookings/bookingsSlice";
import { XCircle } from "lucide-react";
import { notifyError, notifySuccess } from "../utils/notification";

const BookingModal = ({ property, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const isReduxLoading = useSelector(selectBookingLoading);
  const reduxError = useSelector(selectBookingError);

  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
  });
  const [guestCount, setGuestCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    generateCalendar();
  }, []);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const generateCalendar = () => {
    const today = new Date();
    const months = [];

    for (let i = 0; i < 2; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const days = [];
      const daysInMonth = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
      ).getDate();

      // Add empty days to align with correct day of week
      const firstDay = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
      ).getDay();
      for (let k = 0; k < firstDay; k++) {
        days.push(null);
      }

      for (let j = 1; j <= daysInMonth; j++) {
        days.push(new Date(month.getFullYear(), month.getMonth(), j));
      }

      months.push({
        monthName: month.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        days: days,
      });
    }

    setCalendar(months);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const diffTime = Math.abs(selectedDates.checkOut - selectedDates.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateTotalNights();
    return parseFloat(property?.pricePerNight || 0) * nights;
  };

  const handleGuestCountChange = (change) => {
    const newCount = guestCount + change;
    if (newCount >= 1 && newCount <= property.maxGuests) {
      setGuestCount(newCount);
    }
  };

  const handleDateSelect = (date) => {
    if (!date) return;

    if (
      !selectedDates.checkIn ||
      (selectedDates.checkIn && selectedDates.checkOut)
    ) {
      setSelectedDates({
        checkIn: date,
        checkOut: null,
      });
    } else {
      if (date > selectedDates.checkIn) {
        setSelectedDates((prev) => ({
          ...prev,
          checkOut: date,
        }));
      } else {
        setSelectedDates({
          checkIn: date,
          checkOut: null,
        });
      }
    }
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDates.checkIn) return false;
    if (!selectedDates.checkOut)
      return date.getTime() === selectedDates.checkIn.getTime();
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    return date < new Date().setHours(0, 0, 0, 0);
  };

  const handleBookingSubmit = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (!property?.id) {
      setError("Property information is missing");
      return;
    }

    if (guestCount > property.maxGuests) {
      setError(`Maximum ${property.maxGuests} guests allowed`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const bookingData = {
        checkIn: selectedDates.checkIn.toISOString(),
        checkOut: selectedDates.checkOut.toISOString(),
        status: "PENDING",
        numberOfNights: calculateTotalNights(), 
        numberOfGuests: guestCount, 
        totalPrice: calculateTotalPrice(), 
      };

      // Pass propertyId and bookingData correctly
      const resultAction = await dispatch(
        createBooking({ propertyId: property.id, bookingData })
      );

      if (createBooking.fulfilled.match(resultAction)) {
        notifySuccess("Done booking");
        onClose();
      } else if (createBooking.rejected.match(resultAction)) {
        notifyError(resultAction.payload);
        setError(
          resultAction.payload || "Failed to create booking. Please try again."
        );
      }
    } catch (err) {
      notifyError("Please first login");
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isBookingLoading = isLoading || isReduxLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Book Your Stay</h2>
            <p className="text-gray-600 mt-1">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Guest Count Selector */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Number of Guests</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleGuestCountChange(-1)}
              disabled={guestCount <= 1}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              -
            </button>
            <span>{guestCount} guest(s)</span>
            <button
              onClick={() => handleGuestCountChange(1)}
              disabled={guestCount >= property.maxGuests}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              +
            </button>
            <span className="text-sm text-gray-500">
              (Max {property.maxGuests} guests)
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {calendar.map((month, monthIndex) => (
              <div key={monthIndex} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {month.monthName}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium p-1"
                    >
                      {day}
                    </div>
                  ))}
                  {month.days.map((date, dateIndex) => (
                    <button
                      key={dateIndex}
                      onClick={() => handleDateSelect(date)}
                      disabled={isDateDisabled(date)}
                      className={`
                        p-2 text-center rounded-full
                        ${!date ? "invisible" : ""}
                        ${
                          isDateDisabled(date)
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-blue-50 cursor-pointer"
                        }
                        ${
                          isDateSelected(date)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : ""
                        }
                      `}
                    >
                      {date?.getDate() || ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        {selectedDates.checkIn && selectedDates.checkOut && (
          <div className="p-6 border-b space-y-3">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Check-in:</span>
              <span className="font-medium">
                {formatDate(selectedDates.checkIn)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Check-out:</span>
              <span className="font-medium">
                {formatDate(selectedDates.checkOut)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Number of nights:</span>
              <span className="font-medium">{calculateTotalNights()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Guests:</span>
              <span className="font-medium">{guestCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price per night:</span>
              <span className="font-medium">${property.pricePerNight}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-3 border-t">
              <span>Total price:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="px-6 pt-4">
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBookingSubmit}
            disabled={
              isBookingLoading ||
              !selectedDates.checkIn ||
              !selectedDates.checkOut
            }
            className={`
              px-4 py-2 rounded-lg bg-blue-600 text-white
              ${
                isBookingLoading ||
                !selectedDates.checkIn ||
                !selectedDates.checkOut
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }
            `}
          >
            {isBookingLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
