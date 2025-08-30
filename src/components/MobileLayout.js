import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Drawer, Button } from 'antd';
import { HomeOutlined, FileTextOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../images/Background.jpg';
import ParticleCanvas from './ParticleCanvas';


const { Header, Content, Footer } = AntLayout;

const MobileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/article',
      icon: <FileTextOutlined />,
      label: '文章',
    },
    {
      key: '/about',
      icon: <UserOutlined />,
      label: '关于',
    },
    {
      key: '/randomssiba',
      icon: <UserOutlined />,
      label: '随机兔子',
    },
    {
      key: '/chunithm-songs',
      icon: <UserOutlined />,
      label: 'CHUNITHM相关',
    },
    {
      key: '/sdvx-songs',
      icon: <UserOutlined />,
      label: 'SDVX相关',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* 背景图片层 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      
      <AntLayout style={{ 
        minHeight: '100vh',
        background: 'transparent',
        position: 'relative',
        zIndex: 1
      }}>

        <ParticleCanvas />

        <Header style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          padding: '8px 16px',
          height: 'auto'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 9s ease infinite',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}>
            creatL's Blog
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            fontWeight: '500',
            textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
          }}>
            {currentTime}
          </div>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ color: 'white', fontSize: '18px' }}
          />
        </Header>

        <Drawer
          title="导航菜单"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          style={{ background: 'rgba(0, 0, 0, 0.9)' }}
          width={200}
          extra={
            <Button
              type="text"
              onClick={() => setDrawerVisible(false)}
              style={{ color: 'white', fontSize: '16px' }}
            >
              ✕
            </Button>
          }
        >
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none', background: 'transparent' }}
          />
        </Drawer>

        <Content style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)',
          margin: '12px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          {children}
        </Content>
        
        <Footer style={{ 
          padding: '8px 0',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          fontSize: '12px'
        }}>
          <div>©2025 creatL . All rights reserved.</div>
        </Footer>
      </AntLayout>
    </div>
  );
};

export default MobileLayout;