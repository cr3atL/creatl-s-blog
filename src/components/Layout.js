import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../images/Background.jpg';
import ParticleCanvas from './ParticleCanvas';


const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    // 初始化时间
    updateTime();
    
    // 每秒更新一次时间
    const timer = setInterval(updateTime, 1000);
    
    // 组件卸载时清除定时器
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
        
        {/* 粒子动画层 - 放在毛玻璃上面 */}
        <ParticleCanvas />
        <Header className="header-container" style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div className="blog-title" style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginRight: '40px',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 9s ease infinite',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            creatL's Blog
          </div>
          <div className="menu-container" style={{ 
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0
          }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ flex: 1, minWidth: 0 }}
            />
            <div className="desktop-time" style={{ 
              fontSize: '16px', 
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              fontWeight: '500',
              marginLeft: '16px',
              whiteSpace: 'nowrap',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.5px'
            }}>
              {currentTime}
            </div>
          </div>
          <div className="mobile-time" style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            fontWeight: '500',
            width: '100%',
            textAlign: 'center',
            marginTop: '8px',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.5px',
            display: 'none'
          }}>
            {currentTime}
          </div>
        </Header>
        <Content style={{ 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(5px)',
          margin: '24px',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>
          {children}
        </Content>
        <Footer style={{ 
          padding: '10px 0',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3), 0 -2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          ©2025 creatL . All rights reserved. </Footer>

        
        {/* 下落效果层 - 放在毛玻璃上面 */}

      </AntLayout>
    </div>
  );
};

export default Layout;