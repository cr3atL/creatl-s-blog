import React, { useEffect, useState } from 'react';
import { Layout as AntLayout } from 'antd';
import backgroundImage from '../images/Background.jpg';
import '../styles/shell.css';

const { Content, Footer } = AntLayout;

const AppShell = ({ children, header, variant = 'desktop' }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="shell-root"
      style={{ '--shell-background-image': `url(${backgroundImage})` }}
    >
      <div className="shell-background" />

      <AntLayout className="shell-layout">
        {header(currentTime)}
        <Content className={`shell-content shell-content-${variant}`}>
          {children}
        </Content>
        <Footer className={`shell-footer shell-footer-${variant}`}>
          <div>©2025 creatL. All rights reserved.</div>
        </Footer>
      </AntLayout>
    </div>
  );
};

export default AppShell;
