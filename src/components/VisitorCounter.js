import React, { useState, useEffect } from 'react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // 检查是否是首次访问
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // 首次访问，增加计数器
      const currentCount = parseInt(localStorage.getItem('visitorCount') || '0');
      const newCount = currentCount + 1;
      
      localStorage.setItem('visitorCount', newCount.toString());
      localStorage.setItem('hasVisited', 'true');
      
      setVisitorCount(newCount);
      setIsFirstVisit(true);
    } else {
      // 非首次访问，只显示当前计数
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