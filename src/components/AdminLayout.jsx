import React, { useMemo, useState } from 'react';
import { Layout, Menu, Button, Avatar, Tooltip, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  GiftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  VideoCameraOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = useMemo(
    () => [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
      },
      {
        key: '/users',
        icon: <UserOutlined />,
        label: 'Người dùng',
      },
      {
        key: '/packages',
        icon: <GiftOutlined />,
        label: 'Credit & Khuyến mãi',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Cài đặt hệ thống',
      },
    ],
    []
  );

  const pageTitle = useMemo(() => {
    const current = menuItems.find(
      (item) => item.key === location.pathname
    );

    return current?.label || 'Quản trị hệ thống';
  }, [location.pathname, menuItems]);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <>
      {/* LOGO */}
      <div className="admin-sidebar-brand">
        <div className="admin-logo">
          {}
          <img 
            src="/logoAIVideo-removebg-preview.png" 
            alt="AI Video Logo" 
            style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          />
        </div>

        {!collapsed && (
          <div className="admin-brand-text">
            <div className="admin-brand-title">AI VIDEO</div>
            <div className="admin-brand-subtitle">ADMIN PANEL</div>
          </div>
        )}
      </div>

      {/* MENU */}
      <div className="admin-sidebar-menu">
        <div className="admin-menu-label">
          {!collapsed && 'QUẢN LÝ'}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => handleNavigate(e.key)}
        />
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="admin-sidebar-footer">
        <div className="admin-system-status">
          <span className="admin-status-dot" />

          {!collapsed && (
            <span>Hệ thống đang hoạt động</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    // 1. KHÓA CHẶT LAYOUT GỐC THEO KÍCH THƯỚC MÀN HÌNH (Không cho phép cuộn)
    <Layout className="admin-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <Sider
        className="admin-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={78}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        // 2. ÉP SIDEBAR ĐỨNG IM (Chỉ cho phép thanh cuộn trong chính nó nếu menu quá dài)
        style={{ height: '100vh', overflow: 'auto' }}
      >
        {sidebarContent}
      </Sider>

      {/* =========================================================
          MOBILE DRAWER
      ========================================================= */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={270}
        closable={false}
        styles={{
          body: {
            padding: 0,
            background: '#ffffff',
          },
        }}
      >
        <div className="admin-mobile-sidebar">
          <div className="admin-mobile-close">
            <div className="admin-sidebar-brand">
              <div className="admin-logo">
                <VideoCameraOutlined />
              </div>

              <div className="admin-brand-text">
                <div className="admin-brand-title">AI VIDEO</div>
                <div className="admin-brand-subtitle">ADMIN PANEL</div>
              </div>
            </div>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileOpen(false)}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(e) => handleNavigate(e.key)}
          />
        </div>
      </Drawer>

      {/* =========================================================
          MAIN AREA (Content bên phải)
      ========================================================= */}
      {/* 3. TÁCH BIỆT THANH CUỘN CỦA NỘI DUNG (Chỉ phần bên phải được cuộn) */}
      <Layout className="admin-main-layout" style={{ height: '100vh', overflow: 'auto' }}>
        
        {/* HEADER */}
        <Header className="admin-header">
          <div className="admin-header-left">
            <Tooltip title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
              <Button
                className="admin-menu-toggle desktop-only"
                type="text"
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
              />
            </Tooltip>

            <Button
              className="admin-menu-toggle mobile-only"
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileOpen(true)}
            />

            <div className="admin-page-heading">
              <span className="admin-page-title">
                {pageTitle}
              </span>
            </div>
          </div>

          <div className="admin-header-right">
            {/* SYSTEM STATUS */}
            <div className="admin-header-status">
              <span className="admin-status-dot" />
              <span>Hệ thống ổn định</span>
            </div>

            {/* USER */}
            <div className="admin-user">
              <Avatar
                size={38}
                className="admin-user-avatar"
                icon={<UserOutlined />}
              />

              <div className="admin-user-info">
                <div className="admin-user-name">
                  Administrator
                </div>

                <div className="admin-user-role">
                  Quản trị viên
                </div>
              </div>
            </div>

            {/* LOGOUT */}
            <Tooltip title="Đăng xuất">
              <Button
                className="admin-logout-button"
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              />
            </Tooltip>
          </div>
        </Header>

        {/* CONTENT */}
        <Content className="admin-content-wrapper">
          <main className="admin-content">
            <div className="admin-page-animation">
              {children}
            </div>
          </main>
        </Content>

      </Layout>
    </Layout>
  );
};

export default AdminLayout;