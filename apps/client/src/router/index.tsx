import { createBrowserRouter } from "react-router";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AppLayout from "../Layout/AppLayout";
import AuthLayout from "../Layout/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/UsersPage";
import PermissionsPage from "../pages/PermissionsPage";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return Response.redirect("/login");
    },
  },
  // auth routes
  {
    Component: PublicRoute,
    children: [
      {
        Component: AuthLayout,
        children: [
          {
            path: "/login",
            Component: LoginPage,
          },
          { path: "/register", Component: RegisterPage },
        ],
      },
    ],
  },
  // app routes
  {
    Component: PrivateRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          { path: "/dashboard", Component: Dashboard },
          { path: "/users", Component: UsersPage },
          { path: "/permissions", Component: PermissionsPage },
        ],
      },
    ],
  },
]);
export { router };
