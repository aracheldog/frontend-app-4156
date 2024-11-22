import React, { useState } from "react";
import useSWR from "swr";
import { Table, message, Spin, Button, Modal, Form, Input, Select } from "antd";
import { fetcher } from "../../api/fetcher";
import { postService } from "../../api/serviceApi"; // 引入 postService 方法

const AllServices = () => {
  const { data, error, isLoading, mutate } = useSWR("/services", fetcher); // 使用 SWR 获取数据
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 显示状态
  const [form] = Form.useForm(); // Ant Design 表单实例


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); 
  };


  const handleCreateService = async (values) => {
    try {
      await postService("/services", values);
      message.success("Service created successfully!");
      mutate(); 
      handleCloseModal(); 
    } catch (error) {
      message.error("Failed to create service.");
    }
  };

  // 定义表格列
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: 16 }}
      >
        Create New Service
      </Button>
      {isLoading ? (
        <Spin tip="Loading...">
          <Table dataSource={[]} columns={columns} rowKey="id" />
        </Spin>
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" />
      )}


      <Modal
        title="Create New Service"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateService} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the service name!" },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="shelters">Shelters</Select.Option>
              <Select.Option value="food-banks">Food Banks</Select.Option>
              <Select.Option value="healthcare">Healthcare</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea placeholder="Enter service description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllServices;
