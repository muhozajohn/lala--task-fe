import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loginService from "../../services/login.services";
import { jwtDecode } from 'jwt-decode';
const initialState = {
  userData: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
  users: [],
  userProperties: [],
  userBookings: [],
};

// Login user with email and password
export const makeLogin = createAsyncThunk(
  "login/auth",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginService.login({ email, password });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

// Signup user
export const makeSignup = createAsyncThunk(
  "login/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginService.createUser(userData);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message  || "Signup failed");
    }
  }
);

// Login or Signup with Google OAuth
export const makeGoogleLogin = createAsyncThunk(
  "login/google",
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await loginService.loginWithGoogle(googleToken);
      if (response) {
        localStorage.setItem("token", response.data.token);
      }
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message  || "Google login failed");
    }
  }
);

// Get all users
export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginService.getAllUsers();
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get users");
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await loginService.updateUserProfile(id, formData);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await loginService.updateUserRole(id, role);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update role");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await loginService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete user");
    }
  }
);

// Get user's properties
export const getUserProperties = createAsyncThunk(
  "users/getProperties",
  async (id, { rejectWithValue }) => {
    try {
      const response = await loginService.getUserProperties(id);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get properties");
    }
  }
);

// Get user's bookings
export const getUserBookings = createAsyncThunk(
  "users/getBookings",
  async (id, { rejectWithValue }) => {
    try {
      const response = await loginService.getUserBookings(id);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get bookings");
    }
  }
);

// Logout
export const logout = createAsyncThunk("login/logout", async () => {
  localStorage.removeItem("token");
  return true;
});

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(makeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(makeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(makeSignup.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.loading = false;
      })
      .addCase(getUserProperties.fulfilled, (state, action) => {
        state.userProperties = action.payload;
        state.loading = false;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.userBookings = action.payload;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      .addCase(makeGoogleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(makeGoogleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(makeGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectLoginStatus = (state) => state.login.loading;
export const selectUsers = (state) => state.login.users;
export const selectUserProperties = (state) => state.login.userProperties;
export const selectUserBookings = (state) => state.login.userBookings;
export const selectLoginError = (state) => state.login.error;
export const getIsAuthenticated = (state) => state.login.isAuthenticated;
export const getUserRole = (state) => {
  const token = state.login.token;
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

export default loginSlice.reducer;
