import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography, Spin } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title, Paragraph } = Typography;

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

  const isVideoFile = (filePath) => {
    return filePath.toLowerCase().endsWith('.mp4');
  };

  const loadNewImage = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setCurrentImage(getRandomImage());
      setLoading(false);
    }, 300);
  }, []);

  const downloadImage = () => {
    if (!currentImage) return;

    const link = document.createElement('a');
    link.href = currentImage;
    link.download = currentImage.split('/').pop() || 'rabbit-image';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadNewImage();
  }, [loadNewImage]);

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium random-image-page">
        <section className="page-hero">
          <div className="page-hero-content">
            <div className="page-eyebrow">Tool</div>
            <Title level={2}>随机兔子图片</Title>
            <Paragraph className="page-intro">
              从本地图片集中随机抽一张，想换一张就再点一次。
            </Paragraph>
          </div>
        </section>

        <section className="page-section random-image-panel">
          <div className="random-image-stage" aria-live="polite">
            {loading ? (
              <div className="random-image-status">
                <Spin size="large" />
                <span>正在接收图像信号...</span>
              </div>
            ) : currentImage ? (
              <div className="random-image-preview">
                {isVideoFile(currentImage) ? (
                  <video
                    src={currentImage}
                    controls
                    autoPlay
                    muted
                    loop
                    className="random-image-media"
                    onLoadedData={(event) => {
                      event.target.style.opacity = '0';
                      setTimeout(() => {
                        event.target.style.opacity = '1';
                      }, 50);
                    }}
                  />
                ) : (
                  <img
                    src={currentImage}
                    alt="随机兔子"
                    className="random-image-media"
                    onLoad={(event) => {
                      event.target.style.opacity = '0';
                      setTimeout(() => {
                        event.target.style.opacity = '1';
                      }, 50);
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="empty-state">没有找到图片文件</div>
            )}
          </div>

          <div className="page-action-row random-image-actions">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadNewImage}
              loading={loading}
              size="large"
            >
              换一张
            </Button>

            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={downloadImage}
              disabled={!currentImage || loading}
              size="large"
            >
              {isVideoFile(currentImage) ? '下载视频' : '下载图片'}
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Randomssiba;
