import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store";
import { NavLink, Outlet } from "react-router";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

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
          <Menu.Item key="/dashboard" icon={<BarChartOutlined />}>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <NavLink to={"/users"}>Users</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="px-4! shadow-md!">
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
        <Content className="m-4">
          <Outlet />
        </Content>
        <Footer className="text-center">Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
