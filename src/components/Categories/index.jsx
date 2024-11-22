import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Spin, message } from "antd";
import { fetcher } from "../../api/fetcher";
import { postService } from "../../api/serviceApi";

const Categories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/services/categories",
    fetcher
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 提交新类别
  const handleCreateCategory = async (values) => {
    try {
      setIsSubmitting(true);
      await postService("/services/categories", values);
      message.success("Category created successfully!");
      mutate();
      handleCloseModal(); // 关闭 Modal
    } catch (error) {
      message.error("Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 定义表格列
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Category Name", dataIndex: "category_name", key: "name" },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: 16 }}
      >
        Create New Category
      </Button>
      {isLoading ? (
        <Spin tip="Loading...">
          <Table dataSource={[]} columns={columns} rowKey="id" />
        </Spin>
      ) : error ? (
        <p>Error: {error.message || "Failed to load categories."}</p>
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" />
      )}

      <Modal
        title="Create New Category"
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={600}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCreateCategory}
            loading={isSubmitting}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateCategory}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Category Name"
            name="category_name"
            rules={[
              { required: true, message: "Please enter a category name!" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
