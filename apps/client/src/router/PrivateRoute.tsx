// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store";

const PrivateRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users to the login page
    // Retain the current location so they can be redirected back after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Renders the child routes
  return <Outlet />;
};

export default PrivateRoute;
