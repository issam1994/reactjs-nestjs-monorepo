import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../store";
import { NavLink, Outlet } from "react-router";
import { routes } from "../../router";
import { hasPermission } from "../../permissions/permissions";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = routes
    .find((route) => route.id === "app")
    // first layer of children is the Layout (App), second layer of children is the actual routes, so we need to access the second layer of children to get the menu items
    ?.children?.[0]?.children?.filter((child) => child.handle?.showInMenu)
    .filter((item) => {
      const requiredPermission = item.handle?.requiredPermission;
      // Check if the user has the required permission for this route
      if (requiredPermission) {
        return user && hasPermission(user, requiredPermission);
      }
      return true; // No specific permission required, show the menu item
    })
    .map((child) => ({
      key: child.path || "",
      label: child.handle?.label || "",
      icon: child.handle?.icon || null,
    })) as { key: string; label: string; icon?: React.ReactNode }[];
  return (
    <Layout className="min-h-screen!">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
      >
        <div className="text-white px-4 py-4 text-lg font-bold">
          <DashboardOutlined className="ml-4 mr-2" />
          {collapsed ? null : "XXXXXX"}
        </div>
        <Menu theme="dark" defaultSelectedKeys={[location.pathname]}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <NavLink to={item.key}>{item.label}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="px-4! text-white! shadow-md!">
          <div className="flex! justify-between! items-center!">
            <h2>Welcome Back, {user?.firstName}</h2>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: user?.firstName || "User",
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    label: "Disconnect",
                    onClick: logout,
                  },
                ],
              }}
            >
              <div className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4 p-4">
          <Outlet />
        </Content>
        <Footer className="text-center">Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
