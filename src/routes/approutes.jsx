import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homelayout from "../layouts/homelayout";
import DashLayout from "../layouts/dashLayout";
import Notfound from "../components/not-found";
import { ToastContainer } from "react-toastify";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/home";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import Login from "../pages/login";
import Signup from "../pages/signup";
import CartPage from "../pages/cart";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Home Routes */}
        <Route path="/" element={<Homelayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notification" element={<CartPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<Notfound />} />
      </Routes>

      {/* Toast Container */}
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default AppRoutes;
