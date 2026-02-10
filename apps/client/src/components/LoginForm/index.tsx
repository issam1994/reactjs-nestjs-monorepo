import React from "react";
import { Form, Input, Button, Card, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../../store";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginForm: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  // Handle form submission
  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      message.info(`Login values: ${values.email}, ${values.password}`);
      // Simulate a successful login
      await login(values);
      setLoading(false);
      form.resetFields();
      navigate(location.state?.from || "/dashboard");
    } catch (error) {
      setLoading(false);
      // Handle error (e.g., show notification)
      message.error(`error during login: ${error}`);
    }
  };

  return (
    <Card
      title={<p className="text-center">{"Login"}</p>}
      className="w-full max-w-md"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              validator(_, value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || emailRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please enter a valid email address!"),
                );
              },
              message: "Please input your email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Sign In
          </Button>
          <Link to="/register" className="mt-2 block text-center">
            Register Now!
          </Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;
