import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import {
  Descriptions,
  Spin,
  List,
  Form,
  Input,
  Button,
  Rate,
  message,
  Popconfirm,
} from "antd";
import { fetcher } from "../../api/fetcher";
import { postService, deleteService } from "../../api/serviceApi";

const ServiceDetail = () => {
  const { id } = useParams(); // Service ID
  const { data, error, isLoading } = useSWR(`/services/${id}`, fetcher); // Service details
  const { data: feedbackData, error: feedbackError } = useSWR(
    `/services/${id}/feedback`,
    fetcher
  ); // Feedback for the service
  console.log(Array.isArray(feedbackData));
  let feedbacks = Array.isArray(feedbackData) ? feedbackData : [];
  
  const [isSubmitting, setIsSubmitting] = useState(false); // Feedback submission state
  const [form] = Form.useForm(); // Ant Design form instance

  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }

  // Handle feedback submission
  const handleFeedbackSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await postService("/services/feedback", {
        serviceId: Number(id),
        userId: user.userId,
        rating: values.rating,
        comment: values.comment,
      });
      message.success("Feedback submitted successfully!");
      mutate(`/services/${id}/feedback`); // Refresh feedback list
      form.resetFields(); // Clear the form fields
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to submit feedback!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteService(`/services/feedback/${feedbackId}`);
      message.success("Feedback deleted successfully!");
      mutate(`/services/${id}/feedback`); // Refresh feedback list
    } catch (error) {
      message.error("Failed to delete feedback.");
    }
  };

  if (isLoading) {
    return <Spin tip="Loading service details..." />;
  }

  if (error) {
    return <p>Error: {error.message || "Failed to load service details."}</p>;
  }

  return (
    <div>
      {/* Service Details */}
      <Descriptions title="Service Details" bordered column={2}>
        <Descriptions.Item label="ID" span={1}>
          {data.id}
        </Descriptions.Item>
        <Descriptions.Item label="Name" span={1}>
          {data.name}
        </Descriptions.Item>
        <Descriptions.Item label="Category" span={1}>
          {data.category}
        </Descriptions.Item>
        <Descriptions.Item label="Latitude" span={1}>
          {data.latitude}
        </Descriptions.Item>
        <Descriptions.Item label="Longitude" span={1}>
          {data.longitude}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {data.address}
        </Descriptions.Item>
        <Descriptions.Item label="City" span={1}>
          {data.city}
        </Descriptions.Item>
        <Descriptions.Item label="State" span={1}>
          {data.state}
        </Descriptions.Item>
        <Descriptions.Item label="Zipcode" span={1}>
          {data.zipcode}
        </Descriptions.Item>
        <Descriptions.Item label="Contact Number" span={1}>
          {data.contactNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Operation Hours" span={2}>
          {data.operationHour}
        </Descriptions.Item>
        <Descriptions.Item label="Availability" span={2}>
          {data.availability ? "Available" : "Unavailable"}
        </Descriptions.Item>
      </Descriptions>

      {/* Feedback Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Feedback</h2>

        {/* Feedback List */}
        {feedbackError ? (
          <p>Error: {feedbackError.message || "Failed to load feedback."}</p>
        ) : (
          <List
            dataSource={feedbacks ?? []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Are you sure to delete this feedback?"
                    onConfirm={() => handleDeleteFeedback(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <span>Rating: </span>
                      <Rate disabled defaultValue={item.rating} />
                    </div>
                  }
                  description={item.comment}
                />
                <div>
                  <small>By User ID: {item.userId}</small>
                </div>
              </List.Item>
            )}
          />
        )}
        <h2 style={{ marginTop: 40 }}>Provide Your Feedback</h2>
        {/* Feedback Form */}
        <Form
          form={form}
          onFinish={handleFeedbackSubmit}
          layout="vertical"
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please provide a rating!" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Comment"
            name="comment"
            rules={[{ required: true, message: "Please add a comment!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter your feedback here" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              style={{ width: "100%" }}
            >
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ServiceDetail;
