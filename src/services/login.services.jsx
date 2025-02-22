import http from "../axiosInstance";

class UserService {
  // Create a new user with email and password
  createUser(data) {
    return http.post("/users", data);
  }

  // Login user with email and password
  login(data) {
    return http.post("/users/auth", data);
  }

  // Create or login user with Google OAuth
  loginWithGoogle(googleToken) {
    return http.post("/users/google", { token: googleToken });
  }

  // Get all users
  getAllUsers() {
    return http.get("/users");
  }

  // Get a single user by ID
  getUserById(id) {
    return http.get(`/users/${id}`);
  }

  // Update user profile
  updateUserProfile(id, data) {
    return http.put(`/users/${id}`, data);
  }

  // Update user role
  updateUserRole(id, data) {
    return http.patch(`/users/${id}/role`, data);
  }

  // Delete user
  deleteUser(id) {
    return http.delete(`/users/${id}`);
  }

  // Get user's properties (for hosts)
  getUserProperties() {
    return http.get(`/users/properties`);
  }

  // Get user's bookings (for renters)
  getUserBookings() {
    return http.get(`/users/bookings`);
  }
}

const userService = new UserService();
export default userService;
