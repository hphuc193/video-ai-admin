import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Tag,
  Switch,
} from 'antd';
import {
  GiftOutlined,
  PlusOutlined,
  TagsOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import dayjs from 'dayjs';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const [formPkg] = Form.useForm();
  const [formPromo] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resPkg = await axiosClient.get('/admin/packages');
      const resPromo = await axiosClient.get('/admin/promotions');

      setPackages(resPkg.data);
      setPromotions(resPromo.data);
    } catch (error) {
      message.error('Lỗi lấy dữ liệu!');
    }
  };

  const handleCreatePackage = async (values) => {
    try {
      await axiosClient.post('/admin/packages', values);

      message.success('Tạo gói thành công!');
      setIsPackageModalOpen(false);
      formPkg.resetFields();
      fetchData();
    } catch (error) {
      message.error('Lỗi tạo gói!');
    }
  };

  const handleTogglePackage = async (packageId) => {
    try {
      const res = await axiosClient.patch(
        `/admin/packages/${packageId}/toggle`
      );

      message.success(res.message);
      fetchData();
    } catch (error) {
      message.error('Lỗi cập nhật trạng thái gói!');
    }
  };

  const handleCreatePromo = async (values) => {
    try {
      const payload = {
        code: values.code,
        rewardCredits: values.rewardCredits,
        maxUses: values.maxUses,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };

      await axiosClient.post(
        '/admin/promotions',
        payload
      );

      message.success('Tạo khuyến mãi thành công!');
      setIsPromoModalOpen(false);
      formPromo.resetFields();
      fetchData();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Lỗi tạo khuyến mãi!'
      );
    }
  };

  const handleTogglePromotion = async (promoId) => {
    try {
      const res = await axiosClient.patch(
        `/admin/promotions/${promoId}/toggle`
      );

      message.success(res.message);
      fetchData();
    } catch (error) {
      message.error(
        'Lỗi cập nhật trạng thái khuyến mãi!'
      );
    }
  };

  const packageColumns = [
    {
      title: 'Gói Credit',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      render: (text) => (
        <div className="table-primary-cell">
          <div className="table-icon purple">
            <GiftOutlined />
          </div>

          <div>
            <strong>{text}</strong>
            <span>Credit package</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (value) => (
        <strong className="money-value">
          {/* ĐÃ SỬA THÀNH ĐỊNH DẠNG VND Ở ĐÂY */}
          {Number(value).toLocaleString('vi-VN')} đ
        </strong>
      ),
    },
    {
      title: 'Credit',
      dataIndex: 'credits',
      key: 'credits',
      width: 180,
      render: (value) => (
        <Tag
          color="blue"
          bordered={false}
          className="credit-tag"
        >
          +{value} CR
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isActive',
      width: 170,
      render: (record) => (
        <div className="switch-cell">
          <Switch
            size="small"
            checked={record.isActive}
            onChange={() =>
              handleTogglePackage(record.id)
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
              ? 'Đang bán'
              : 'Đã ẩn'}
          </span>
        </div>
      ),
    },
  ];

  const promoColumns = [
    {
      title: 'Mã khuyến mãi',
      dataIndex: 'code',
      key: 'code',
      width: 230,
      render: (text) => (
        <div className="table-primary-cell">
          <div className="table-icon orange">
            <TagsOutlined />
          </div>

          <div>
            <strong className="promo-code">
              {text}
            </strong>
            <span>Promotion code</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Credit tặng',
      dataIndex: 'rewardCredits',
      key: 'rewardCredits',
      width: 160,
      render: (value) => (
        <Tag
          color="gold"
          bordered={false}
          className="credit-tag"
        >
          +{value} CR
        </Tag>
      ),
    },
    {
      title: 'Sử dụng',
      key: 'usage',
      width: 150,
      render: (_, record) => (
        <div className="usage-cell">
          <strong>{record.currentUses}</strong>
          <span>/ {record.maxUses}</span>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 250,
      render: (_, record) => (
        <div className="date-cell">
          <CalendarOutlined />

          <span>
            {dayjs(record.startDate).format(
              'DD/MM/YYYY HH:mm'
            )}
            {' → '}
            {dayjs(record.endDate).format(
              'DD/MM/YYYY HH:mm'
            )}
          </span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isActive',
      width: 170,
      render: (record) => (
        <div className="switch-cell">
          <Switch
            size="small"
            checked={record.isActive}
            onChange={() =>
              handleTogglePromotion(record.id)
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
              ? 'Kích hoạt'
              : 'Vô hiệu'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-dot" />
            BILLING & PROMOTIONS
          </div>

          <h1>Gói Credit & Khuyến mãi</h1>

          <p>
            Quản lý các gói credit và chương trình
            khuyến mãi của hệ thống.
          </p>
        </div>
      </div>

      <div className="management-card">
        <Tabs
          defaultActiveKey="packages"
          className="modern-tabs"
          items={[
            {
              key: 'packages',
              label: (
                <span className="tab-label">
                  <CreditCardOutlined />
                  Gói Credit
                  <span className="tab-count">
                    {packages.length}
                  </span>
                </span>
              ),
              children: (
                <>
                  <div className="table-toolbar">
                    <div>
                      <h2>Danh sách gói Credit</h2>
                      <span>
                        Các gói hiện đang được cung cấp
                        cho người dùng.
                      </span>
                    </div>

                    <Button
                      type="primary"
                      icon={<PlusOutlined style={{ color: '#ffffff' }} />}
                      onClick={() =>
                        setIsPackageModalOpen(true)
                      }
                    >
                      <span style={{ color: '#ffffff' }}>Tạo gói mới</span>
                    </Button>
                  </div>

                  <Table
                    dataSource={packages}
                    columns={packageColumns}
                    rowKey="id"
                    scroll={{ x: 760 }}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                    }}
                  />
                </>
              ),
            },
            {
              key: 'promotions',
              label: (
                <span className="tab-label">
                  <TagsOutlined />
                  Khuyến mãi
                  <span className="tab-count">
                    {promotions.length}
                  </span>
                </span>
              ),
              children: (
                <>
                  <div className="table-toolbar">
                    <div>
                      <h2>Danh sách khuyến mãi</h2>
                      <span>
                        Theo dõi mã và thời gian áp dụng.
                      </span>
                    </div>

                    <Button
                      type="primary"
                      icon={<PlusOutlined style={{ color: '#ffffff' }} />}
                      onClick={() =>
                        setIsPromoModalOpen(true)
                      }
                    >
                      <span style={{ color: '#ffffff' }}>Tạo mã mới</span>
                    </Button>
                  </div>

                  <Table
                    dataSource={promotions}
                    columns={promoColumns}
                    rowKey="id"
                    scroll={{ x: 960 }}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      </div>

      <Modal
        title={
          <div className="modal-title">
            <GiftOutlined />
            <span>Tạo gói Credit mới</span>
          </div>
        }
        open={isPackageModalOpen}
        onCancel={() =>
          setIsPackageModalOpen(false)
        }
        onOk={() => formPkg.submit()}
        okText="Tạo gói"
        cancelText="Hủy"
      >
        <Form
          form={formPkg}
          layout="vertical"
          onFinish={handleCreatePackage}
          className="modern-form"
        >
          <Form.Item
            name="name"
            label="Tên gói"
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              placeholder="VD: Gói Cơ Bản"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (VND)"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              min={0}
              placeholder="10000"
            />
          </Form.Item>

          <Form.Item
            name="credits"
            label="Số Credit cung cấp"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              min={1}
              placeholder="100"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div className="modal-title">
            <TagsOutlined />
            <span>Tạo mã khuyến mãi</span>
          </div>
        }
        open={isPromoModalOpen}
        onCancel={() =>
          setIsPromoModalOpen(false)
        }
        onOk={() => formPromo.submit()}
        okText="Tạo mã"
        cancelText="Hủy"
      >
        <Form
          form={formPromo}
          layout="vertical"
          onFinish={handleCreatePromo}
          className="modern-form"
        >
          <Form.Item
            name="code"
            label="Mã Code"
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              placeholder="VD: TET2026"
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>

          <Form.Item
            name="rewardCredits"
            label="Số Credit tặng"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="maxUses"
            label="Giới hạn số lượt nhập"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian áp dụng"
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker
              showTime
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Packages;