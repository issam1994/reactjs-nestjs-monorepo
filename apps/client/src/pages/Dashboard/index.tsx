import React from "react";
import { Layout, Menu, Card, Row, Col, Statistic, Table, Avatar } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const Dashboard: React.FC = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const data = [
    { key: "1", name: "Project Alpha", status: "Active", date: "2024-01-15" },
    { key: "2", name: "Project Beta", status: "Pending", date: "2024-01-10" },
    {
      key: "3",
      name: "Project Gamma",
      status: "Completed",
      date: "2024-01-05",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible>
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
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />}>
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
            <h2>Welcome Back</h2>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1128}
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Revenue" value={93124} prefix="$" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Orders" value={1234} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Growth" value={28.5} suffix="%" />
              </Card>
            </Col>
          </Row>
          <Card title="Recent Projects">
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
