import { useRef, useState } from 'react';
import { Button } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import ResponsiveLayout from '../components/ResponsiveLayout';
import '../styles/pages/content-pages.css';
import '../styles/pages/random-image.css';

const images = Object.values(import.meta.glob<string>(
  '../ssiba/*.{png,jpg,jpeg,svg,gif}',
  { eager: true, query: '?url', import: 'default' }
));

function chooseImage(previous = '') {
  const candidates = images.filter(image => image !== previous);
  const pool = candidates.length ? candidates : images;
  return pool[Math.floor(Math.random() * pool.length)] || '';
}

export default function Randomssiba() {
  const [currentImage, setCurrentImage] = useState(() => chooseImage());
  const [loading, setLoading] = useState(Boolean(currentImage));
  const [failed, setFailed] = useState(false);
  const request = useRef(0);
  const [revision, setRevision] = useState(0);
  const loadNewImage = () => {
    const next = chooseImage(currentImage);
    request.current += 1;
    setRevision(request.current);
    setFailed(false);
    setLoading(Boolean(next));
    setCurrentImage(next);
  };
  const downloadImage = () => {
    if (!currentImage || loading || failed) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = currentImage.split('/').pop()?.split('?')[0] || 'rabbit-image';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return <ResponsiveLayout>
    <div className="content-page random-image-page">
      <h1 data-motion-section>随机兔子图片</h1>
      <div data-motion-section>
        <div className="random-image-stage" aria-busy={loading}>
          {currentImage && !failed && <img key={`${revision}-${currentImage}`} src={currentImage} alt="随机兔子"
            className="random-image-media" data-image-revealing={revision > 0 && !loading ? '' : undefined}
            onLoad={() => { if (revision === request.current) setLoading(false); }}
            onError={() => { if (revision === request.current) { setLoading(false); setFailed(true); } }} />}
          {loading && <p key={revision} className={`random-image-status${revision > 0 ? ' motion-feedback' : ''}`} role="status">图片加载中…</p>}
          {!currentImage && <p role="status">暂时没有可用图片。</p>}
          {failed && <p className="motion-feedback" role="alert">图片加载失败，请换一张重试。</p>}
        </div>
        <div className="random-image-controls">
          <Button type="primary" icon={<ReloadOutlined />} onClick={loadNewImage} size="large">换一张</Button>
          <Button icon={<DownloadOutlined />} onClick={downloadImage} disabled={!currentImage || loading || failed} size="large">下载图片</Button>
        </div>
      </div>
    </div>
  </ResponsiveLayout>;
}
