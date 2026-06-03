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
    label: '首页',
  },
  {
    key: '/article',
    icon: <FileTextOutlined />,
    label: '文章',
  },
  {
    key: '/tools',
    icon: <AppstoreOutlined />,
    label: '工具',
  },
  {
    key: '/about',
    icon: <UserOutlined />,
    label: '关于',
  },
];

export default navItems;
