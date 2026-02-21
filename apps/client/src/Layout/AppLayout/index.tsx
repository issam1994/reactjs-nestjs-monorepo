import React, { useState } from "react";
import { Layout, Menu, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
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
          {collapsed ? null : "Ultima"}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <NavLink to={"/users"}>Users</NavLink>
          </Menu.Item>
          <Menu.Item onClick={logout} key="4" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white! px-4! shadow-md!">
          <div className="flex! justify-between! items-center!">
            <h2>Welcome Back, {user?.firstName}</h2>
            <Avatar icon={<UserOutlined />} />
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
