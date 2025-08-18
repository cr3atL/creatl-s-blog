import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import React from "react";
import {Button, Typography, Spin,} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const importAll = (r) => {
  return r.keys().map(r);
};

const images = [];
try {
  const requireContext = require.context('../ssiba', false, /\.(png|jpe?g|svg|gif)$/);

  images.push(...importAll(requireContext));
} catch (error) {
  console.error('Error loading images:', error);
}


const Randomssiba = () => {
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);

  const getRandomImage = () => {
    if (images.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

   const loadNewImage = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setCurrentImage(getRandomImage());
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    loadNewImage();
  }, [loadNewImage]);

  return (
    <Layout>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        textAlign: "center",
        padding: "20px"
      }}>
        <Title level={2}>随机兔子图片</Title>
        
        <div style={{ 
          margin: "20px 0",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {loading ? (
            <Spin size="large" tip="加载中..." />
          ) : currentImage ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={currentImage}
                alt="随机兔子"
                style={{
                  maxWidth: "250px",
                  maxHeight: "250px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease"
                }}
                onLoad={(e) => {
                  // 图片加载完成后的处理
                  e.target.style.opacity = "0";
                  setTimeout(() => {
                    e.target.style.opacity = "1";
                  }, 50);
                }}
              />
            </div>
          ) : (
            <div style={{ color: "#999", fontSize: "16px" }}>
              没有找到图片文件
            </div>
          )}
        </div>
        
        <div style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadNewImage}
            loading={loading}
            size="large"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
              border: "none",
              borderRadius: "20px",
              padding: "0 20px",
              height: "40px"
            }}
          >
            换一张
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Randomssiba;
