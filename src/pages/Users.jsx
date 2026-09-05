import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Switch,
  message,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
} from 'antd';
import {
  UserOutlined,
  WalletOutlined,
  EditOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import dayjs from 'dayjs';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] =
    useState(false);
  const [selectedUserId, setSelectedUserId] =
    useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      message.error(
        'Lỗi tải danh sách người dùng'
      );
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axiosClient.patch(
        `/admin/users/${userId}/status`
      );

      message.success(res.message);
      fetchUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Lỗi cập nhật trạng thái!'
      );
    }
  };

  const handleUpdateRole = async (
    userId,
    newRole
  ) => {
    try {
      const res = await axiosClient.patch(
        `/admin/users/${userId}/role`,
        { role: newRole }
      );

      message.success(res.message);
      fetchUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Lỗi cập nhật vai trò!'
      );

      fetchUsers();
    }
  };

  const handleAdjustCredit = async (values) => {
    try {
      await axiosClient.post(
        `/admin/users/${selectedUserId}/credits`,
        values
      );

      message.success(
        'Điều chỉnh số dư thành công!'
      );

      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Lỗi điều chỉnh'
      );
    }
  };

  const getInitial = (name, email) => {
    const source = name || email || 'U';

    return source
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 260,
      fixed: 'left',
      render: (_, record) => (
        <div className="table-user-cell">
          <div className="user-avatar">
            {getInitial(
              record.fullName,
              record.email
            )}
          </div>

          <div className="user-information">
            <strong>
              {record.fullName || 'Chưa cập nhật'}
            </strong>

            <span>{record.email}</span>
          </div>
        </div>
      ),
    },

    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => (
        <span className="muted-id">#{id}</span>
      ),
    },

    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role, record) => (
        <Select
          value={role}
          size="small"
          style={{ width: 115 }}
          onChange={(value) =>
            handleUpdateRole(record.id, value)
          }
          options={[
            {
              value: 'USER',
              label: 'USER',
            },
            {
              value: 'ADMIN',
              label: 'ADMIN',
            },
          ]}
        />
      ),
    },

    {
      title: 'Credit',
      dataIndex: 'creditBalance',
      key: 'creditBalance',
      width: 150,
      render: (value) => (
        <div className="credit-balance">
          <WalletOutlined />
          <strong>{value}</strong>
          <span>CR</span>
        </div>
      ),
    },

    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 190,
      render: (date) => (
        <span className="date-text">
          {dayjs(date).format(
            'DD/MM/YYYY HH:mm'
          )}
        </span>
      ),
    },

    {
      title: 'Trạng thái',
      key: 'isActive',
      width: 160,
      render: (record) => (
        <div className="switch-cell">
          <Switch
            size="small"
            checked={record.isActive}
            disabled={record.role === 'ADMIN'}
            onChange={() =>
              handleToggleStatus(record.id)
            }
          />

          <span
            className={
              record.isActive
                ? 'switch-label active'
                : 'switch-label'
            }
          >
            {record.isActive
              ? 'Hoạt động'
              : 'Bị khóa'}
          </span>
        </div>
      ),
    },

    {
      title: '',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedUserId(record.id);
            setIsModalVisible(true);
          }}
        >
          Điều chỉnh
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
            USER MANAGEMENT
          </div>

          <h1>Người dùng</h1>

          <p>
            Quản lý tài khoản, quyền truy cập và
            số dư Credit.
          </p>
        </div>

        <div className="page-header-stat">
          <UserOutlined />
          <strong>{users.length}</strong>
          <span>users</span>
        </div>
      </div>

      <div className="management-card">
        <div className="table-toolbar">
          <div>
            <h2>Danh sách người dùng</h2>
            <span>
              Quản lý tài khoản và quyền sử dụng hệ
              thống.
            </span>
          </div>

          <Tag
            color="blue"
            bordered={false}
            className="table-count-tag"
          >
            {users.length} tài khoản
          </Tag>
        </div>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          bordered={false}
          scroll={{ x: 1120 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>

      <Modal
        title={
          <div className="modal-title">
            <WalletOutlined />
            <span>Điều chỉnh Credit</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() =>
          setIsModalVisible(false)
        }
        onOk={() => form.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div className="credit-modal-warning">
          Nhập số dương để cộng Credit hoặc số âm để
          trừ Credit.
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdjustCredit}
          className="modern-form"
        >
          <Form.Item
            name="amount"
            label="Số Credit"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng nhập số Credit!',
              },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              placeholder="VD: 100 hoặc -50"
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do điều chỉnh"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng nhập lý do!',
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Ví dụ: Tặng event / Trừ do vi phạm..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;