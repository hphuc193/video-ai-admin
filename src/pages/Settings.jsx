import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosClient.get('/admin/settings');
      setSettings(res.data);
    } catch (error) {
      message.error('Lỗi lấy cấu hình!');
    }
  };

  const handleSaveSetting = async (values) => {
    try {
      await axiosClient.put('/admin/settings', values);

      message.success('Lưu cấu hình thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchSettings();
    } catch (error) {
      message.error('Lỗi lưu cấu hình!');
    }
  };

  const openEditModal = (record) => {
    setIsEditing(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Cấu hình',
      dataIndex: 'key',
      key: 'key',
      width: 280,
      render: (text) => (
        <div className="table-primary-cell">
          <div className="table-icon blue">
            <KeyOutlined />
          </div>

          <div>
            <strong className="setting-key">
              {text}
            </strong>
            <span>Configuration key</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: 280,
      render: (text) => (
        <code className="setting-value">
          {text}
        </code>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <span className="setting-description">
          {text || '—'}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-dot" />
            SYSTEM CONFIGURATION
          </div>

          <h1>Cài đặt hệ thống</h1>

          <p>
            Quản lý các tham số và cấu hình hoạt động
            của hệ thống.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Thêm cấu hình
        </Button>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon">
            <SettingOutlined />
          </div>

          <div>
            <strong>{settings.length}</strong>
            <span>Cấu hình hiện tại</span>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon green">
            <KeyOutlined />
          </div>

          <div>
            <strong>Active</strong>
            <span>Configuration service</span>
          </div>
        </div>
      </div>

      <div className="management-card">
        <div className="table-toolbar settings-toolbar">
          <div>
            <h2>System configurations</h2>
            <span>
              Các khóa cấu hình được sử dụng bởi hệ thống.
            </span>
          </div>
        </div>

        <Table
          dataSource={settings}
          columns={columns}
          rowKey="key"
          bordered={false}
          pagination={false}
          scroll={{ x: 820 }}
        />
      </div>

      <Modal
        title={
          <div className="modal-title">
            <SettingOutlined />
            <span>
              {isEditing
                ? 'Cập nhật cấu hình'
                : 'Thêm cấu hình mới'}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu cấu hình"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSetting}
          className="modern-form"
        >
          <Form.Item
            name="key"
            label="Mã cấu hình"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Key!',
              },
            ]}
          >
            <Input
              size="large"
              disabled={isEditing}
              placeholder="DEFAULT_CREDIT_NEW_USER"
            />
          </Form.Item>

          <Form.Item
            name="value"
            label="Giá trị"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Value!',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập giá trị..."
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Ghi chú / Mô tả"
          >
            <Input.TextArea
              rows={4}
              placeholder="Mô tả công dụng của cấu hình này..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
