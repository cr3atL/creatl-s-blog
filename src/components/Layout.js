import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from './AppShell';
import navItems from './navItems';

const { Header } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AppShell
      header={(currentTime) => (
        <Header className="shell-header shell-header-desktop header-container">
          <div className="blog-title shell-title-desktop">creatL's Site</div>
          <div className="menu-container">
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={navItems}
              onClick={handleMenuClick}
              className="shell-desktop-menu"
            />
            <div className="shell-time desktop-time">{currentTime}</div>
          </div>
          <div className="shell-time mobile-time">{currentTime}</div>
        </Header>
      )}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
