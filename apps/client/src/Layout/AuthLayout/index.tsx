import { Layout } from "antd";
import { Outlet } from "react-router";

const AuthLayout: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Outlet />
    </Layout>
  );
};

export default AuthLayout;
