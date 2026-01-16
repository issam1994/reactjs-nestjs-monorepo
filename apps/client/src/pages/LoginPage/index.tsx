import { Layout } from "antd";
import LoginForm from "../../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;
