// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation, useMatches } from "react-router";
import { useAuthStore } from "../store";
import { hasPermission } from "../permissions/permissions";
import type { RouteHandler } from ".";

const PrivateRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const matches = useMatches();

  const routeHandleData = matches.find((match) => match.handle)
    ?.handle as RouteHandler;

  if (!user) {
    // Redirect unauthenticated users to the login page
    // Retain the current location so they can be redirected back after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (hasPermission(user, routeHandleData?.requiredPermission) === false) {
    // Redirect users without the required permission to a "Not Authorized" page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Renders the child routes
  return <Outlet />;
};

export default PrivateRoute;
