import ReactGA from 'react-ga4';

// 初始化 Google Analytics
export const initGA = (trackingId) => {
  if (trackingId && trackingId !== 'G-XXXXXXXXXX') {
    try {
      ReactGA.initialize(trackingId, {
        gaOptions: {
          debug_mode: false,
          cookieFlags: 'SameSite=None;Secure'
        }
      });
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  } else {
    console.warn('Invalid or missing tracking ID');
  }
};

// 追踪页面访问
export const trackPageView = (path) => {
  try {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      // 添加更多上下文信息
      customParameters: {
        custom_parameter_1: 'blog_page'
      }
    });
    console.log('Page view tracked:', path);
  } catch (error) {
    console.error('Failed to track page view:', error);
    // 静默失败，不影响用户体验
  }
};

// 追踪自定义事件
export const trackEvent = (category, action, label) => {
  try {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
    console.log('Event tracked:', category, action, label);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// 简化的访客统计钩子
export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
  };
};

export default useAnalytics;