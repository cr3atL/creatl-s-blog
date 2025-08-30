import React, { useState, useEffect } from 'react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // 生成或获取用户唯一标识符
    let visitorId = localStorage.getItem('visitorId');
    
    if (!visitorId) {
      // 新用户，生成唯一ID
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', visitorId);
      
      // 增加访客计数
      const currentCount = parseInt(localStorage.getItem('visitorCount') || '0');
      const newCount = currentCount + 1;
      
      localStorage.setItem('visitorCount', newCount.toString());
      setVisitorCount(newCount);
      setIsFirstVisit(true);
    } else {
      // 已存在的用户，只显示当前计数
      const currentCount = parseInt(localStorage.getItem('visitorCount') || '0');
      setVisitorCount(currentCount);
      setIsFirstVisit(false);
    }
  }, []);

  return (
    <div style={{
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: '8px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div>
        🌐 网站总访客数: <strong>{visitorCount}</strong>
      </div>
      {isFirstVisit && (
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginTop: '4px'
        }}>
          ✨ 欢迎您的首次访问！
        </div>
      )}
    </div>
  );
};

export default VisitorCounter;