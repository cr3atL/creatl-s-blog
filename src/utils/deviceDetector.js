/**
 * 设备检测工具函数
 */

/**
 * 检测是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobileDevice = () => {
  // 检查用户代理字符串
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // 移动设备关键字
  const mobileKeywords = [
    'Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry',
    'Windows Phone', 'IEMobile', 'Opera Mini', 'Mobile'
  ];
  
  // 检查是否包含移动设备关键字
  const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // 检查屏幕宽度（小于768px认为是移动设备）
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobile || isSmallScreen;
};

/**
 * 检测是否为平板设备
 * @returns {boolean} 是否为平板设备
 */
export const isTabletDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const tabletKeywords = ['iPad', 'Tablet', 'Android'];
  const isTablet = tabletKeywords.some(keyword => userAgent.includes(keyword));
  const screenWidth = window.innerWidth;
  
  // 屏幕宽度在768px到1024px之间认为是平板
  return isTablet || (screenWidth > 768 && screenWidth <= 1024);
};

/**
 * 检测是否为桌面设备
 * @returns {boolean} 是否为桌面设备
 */
export const isDesktopDevice = () => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * 获取设备类型
 * @returns {string} 设备类型：'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = () => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

/**
 * 监听屏幕尺寸变化
 * @param {Function} callback 回调函数，参数为设备类型
 * @returns {Function} 清理函数
 */
export const watchDeviceChange = (callback) => {
  const handleResize = () => {
    const deviceType = getDeviceType();
    callback(deviceType);
  };
  
  window.addEventListener('resize', handleResize);
  
  // 立即执行一次
  handleResize();
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};