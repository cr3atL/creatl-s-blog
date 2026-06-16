import { theme as antdTheme } from 'antd';

const supportedThemes = ['legacy', 'ascii-modern', 'archive-terminal'];

export const resolveUITheme = (queryTheme, configuredTheme = 'legacy') => {
  if (supportedThemes.includes(queryTheme)) {
    return queryTheme;
  }

  return supportedThemes.includes(configuredTheme) ? configuredTheme : 'legacy';
};

export const archiveTerminalTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#ffffff',
    colorInfo: '#ffffff',
    colorWarning: '#ffffff',
    colorError: '#ffffff',
    colorBgBase: '#000000',
    colorBgContainer: '#000000',
    colorBgElevated: '#000000',
    colorBorder: 'rgba(255, 255, 255, 0.28)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.18)',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.64)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    boxShadow: 'none',
    boxShadowSecondary: 'none',
    controlHeight: 36,
    fontFamily:
      'Inter, "Noto Sans SC", "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      borderRadius: 0,
      defaultBg: '#000000',
      defaultBorderColor: 'rgba(255, 255, 255, 0.28)',
      defaultColor: '#ffffff',
      primaryColor: '#000000',
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: 0,
      colorBgContainer: '#000000',
      boxShadowTertiary: 'none',
    },
    Drawer: {
      borderRadiusLG: 0,
      colorBgElevated: '#000000',
    },
    Input: {
      borderRadius: 0,
      colorBgContainer: '#000000',
    },
    Modal: {
      borderRadiusLG: 0,
      colorBgElevated: '#000000',
    },
    Pagination: {
      borderRadius: 0,
      itemActiveBg: '#000000',
    },
    Select: {
      borderRadius: 0,
      colorBgContainer: '#000000',
      colorBgElevated: '#000000',
    },
    Table: {
      borderRadius: 0,
      colorBgContainer: '#000000',
      colorBgElevated: '#000000',
      headerBg: '#000000',
    },
    Tag: {
      borderRadiusSM: 0,
      defaultBg: '#000000',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(255, 255, 255, 0.08)',
      itemBorderRadius: 0,
    },
  },
};

export const asciiModernTheme = archiveTerminalTheme;
