import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  message,
  Popconfirm,
} from "antd";
import { fetcher } from "../../api/fetcher";
import { postService, deleteService } from "../../api/serviceApi";

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

  // Submit a new category
  const handleCreateCategory = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields(); // Explicitly validate and get form values
      const { category_name } = values;
      await postService(
        `/services/categories/name/${encodeURIComponent(category_name)}`,
        {}
      );
      message.success("Category created successfully!");
      mutate(); // Refresh categories list
      handleCloseModal();
    } catch (error) {
      if (error.response?.status === 409) {
        message.error("Category already exists.");
      } else if (error.response?.status === 400) {
        message.error("Invalid category name.");
      } else {
        message.error("Failed to create category.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (category_name) => {
    try {
      await deleteService(
        `/services/categories/name/${encodeURIComponent(category_name.trim())}`
      );
      message.success("Category deleted successfully!");
      mutate(); // Refresh categories list
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  // Define table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this category?"
          onConfirm={() => handleDeleteCategory(record.category_name)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
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
            onClick={handleCreateCategory} // Use modal's button to trigger form submission
            loading={isSubmitting}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
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
