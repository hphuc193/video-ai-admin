import React, { useEffect, useMemo, useState } from 'react';
import { Card, Progress, Tag, Tooltip } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  GiftOutlined,
  TagsOutlined,
  HddOutlined,
  ApiOutlined,
  ArrowUpOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import axiosClient from '../api/axiosClient';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    successfulVideos: 0,
    failedVideos: 0,
    totalRevenue: 0,
    activePackages: 0,
    activePromotions: 0,
    totalOutstandingCredits: 0,
  });

  const [pythonHealth, setPythonHealth] = useState({
    status: 'offline',
    fileCount: 0,
    totalSizeMB: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        fetchStats(),
        fetchPythonHealth(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get('/admin/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu Node.js Dashboard:', error);
    }
  };

  const fetchPythonHealth = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/health');

      if (res.data.status === 'online') {
        setPythonHealth({
          status: 'online',
          fileCount: res.data.storage.fileCount,
          totalSizeMB: res.data.storage.totalSizeMB,
        });
      } else {
        setPythonHealth({
          status: 'offline',
          fileCount: 0,
          totalSizeMB: 0,
        });
      }
    } catch (error) {
      setPythonHealth({
        status: 'offline',
        fileCount: 0,
        totalSizeMB: 0,
      });
    }
  };

  const successRate = useMemo(() => {
    if (!stats.totalVideos) return 0;

    return Math.round(
      (stats.successfulVideos / stats.totalVideos) * 100
    );
  }, [stats]);

  const failedRate = useMemo(() => {
    if (!stats.totalVideos) return 0;

    return Math.round(
      (stats.failedVideos / stats.totalVideos) * 100
    );
  }, [stats]);

  const storagePercent = useMemo(() => {
    const size = Number(pythonHealth.totalSizeMB) || 0;

    // 5GB chỉ được dùng làm ngưỡng hiển thị trực quan,
    // không ảnh hưởng logic server.
    return Math.min(Math.round((size / 5000) * 100), 100);
  }, [pythonHealth.totalSizeMB]);

  const videoChartData = {
    labels: ['Thành công', 'Thất bại'],
    datasets: [
      {
        data: [
          stats.successfulVideos,
          stats.failedVideos,
        ],
        backgroundColor: [
          '#22a06b',
          '#e5484d',
        ],
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  const videoChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 18,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const systemChartData = {
    labels: [
      'Người dùng',
      'Video',
      'Credit',
      'Gói đang bán',
      'Khuyến mãi',
    ],
    datasets: [
      {
        label: 'Giá trị hiện tại',
        data: [
          stats.totalUsers,
          stats.totalVideos,
          stats.totalOutstandingCredits,
          stats.activePackages,
          stats.activePromotions,
        ],
        backgroundColor: '#315efb',
        borderRadius: 7,
        maxBarThickness: 42,
      },
    ],
  };

  const systemChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#7b8494',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: '#edf0f5',
        },
        ticks: {
          color: '#7b8494',
        },
      },
    },
  };

  const StatCard = ({
    title,
    value,
    icon,
    iconClass,
    suffix,
    description,
  }) => (
    <Card className="dashboard-stat-card" loading={loading}>
      <div className="stat-card-top">
        <div className={`stat-icon ${iconClass}`}>
          {icon}
        </div>

        <Tooltip title={description}>
          <span className="stat-more">•••</span>
        </Tooltip>
      </div>

      <div className="stat-title">{title}</div>

      <div className="stat-value">
        {value}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
    </Card>
  );

  return (
    <div className="admin-page dashboard-page">
      {/* HEADER */}
      <div className="page-header dashboard-header">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-dot" />
            SYSTEM OVERVIEW
          </div>

          <h1>Dashboard</h1>

          <p>
            Tổng quan hoạt động và tình trạng hệ thống AI của bạn.
          </p>
        </div>

        <div className="dashboard-status">
          <span
            className={`status-dot ${
              pythonHealth.status === 'online'
                ? 'status-online'
                : 'status-offline'
            }`}
          />

          <span>
            AI Server{' '}
            <strong>
              {pythonHealth.status === 'online'
                ? 'Online'
                : 'Offline'}
            </strong>
          </span>
        </div>
      </div>

      {/* KPI */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Tổng quan</h2>
            <span>Các chỉ số quan trọng của hệ thống</span>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Tổng người dùng"
            value={stats.totalUsers}
            icon={<UserOutlined />}
            iconClass="blue"
            description="Tổng số tài khoản người dùng"
          />

          <StatCard
            title="Tổng video"
            value={stats.totalVideos}
            icon={<VideoCameraOutlined />}
            iconClass="violet"
            description="Tổng số video đã được yêu cầu tạo"
          />

          <StatCard
            title="Doanh thu"
            value={Number(stats.totalRevenue || 0).toLocaleString('vi-VN')}
            suffix=" VND"
            icon={<DollarOutlined />}
            iconClass="green"
            description="Tổng doanh thu hiện tại"
          />

          <StatCard
            title="Credit lưu hành"
            value={stats.totalOutstandingCredits}
            icon={<WalletOutlined />}
            iconClass="orange"
            description="Tổng credit đang nằm trong tài khoản người dùng"
          />
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Phân tích hoạt động</h2>
            <span>Trực quan hóa dữ liệu hiện tại</span>
          </div>
        </div>

        <div className="analytics-grid">
          {/* VIDEO DONUT */}
          <Card className="dashboard-panel video-performance-panel">
            <div className="panel-header">
              <div>
                <h3>Hiệu suất tạo video</h3>
                <p>Tỷ lệ video thành công và thất bại</p>
              </div>

              <Tag
                color={successRate >= 90 ? 'success' : 'warning'}
                bordered={false}
              >
                {successRate}% thành công
              </Tag>
            </div>

            <div className="donut-wrapper">
              <div className="donut-chart">
                <Doughnut
                  data={videoChartData}
                  options={videoChartOptions}
                />

                <div className="donut-center">
                  <strong>{successRate}%</strong>
                  <span>Success rate</span>
                </div>
              </div>
            </div>

            <div className="performance-summary">
              <div>
                <span className="summary-dot success" />
                <span>Thành công</span>
                <strong>{stats.successfulVideos}</strong>
              </div>

              <div>
                <span className="summary-dot failed" />
                <span>Thất bại</span>
                <strong>{stats.failedVideos}</strong>
              </div>
            </div>
          </Card>

          {/* BAR */}
          <Card className="dashboard-panel activity-panel">
            <div className="panel-header">
              <div>
                <h3>Quy mô hệ thống</h3>
                <p>So sánh các chỉ số hiện tại</p>
              </div>

              <ArrowUpOutlined className="panel-action-icon" />
            </div>

            <div className="bar-chart-wrapper">
              <Bar
                data={systemChartData}
                options={systemChartOptions}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* SECONDARY METRICS */}
      <section className="dashboard-section">
        <div className="secondary-grid">
          <Card className="dashboard-panel mini-panel">
            <div className="mini-icon blue">
              <GiftOutlined />
            </div>

            <div>
              <span>Gói Credit đang bán</span>
              <strong>{stats.activePackages}</strong>
            </div>
          </Card>

          <Card className="dashboard-panel mini-panel">
            <div className="mini-icon purple">
              <TagsOutlined />
            </div>

            <div>
              <span>Khuyến mãi đang hoạt động</span>
              <strong>{stats.activePromotions}</strong>
            </div>
          </Card>

          <Card className="dashboard-panel mini-panel">
            <div className="mini-icon green">
              <CheckCircleOutlined />
            </div>

            <div>
              <span>Video thành công</span>
              <strong>{stats.successfulVideos}</strong>
            </div>
          </Card>

          <Card className="dashboard-panel mini-panel">
            <div className="mini-icon red">
              <CloseCircleOutlined />
            </div>

            <div>
              <span>Video lỗi / hoàn tiền</span>
              <strong>{stats.failedVideos}</strong>
            </div>
          </Card>
        </div>
      </section>

      {/* SERVER */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Hạ tầng AI</h2>
            <span>Giám sát Python rendering server</span>
          </div>
        </div>

        <div className="server-grid">
          {/* SERVER STATUS */}
          <Card className="dashboard-panel server-status-card">
            <div className="panel-header">
              <div>
                <h3>Render Server</h3>
                <p>Python AI processing service</p>
              </div>

              <div
                className={`server-status-badge ${
                  pythonHealth.status === 'online'
                    ? 'online'
                    : 'offline'
                }`}
              >
                <span />
                {pythonHealth.status === 'online'
                  ? 'ONLINE'
                  : 'OFFLINE'}
              </div>
            </div>

            <div className="server-main-status">
              <div
                className={`server-big-icon ${
                  pythonHealth.status === 'online'
                    ? 'online'
                    : 'offline'
                }`}
              >
                <ApiOutlined />
              </div>

              <div>
                <strong>
                  {pythonHealth.status === 'online'
                    ? 'Server đang hoạt động'
                    : 'Server đã ngắt kết nối'}
                </strong>

                <span>
                  {pythonHealth.status === 'online'
                    ? 'API đang sẵn sàng xử lý yêu cầu.'
                    : 'Kiểm tra Python server tại port 8000.'}
                </span>
              </div>
            </div>

            <div className="server-details">
              <div>
                <span>Endpoint</span>
                <strong>localhost:8000</strong>
              </div>

              <div>
                <span>Trạng thái</span>
                <strong>
                  {pythonHealth.status === 'online'
                    ? 'Healthy'
                    : 'Unavailable'}
                </strong>
              </div>
            </div>
          </Card>

          {/* STORAGE */}
          <Card className="dashboard-panel storage-card">
            <div className="panel-header">
              <div>
                <h3>Storage</h3>
                <p>Thư mục Outputs/</p>
              </div>

              <div className="storage-icon">
                <DatabaseOutlined />
              </div>
            </div>

            <div className="storage-value">
              <strong>
                {Number(pythonHealth.totalSizeMB || 0).toFixed(2)}
              </strong>

              <span>MB</span>
            </div>

            <Progress
              percent={storagePercent}
              showInfo={false}
              strokeWidth={8}
              trailColor="#edf0f5"
            />

            <div className="storage-meta">
              <span>
                <HddOutlined />
                {pythonHealth.fileCount} files
              </span>

              <span>{storagePercent}% used</span>
            </div>

            <div className="storage-tip">
              <ThunderboltOutlined />
              <span>
                Video và audio được lưu trữ trên AI server.
              </span>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

