// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store";

const PublicRoute = () => {
  const { user } = useAuthStore();

  if (user) {
    // Redirect authenticated users to the dashboard
    // Retain the current location so they can be redirected back after login
    return <Navigate to="/dashboard" replace />;
  }

  // Renders the child routes
  return <Outlet />;
};

export default PublicRoute;
