import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import MobileLayout from './MobileLayout';
import { getDeviceType, watchDeviceChange } from '../utils/deviceDetector';
import '../styles/shell.css';

const ResponsiveLayout = ({ children }) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDeviceType(getDeviceType());
    setIsLoading(false);

    const cleanup = watchDeviceChange(setDeviceType);

    return cleanup;
  }, []);

  if (isLoading) {
    return <div className="shell-loading">加载中...</div>;
  }

  const LayoutComponent = deviceType === 'mobile' ? MobileLayout : Layout;

  return <LayoutComponent>{children}</LayoutComponent>;
};

export default ResponsiveLayout;
