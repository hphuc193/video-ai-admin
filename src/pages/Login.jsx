import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  VideoCameraOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await axiosClient.post('/auth/login', values);

      if (res.user.role !== 'ADMIN') {
        message.error(
          'Bạn không có quyền truy cập trang quản trị!'
        );
        return;
      }

      localStorage.setItem('admin_token', res.token);

      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Lỗi đăng nhập'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo">
            <VideoCameraOutlined />
          </div>

          <div>
            <strong>Video AI</strong>
            <span>Administration</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-security-icon">
              <SafetyCertificateOutlined />
            </div>

            <div>
              <h1>Chào mừng trở lại</h1>
              <p>
                Đăng nhập để quản lý hệ thống Video AI.
              </p>
            </div>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="admin-login-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="admin@example.com"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-submit-button"
            >
              Đăng nhập
            </Button>
          </Form>

          <div className="login-footer">
            <span className="login-footer-dot" />
            Khu vực quản trị được bảo vệ
          </div>
        </div>

        <div className="login-copyright">
          Video AI Admin · Secure Administration Portal
        </div>
      </div>
    </div>
  );
};

export default Login;