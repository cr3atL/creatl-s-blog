import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import '../styles/pages/random-image.css';

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
        <section
          className="random-image-hero"
          aria-labelledby="random-image-hero-title"
        >
          <span className="random-image-hero__eyebrow">TOOL / RANDOM IMAGE</span>
          <h1 id="random-image-hero-title" className="random-image-hero__title">
            随机兔子图片
          </h1>
          <p className="random-image-hero__intro">
            从本地图片集中随机抽一张兔子图片。媒体区域是主要舞台，按钮提供
            重新选择和下载两种动作。
          </p>
        </section>

        <section
          className="random-image-section"
          aria-labelledby="random-image-stage-title"
        >
          <SectionHeader
            number="M.1"
            title="MEDIA STAGE"
            id="random-image-stage-title"
            meta={loading ? 'LOADING' : currentImage ? 'READY' : 'EMPTY'}
          />
          <div className="random-image-stage" aria-live="polite">
            {loading ? (
              <div className="random-image-status" role="status">
                <span className="random-image-status__pulse" aria-hidden="true">
                  *
                </span>
                <span className="random-image-status__text">
                  [LOADING] selecting archive item...
                </span>
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
              <div className="random-image-empty" role="status">
                [EMPTY] no media found
              </div>
            )}
          </div>

          <div className="random-image-controls">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadNewImage}
              loading={loading}
              size="large"
              className="random-image-control"
              aria-label="REROLL 换一张"
            >
              REROLL
            </Button>

            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={downloadImage}
              disabled={!currentImage || loading}
              size="large"
              className="random-image-control"
              aria-label={isVideoFile(currentImage) ? '下载视频' : '下载图片'}
            >
              {isVideoFile(currentImage) ? 'DOWNLOAD VIDEO' : 'DOWNLOAD IMAGE'}
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Randomssiba;
