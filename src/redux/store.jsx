import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./auth/authSlice";
import propertyReducer from "./property/propertySlice";


const store = configureStore({
  reducer: {
    login: loginReducer,
    properties: propertyReducer,
  },
});

export default store;
