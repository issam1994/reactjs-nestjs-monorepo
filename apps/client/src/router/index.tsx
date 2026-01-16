import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return Response.redirect("/login");
    },
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  { path: "/register", Component: RegisterPage },
]);
export { router };
