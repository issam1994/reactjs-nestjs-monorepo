import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import UsersPage from "../pages/Users";
import AppLayout from "../Layout/AppLayout";
import AuthLayout from "../Layout/AuthLayout";

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
        ],
      },
    ],
  },
]);
export { router };
