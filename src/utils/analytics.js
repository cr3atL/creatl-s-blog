import ReactGA from 'react-ga4';

// 初始化 Google Analytics
export const initGA = (trackingId) => {
  if (trackingId && trackingId !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(trackingId);
  }
};

// 追踪页面访问
export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// 简化的访客统计钩子
export const useAnalytics = () => {
  return {
    trackPageView,
  };
};

export default useAnalytics;