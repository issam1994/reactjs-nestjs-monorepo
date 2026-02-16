import React, { useState } from "react";
import { Layout, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../store";

const { Header, Sider, Content, Footer } = Layout;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
      >
        <div
          style={{
            color: "white",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <div className="mt-auto"></div>
          <Menu.Item onClick={logout} key="4" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Welcome Back, {user?.firstName}</h2>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <p>Content</p>
        </Content>
        <Footer style={{ textAlign: "center" }}>Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
