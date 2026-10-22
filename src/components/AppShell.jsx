import React from 'react';
import { Layout as AntLayout } from 'antd';
import AmbientCanvas from './ambient/AmbientCanvas';
import useStationClock from '../hooks/useStationClock';
import '../styles/shell.css';

const { Content, Footer } = AntLayout;

const AppShell = ({ children, header, variant = 'desktop' }) => {
  const currentTime = useStationClock();
  const uiTheme = document.documentElement.dataset.uiTheme;
  const showAtmosphere =
    uiTheme === 'archive-terminal' || uiTheme === 'ascii-modern';

  return (
    <div className="shell-root">
      <div className="shell-background" />
      {showAtmosphere && <AmbientCanvas />}

      <AntLayout className="shell-layout">
        {header(currentTime)}
        <Content className={`shell-content shell-content-${variant}`}>
          {children}
        </Content>
        <Footer className={`shell-footer shell-footer-${variant}`}>
          <div>© 2026 creatL / ARCHIVE STATUS: ONLINE / BUILT WITH REACT</div>
        </Footer>
      </AntLayout>
    </div>
  );
};

export default AppShell;
