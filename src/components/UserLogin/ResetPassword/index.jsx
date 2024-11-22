import React from "react";
import { Form, Input, Button, message } from "antd";
import { postService } from "../../../api/serviceApi";

const ResetPassword = () => {
  const handleResetPassword = async (values) => {
    try {
      const { username, newPassword } = values;

      // 调用重置密码 API
      await postService("/user/resetPassword", { username, newPassword });

      message.success("Password reset successful!");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again!"
      );
    }
  };

  return (
    <Form
      onFinish={handleResetPassword}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto", marginTop: 100 }}
    >
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
          { min: 6, message: "Password must be at least 6 characters long!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPassword;
