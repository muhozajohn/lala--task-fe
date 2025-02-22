import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingCard from "../components/BookingCard";
import {
  getUserBookings,
  selectUserBookings,
  selectLoginError,
  selectLoginStatus,
} from "../redux/auth/authSlice";
import Button from "../components/button";

const CartPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectUserBookings);
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <span className="font-medium">Error:</span> {error}
        </div>
      </div>
    );
  }

  if (status === "succeeded" && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          <span className="font-medium">No bookings found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Bookings</h1>
        <Button path="/profile" title="My Profile" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default CartPage;
