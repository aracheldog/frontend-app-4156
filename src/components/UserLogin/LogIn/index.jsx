import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { postService } from "../../../api/serviceApi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state

  const handleLogin = async (values) => {
    try {
      setIsSubmitting(true);
      const { username, password } = values;

      // Call login API
      let res = await postService("/user/login", { username, password });
      console.log("res: ", res);

      // Mark the user as logged in
      login({ username });
      message.success("Login successful!");
      navigate("/services");
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleResetPassword = async (values) => {
    setIsSubmitting(true);
    try {
      const { username, newPassword } = values;

      // Call reset password API
      await postService("/user/resetPassword", { username, newPassword });

      message.success("Password reset successful!");
      setShowResetPassword(false); // Return to login form
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to reset password!"
      );
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop: 100 }}>
      {!showResetPassword ? (
        <Form onFinish={handleLogin} layout="vertical">
          <h2>Login</h2>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
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
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              onClick={() => setShowResetPassword(true)}
              style={{ padding: 0 }}
            >
              Forgot Password? Reset Here
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form onFinish={handleResetPassword} layout="vertical">
          <h2>Reset Password</h2>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              style={{ width: "100%", marginBottom: 8 }}
            >
              Reset Password
            </Button>
            <Button
              type="default"
              style={{ width: "100%" }}
              onClick={() => setShowResetPassword(false)}
            >
              Back to Login
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Login;
