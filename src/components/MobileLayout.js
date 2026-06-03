import React, { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout as AntLayout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from './AppShell';
import navItems from './navItems';

const { Header } = AntLayout;

const MobileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  return (
    <AppShell
      variant="mobile"
      header={(currentTime) => (
        <>
          <Header className="shell-header shell-header-mobile">
            <div className="blog-title shell-title-mobile">creatL's Blog</div>
            <div className="shell-time shell-mobile-time-inline">{currentTime}</div>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="shell-mobile-menu-button"
              aria-label="打开导航菜单"
            />
          </Header>

          <Drawer
            title="导航菜单"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            className="shell-drawer"
            width="min(304px, 88vw)"
          >
            <Menu
              theme="light"
              mode="vertical"
              selectedKeys={[location.pathname]}
              items={navItems}
              onClick={handleMenuClick}
              className="shell-drawer-menu"
            />
          </Drawer>
        </>
      )}
    >
      {children}
    </AppShell>
  );
};

export default MobileLayout;
