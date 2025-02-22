import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserBookings,
  selectUserBookings,
  selectLoginError,
  selectLoginStatus,
} from "../redux/auth/authSlice";
import { Spinner, Alert, Card, Badge } from "flowbite-react"; 

const CartPage = () => {
  const dispatch = useDispatch();

  // Selectors
  const bookings = useSelector(selectUserBookings);
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);

  // Fetch user bookings on component mount
  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner aria-label="Loading bookings..." size="xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert color="failure">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      </div>
    );
  }

  // No bookings found (only check after loading is complete)
  if (status === "succeeded" && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert color="info">
          <span className="font-medium">No bookings found.</span>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <img
              src={booking.property.images[0]} // Use the first image
              alt={booking.property.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />

            {/* Property Title and Booking Status */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{booking.property.title}</h2>
              <Badge color={booking.status === "CONFIRMED" ? "success" : "warning"}>
                {booking.status}
              </Badge>
            </div>

            {/* Booking Details */}
            <div className="space-y-2">
              <p>
                <span className="font-medium">Check-in:</span>{" "}
                {new Date(booking.checkIn).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Check-out:</span>{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Guests:</span> {booking.numberOfGuests}
              </p>
              <p>
                <span className="font-medium">Total Price:</span> ${booking.totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Property Details */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <p className="text-sm text-gray-600">{booking.property.description}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {booking.property.location}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price per Night:</span> ${booking.property.pricePerNight}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Bedrooms:</span> {booking.property.bedrooms}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Bathrooms:</span> {booking.property.bathrooms}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Max Guests:</span> {booking.property.maxGuests}
              </p>

              {/* Amenities */}
              <div className="mt-2">
                <h4 className="font-medium">Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.property.amenities.map((amenity, index) => (
                    <Badge key={index} color="gray">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="mt-2">
                <h4 className="font-medium">House Rules:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {booking.property.houseRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CartPage;