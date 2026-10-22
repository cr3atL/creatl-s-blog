import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AmbientCanvas from './ambient/AmbientCanvas';
import usePageMotion from '../motion/usePageMotion';
import '../styles/shell.css';

export default function AppShell({ children, header, variant = 'desktop' }) {
  const contentRef = useRef(null);
  const { pathname } = useLocation();
  usePageMotion(contentRef, pathname);
  const theme = document.documentElement.dataset.uiTheme;
  const showAtmosphere = theme === 'archive-terminal' || theme === 'ascii-modern';
  return <div className="shell-root">
    {showAtmosphere && <AmbientCanvas />}
    <a className="shell-skip-link" href="#main-content">跳到正文</a>
    <div className="shell-layout">
      {header?.()}
      <main id="main-content" ref={contentRef} tabIndex={-1} className={`shell-content shell-content-${variant}`}>{children}</main>
      <footer className="shell-footer">© {new Date().getFullYear()} creatL</footer>
    </div>
  </div>;
}
