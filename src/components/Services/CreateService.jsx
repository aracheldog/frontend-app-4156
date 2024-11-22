import React from "react";
import { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Switch, message } from "antd";
import useSWR from "swr";
import { fetcher } from "../../api/fetcher";
import { postService, putService } from "../../api/serviceApi";

const CreateService = ({
  isModalOpen,
  handleCloseModal,
  mutate,
  editMode,
  editingService,
}) => {
  const [form] = Form.useForm();
  const { data: categories, error: categoryError } = useSWR(
    "/services/categories",
    fetcher
  );

  useEffect(() => {
    if (editMode && editingService) {
      form.setFieldsValue(editingService); // Pre-fill form with service data
    } else {
      form.resetFields();
    }
  }, [editMode, editingService, form]);

  if (categoryError) {
    message.error("Failed to load categories.");
  }

  const handleSubmit = async (values) => {
    let updatedValues = { ...values, category: values.category.trim() };
    try {
      if (editMode) {
        await putService(`/services/${editingService.id}`, updatedValues); // Update service
        message.success("Service updated successfully!");
      } else {
        await postService("/services", updatedValues); // Create new service
        message.success("Service created successfully!");
      }
      mutate(); // Refresh service list
      handleCloseModal(); // Close modal
    } catch (error) {
      message.error("Failed to process service.");
    }
  };

  return (
    <Modal
      title={`${editMode ? "Update Service" : "Create Service"}`}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={800}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "16px",
        },
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          availability: true, // Default availability to true
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the service name!" },
            { max: 255, message: "Name cannot exceed 255 characters!" },
          ]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select category" loading={!categories}>
            {categories?.map((category) => (
              <Select.Option key={category.id} value={category.category_name}>
                {category.category_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Latitude"
          name="latitude"
          rules={[
            { required: true, message: "Please enter the latitude!" },
            {
              type: "number",
              transform: (value) => Number(value),
              min: -90,
              max: 90,
              message: "Latitude must be between -90 and 90!",
            },
          ]}
        >
          <Input placeholder="Enter latitude" />
        </Form.Item>
        <Form.Item
          label="Longitude"
          name="longitude"
          rules={[
            { required: true, message: "Please enter the longitude!" },
            {
              type: "number",
              transform: (value) => Number(value),
              min: -180,
              max: 180,
              message: "Longitude must be between -180 and 180!",
            },
          ]}
        >
          <Input placeholder="Enter longitude" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Please enter the address!" },
            { max: 255, message: "Address cannot exceed 255 characters!" },
          ]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[
            { required: true, message: "Please enter the city!" },
            { max: 255, message: "City cannot exceed 255 characters!" },
          ]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>
        <Form.Item
          label="State"
          name="state"
          rules={[
            { required: true, message: "Please enter the state!" },
            { max: 255, message: "State cannot exceed 255 characters!" },
          ]}
        >
          <Input placeholder="Enter state" />
        </Form.Item>
        <Form.Item
          label="Zipcode"
          name="zipcode"
          rules={[
            { required: true, message: "Please enter the zipcode!" },
            {
              pattern: /^\d{5}$/,
              message: "Zipcode must be a 5-digit number!",
            },
          ]}
        >
          <Input placeholder="Enter zipcode" />
        </Form.Item>
        <Form.Item
          label="Contact Number"
          name="contact_number"
          rules={[
            { required: true, message: "Please enter the contact number!" },
            {
              pattern: /^\+?\d{1,15}$/,
              message: "Please enter a valid contact number!",
            },
          ]}
        >
          <Input placeholder="Enter contact number (optional)" />
        </Form.Item>
        <Form.Item
          label="Operation Hours"
          name="operation_hour"
          rules={[
            { required: true, message: "Please enter the operation_hour!" },
            {
              pattern: /^\d{1,2} (AM|PM) - \d{1,2} (AM|PM)$/,
              message: "Operation hours must follow the format: '9 AM - 5 PM'!",
            },
          ]}
        >
          <Input placeholder="Enter operation hours (e.g., 9 AM - 5 PM)" />
        </Form.Item>
        <Form.Item
          label="Availability"
          name="availability"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {editMode ? "Update Service" : "Create Service"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateService;
