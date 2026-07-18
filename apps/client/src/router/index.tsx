import { createBrowserRouter, type RouteObject } from "react-router";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AppLayout from "../Layout/AppLayout";
import AuthLayout from "../Layout/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/UsersPage";
import PermissionsPage from "../pages/PermissionsPage";
import RolesPage from "../pages/RolesPage";
import RolePermissionsPage from "../pages/RolePermissionsPage";
import { resourceActionPermissions } from "../permissions/permissions";
import {
  ApartmentOutlined,
  BarChartOutlined,
  KeyOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

export type RouteHandler = {
  showInMenu?: boolean;
  label?: string;
  icon?: React.ReactNode;
  requiredPermission?: string;
};

export type AppRouteObject = RouteObject & {
  id?: "app" | "auth" | "home";
  path?: string;
  Component?: React.ComponentType;
  loader?: () => void | Response;
  children?: RouteObject &
    {
      Component?: React.ComponentType;
      children?: RouteObject &
        {
          path?: string;
          Component?: React.ComponentType;
          handle?: RouteHandler;
        }[];
    }[];
};

const routes: AppRouteObject[] = [
  {
    id: "home",
    path: "/",
    loader: () => {
      return Response.redirect("/login");
    },
  },
  // auth routes
  {
    id: "auth",
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
    id: "app",
    Component: PrivateRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: "/dashboard",
            Component: Dashboard,
            handle: {
              showInMenu: true,
              label: "Dashboard",
              icon: <BarChartOutlined />,
            },
          },
          {
            path: "/users",
            Component: UsersPage,
            handle: {
              showInMenu: true,
              label: "Users",
              icon: <UsergroupAddOutlined />,
              requiredPermission: resourceActionPermissions.user.read,
            },
          },
          {
            path: "/permissions",
            Component: PermissionsPage,
            handle: {
              showInMenu: true,
              label: "Permissions",
              icon: <UserOutlined />,
              requiredPermission: resourceActionPermissions.permission.read,
            },
          },
          {
            path: "/roles",
            Component: RolesPage,
            handle: {
              showInMenu: true,
              label: "Roles",
              icon: <KeyOutlined />,
              requiredPermission: resourceActionPermissions.role.read,
            },
          },
          {
            path: "/role-permissions",
            Component: RolePermissionsPage,
            handle: {
              showInMenu: true,
              label: "Role Permissions",
              icon: <ApartmentOutlined />,
              requiredPermission:
                resourceActionPermissions.rolesPermission.read,
            },
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);
export { router, routes };
