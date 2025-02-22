import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../../services/booking.service";

const initialState = {
  bookings: [],
  currentBooking: null,
  filteredBookings: [],
  loading: false,
  error: null,
};

// Create a new booking
export const createBooking = createAsyncThunk(
  "bookings/create",
  async ({ propertyId, bookingData }, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(propertyId, bookingData);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create booking");
    }
  }
);

// Get all bookings
export const getAllBookings = createAsyncThunk(
  "bookings/getAll",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await bookingService.getAllBookings(filters);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get bookings");
    }
  }
);

// Get booking by ID
export const getBookingById = createAsyncThunk(
  "bookings/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingById(id);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get booking details");
    }
  }
);

// Update booking
export const updateBooking = createAsyncThunk(
  "bookings/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(id, data);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update booking");
    }
  }
);

// Partially update booking
export const updateBookingPartial = createAsyncThunk(
  "bookings/updatePartial",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bookingService.patchBooking(id, data);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update booking");
    }
  }
);

// Delete booking
export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (id, { rejectWithValue }) => {
    try {
      await bookingService.deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete booking");
    }
  }
);

export const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingErrors: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearFilteredBookings: (state) => {
      state.filteredBookings = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all bookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get booking by ID
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Partial update booking
      .addCase(updateBookingPartial.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingPartial.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBookingPartial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        if (state.currentBooking && state.currentBooking.id === action.payload) {
          state.currentBooking = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export selectors
export const selectBookings = (state) => state.bookings.bookings;
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectFilteredBookings = (state) => state.bookings.filteredBookings;
export const selectBookingLoading = (state) => state.bookings.loading;
export const selectBookingError = (state) => state.bookings.error;

// Export actions
export const { clearBookingErrors, clearCurrentBooking, clearFilteredBookings } = bookingSlice.actions;

export default bookingSlice.reducer;