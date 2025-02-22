import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuthenticated, getUserRole } from "../redux/auth/authSlice";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  const userRole = useSelector(getUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "HOST") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;