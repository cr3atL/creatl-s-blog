import { theme as antdTheme } from 'antd';

const supportedThemes = ['legacy', 'ascii-modern'];

export const resolveUITheme = (queryTheme, configuredTheme = 'legacy') => {
  if (supportedThemes.includes(queryTheme)) {
    return queryTheme;
  }

  return supportedThemes.includes(configuredTheme) ? configuredTheme : 'legacy';
};

export const asciiModernTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#94d7aa',
    colorInfo: '#79c9d5',
    colorWarning: '#dfc47a',
    colorError: '#de7777',
    colorBgBase: '#080b0a',
    colorBgContainer: '#111713',
    colorBgElevated: '#161d19',
    colorBorder: 'rgba(197, 219, 207, 0.2)',
    colorText: '#e5e9e6',
    colorTextSecondary: '#a8b2ac',
    borderRadius: 6,
    controlHeight: 36,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Button: {
      primaryShadow: 'none',
    },
    Drawer: {
      colorBgElevated: '#111713',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(148, 215, 170, 0.14)',
      itemBorderRadius: 4,
    },
  },
};
