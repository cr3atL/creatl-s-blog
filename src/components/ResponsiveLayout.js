import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import MobileLayout from './MobileLayout';
import { getDeviceType, watchDeviceChange } from '../utils/deviceDetector';

const ResponsiveLayout = ({ children }) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化设备类型
    setDeviceType(getDeviceType());
    setIsLoading(false);

    // 监听设备类型变化
    const cleanup = watchDeviceChange(setDeviceType);

    return cleanup;
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '18px'
      }}>
        加载中...
      </div>
    );
  }

  // 根据设备类型选择布局
  const LayoutComponent = deviceType === 'mobile' ? MobileLayout : Layout;

  return <LayoutComponent>{children}</LayoutComponent>;
};

export default ResponsiveLayout;