import React from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store";

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterFormValues>();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await register(values);
      message.success("Registration successful!");
      form.resetFields();
      navigate("/login");
    } catch (e) {
      message.error(JSON.stringify(e));
    }
  };

  return (
    <Card
      className="w-full max-w-md"
      title={<p className="text-center">{"Register"}</p>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Last Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <Input type="number" placeholder="Age" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Select placeholder="Select Gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
          <Link to="/login" className="mt-2 block text-center">
            Back to Login
          </Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterForm;
