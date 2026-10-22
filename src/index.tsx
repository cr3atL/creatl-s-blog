import React from 'react';
import ReactDOM from 'react-dom/client';
import MotionConfigProvider from './motion/MotionConfigProvider';
import './index.css';
import App from './App';
import { archiveTerminalTheme, creatlBrandTheme, resolveUITheme } from './theme/uiTheme';

const queryTheme = new URLSearchParams(window.location.search).get('ui');
const configuredTheme = import.meta.env.VITE_UI_THEME || 'creatl-brand';
const uiTheme = resolveUITheme(queryTheme, configuredTheme);

document.documentElement.dataset.uiTheme = uiTheme;

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MotionConfigProvider
      theme={
        uiTheme === 'creatl-brand' ? creatlBrandTheme : uiTheme === 'archive-terminal' || uiTheme === 'ascii-modern'
          ? archiveTerminalTheme
          : undefined
      }
    >
      <App />
    </MotionConfigProvider>
  </React.StrictMode>
);

