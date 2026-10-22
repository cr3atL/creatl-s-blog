import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';
import { archiveTerminalTheme, resolveUITheme } from './theme/uiTheme';

const queryTheme = new URLSearchParams(window.location.search).get('ui');
const configuredTheme = import.meta.env.VITE_UI_THEME || 'archive-terminal';
const uiTheme = resolveUITheme(queryTheme, configuredTheme);

document.documentElement.dataset.uiTheme = uiTheme;

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={
        uiTheme === 'archive-terminal' || uiTheme === 'ascii-modern'
          ? archiveTerminalTheme
          : undefined
      }
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

