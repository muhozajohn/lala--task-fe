import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./auth/authSlice";
import propertyReducer from "./property/propertySlice";
import bookingReducer from "./bookings/bookingsSlice";


const store = configureStore({
  reducer: {
    login: loginReducer,
    bookings: bookingReducer,
    properties: propertyReducer,
  },
});

export default store;
