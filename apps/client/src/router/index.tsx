import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return Response.redirect("/login");
    },
  },
  // auth
  {
    id: "auth",
    Component: PublicRoute,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      { path: "/register", Component: RegisterPage },
    ],
  },
  // dashboard routes
  {
    id: "private",
    Component: PrivateRoute,
    children: [{ path: "/dashboard", Component: Dashboard }],
  },
]);
export { router };
