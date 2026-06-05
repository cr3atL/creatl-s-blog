import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { archiveTerminalTheme, resolveUITheme } from './theme/uiTheme';

const queryTheme = new URLSearchParams(window.location.search).get('ui');
const configuredTheme = process.env.REACT_APP_UI_THEME || 'archive-terminal';
const uiTheme = resolveUITheme(queryTheme, configuredTheme);

document.documentElement.dataset.uiTheme = uiTheme;

const root = ReactDOM.createRoot(document.getElementById('root'));
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
