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
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../api/fetcher";
import CreateService from "./CreateService";
import { deleteService, queryServices } from "../../api/serviceApi";

const AllServices = () => {
  const { data, error, isLoading, mutate } = useSWR("/services", fetcher);
  const { data: categories, error: categoryError } = useSWR(
    "/services/categories",
    fetcher
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [queryResults, setQueryResults] = useState(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  const navigate = useNavigate(); // For navigation to detail page

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
      await deleteService(`/services/${id}`);
      message.success("Service deleted successfully!");
      mutate();
    } catch (error) {
      message.error("Failed to delete service.");
    }
  };

  const handleQuery = async (values) => {
    try {
      setIsQueryLoading(true);
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      const results = await queryServices(filteredValues);
      setQueryResults(results);
      message.success("Services filtered successfully!");
    } catch (error) {
      message.error("Failed to filter services.");
    } finally {
      setIsQueryLoading(false);
    }
  };

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
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Operation Hours",
      dataIndex: "operationHour",
      key: "operationHour",
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
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="link"
            onClick={() => navigate(`/services/${record.id}`)}
          >
            Detail
          </Button>
          <Button
            type="link"
            onClick={() => handleOpenModal(record)} // Edit service
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
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Filter Services</h2>
      <Form
        layout="inline"
        onFinish={handleQuery}
        initialValues={{ availability: true }}
        style={{ marginBottom: "16px" }}
      >
        {/* Latitude and Longitude Filters */}
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

        {/* Category and Availability Filters */}
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

      {/* Create Service Button */}
      <Button
        type="primary"
        onClick={() => handleOpenModal()}
        style={{ marginBottom: 16 }}
      >
        Create New Service
      </Button>

      {/* Table */}
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
          locale={{ emptyText: "No services to display. Adjust your filters." }}
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
