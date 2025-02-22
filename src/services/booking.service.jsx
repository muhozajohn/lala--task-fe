import http from "../axiosInstance";

class BookingService {
  // Create a new booking for a property
  createBooking(propertyId, bookingData) {
    return http.post(`/bookings/properties/${propertyId}/bookings`, bookingData);
  }

  // Get all bookings with optional filters
  getAllBookings(filters = {}) {
    return http.get("/bookings", { params: filters });
  }

  // Get a single booking by ID
  getBookingById(id) {
    return http.get(`/bookings/${id}`);
  }

  // Update a booking
  updateBooking(id, bookingData) {
    return http.put(`/bookings/${id}`, bookingData);
  }

  // Partially update a booking
  patchBooking(id, partialData) {
    return http.patch(`/bookings/${id}`, partialData);
  }

  // Delete (Cancel) a booking
  deleteBooking(id) {
    return http.delete(`/bookings/${id}`);
  }
}

const bookingService = new BookingService();
export default bookingService;