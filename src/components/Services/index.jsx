import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  message,
  Spin,
  Button,
  Popconfirm,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import { fetcher } from "../../api/fetcher";
import CreateService from "./CreateService";
import { deleteService, queryServices } from "../../api/serviceApi";

const AllServices = () => {
  const { data, error, isLoading, mutate } = useSWR("/services", fetcher); // Fetch services
  const { data: categories, error: categoryError } = useSWR(
    "/services/categories",
    fetcher
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // Control Modal visibility
  const [editMode, setEditMode] = useState(false); // Track if editing
  const [editingService, setEditingService] = useState(null); // Store the service being edited
  const [queryResults, setQueryResults] = useState(null); // Store filtered results
  const [isQueryLoading, setIsQueryLoading] = useState(false); // Loading state for queries

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setEditMode(true);
    } else {
      setEditingService(null);
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setEditMode(false);
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(`/services/${id}`); // API call to delete service
      message.success("Service deleted successfully!");
      mutate(); // Refresh services list
    } catch (error) {
      message.error("Failed to delete service.");
    }
  };

  const handleQuery = async (values) => {
    try {
      setIsQueryLoading(true);

      // Filter out undefined values from the query parameters
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      const results = await queryServices({
        ...filteredValues,
        category: filteredValues.category.trim(),
      });
      console.log("query results: ", results);
      setQueryResults(results); // Update the results
      message.success("Services filtered successfully!");
    } catch (error) {
      message.error("Failed to filter services.");
    } finally {
      setIsQueryLoading(false);
    }
  };

  // Define table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Latitude", dataIndex: "latitude", key: "latitude" },
    { title: "Longitude", dataIndex: "longitude", key: "longitude" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Zipcode", dataIndex: "zipcode", key: "zipcode" },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Operation Hours",
      dataIndex: "operation_hour",
      key: "operation_hour",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (availability) => (availability ? "Available" : "Unavailable"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => handleOpenModal(record)} // Edit service
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Filter Services</h2>
      <Form
        layout="inline"
        onFinish={handleQuery}
        initialValues={{
          availability: true,
        }}
        style={{ marginBottom: "16px" }}
      >
        <Form.Item
          label="Latitude"
          name="latitude"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const longitude = getFieldValue("longitude");
                if ((!value && !longitude) || (value && longitude)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Both Latitude and Longitude must be entered together."
                  )
                );
              },
            }),
          ]}
        >
          <Input placeholder="Enter latitude" />
        </Form.Item>

        <Form.Item
          label="Longitude"
          name="longitude"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const latitude = getFieldValue("latitude");
                if ((!value && !latitude) || (value && latitude)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Both Latitude and Longitude must be entered together."
                  )
                );
              },
            }),
          ]}
        >
          <Input placeholder="Enter longitude" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            placeholder="Select category"
            allowClear
            loading={!categories}
          >
            {categories?.map((category) => (
              <Select.Option key={category.id} value={category.category_name}>
                {category.category_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Availability"
          name="availability"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        onClick={() => handleOpenModal()} // Open modal for creating a new service
        style={{ marginBottom: 16 }}
      >
        Create New Service
      </Button>
      {isQueryLoading || isLoading ? (
        <Spin tip={isQueryLoading ? "Filtering..." : "Loading..."}>
          <Table dataSource={[]} columns={columns} rowKey="id" />
        </Spin>
      ) : error || categoryError ? (
        <p>
          Error:{" "}
          {error?.message ||
            categoryError?.message ||
            "Failed to load services."}
        </p>
      ) : (
        <Table
          dataSource={queryResults ?? data ?? []}
          columns={columns}
          rowKey="id"
          locale={{
            emptyText: "No services to display. Adjust your filters.",
          }}
        />
      )}

      <CreateService
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        mutate={mutate}
        editMode={editMode}
        editingService={editingService}
      />
    </div>
  );
};

export default AllServices;
