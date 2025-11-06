import React from 'react';
import { Spin } from 'antd';

// 默认的占位图片（Base64编码的1x1透明PNG）
const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

// 将maimai.sega.jp的图片URL转换为cloudfront.net的URL
const convertImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE;
  
  // 处理歌曲封面图片
  if (url.includes('maimai.sega.jp/img/music/')) {
    // 提取图片文件名（不包含扩展名）
    const filenameWithExt = url.split('/img/music/')[1];
    const filename = filenameWithExt.replace('.png', '');
    return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${filename}`;
  }
  
  // 处理分类图标
  if (url.includes('maimai.sega.jp/img/category/')) {
    const filenameWithExt = url.split('/img/category/')[1];
    const filename = filenameWithExt.replace('.png', '');
    return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/category/${filename}`;
  }
  
  // 处理版本图标
  if (url.includes('maimai.sega.jp/img/version/')) {
    const filenameWithExt = url.split('/img/version/')[1];
    const filename = filenameWithExt.replace('.png', '');
    return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/version/${filename}`;
  }
  
  // 处理类型图标
  if (url.includes('maimai.sega.jp/img/type/')) {
    const filenameWithExt = url.split('/img/type/')[1];
    const filename = filenameWithExt.replace('.png', '');
    return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/type/${filename}`;
  }
  
  // 处理难度图标
  if (url.includes('maimai.sega.jp/img/diff/')) {
    const filenameWithExt = url.split('/img/diff/')[1];
    const filename = filenameWithExt.replace('.png', '');
    return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/diff/${filename}`;
  }
  
  return url;
};

const SafeImage = ({ src, alt, style = {}, className = "" }) => {
  const [imgSrc, setImgSrc] = React.useState(DEFAULT_IMAGE);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  React.useEffect(() => {
    if (!src) {
      setImgSrc(DEFAULT_IMAGE);
      setLoading(false);
      return;
    }
    
    // 转换图片URL
    const convertedUrl = convertImageUrl(src);
    setImgSrc(convertedUrl);
    setLoading(false);
    
    return () => {
      // 清理对象URL
      if (imgSrc && imgSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [src, imgSrc]);
  
  const defaultStyle = {
    display: 'block',
    ...style
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
        <Spin size="small" />
      </div>
    );
  }
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      style={defaultStyle}
      className={className}
      onError={() => {
        if (!error) {
          setImgSrc(DEFAULT_IMAGE);
          setError(true);
        }
      }}
    />
  );
};

export default SafeImage;