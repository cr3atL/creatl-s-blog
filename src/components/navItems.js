import React from 'react';
import {
  AppstoreOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';

const navItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'HOME',
  },
  {
    key: '/article',
    icon: <FileTextOutlined />,
    label: 'WRITING',
  },
  {
    key: '/tools',
    icon: <AppstoreOutlined />,
    label: 'TOOLS',
  },
  {
    key: '/about',
    icon: <UserOutlined />,
    label: 'ABOUT',
  },
];

export default navItems;
