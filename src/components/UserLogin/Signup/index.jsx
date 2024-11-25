import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { postService } from "../../../api/serviceApi";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state

  const handleRegister = async (values) => {
    try {
      setIsSubmitting(true); // Start loading
      const { username, firstName, lastName, password, email, phone } = values;

      // Call the registration API
      await postService("/user/signup", {
        username,
        firstName,
        lastName,
        password,
        email,
        phone,
      });

      message.success("Registration successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Registration failed. Please try again!"
      );
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <Form
      onFinish={handleRegister}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto", marginTop: 100 }}
    >
      <h2>Register</h2>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter your username!" },
          { min: 3, message: "Username must be at least 3 characters long!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please enter your first name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please enter your last name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email!" },
          { type: "email", message: "Invalid email format!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: false },
          {
            pattern: /^\+?[0-9]{10,15}$/,
            message:
              "Phone number must be 10-15 digits, optionally starting with +",
          },
        ]}
      >
        <Input placeholder="Optional, e.g., +1234567890" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please enter your password!" },
          { min: 6, message: "Password must be at least 6 characters long!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
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
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          loading={isSubmitting} 
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
