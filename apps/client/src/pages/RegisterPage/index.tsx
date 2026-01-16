import { Layout } from "antd";
import RegisterForm from "../../components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;
