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
    colorPrimary: '#d8b45f',
    colorInfo: '#70cbd8',
    colorWarning: '#e0b968',
    colorError: '#e07a66',
    colorBgBase: '#060605',
    colorBgContainer: '#10100d',
    colorBgElevated: '#161510',
    colorBorder: 'rgba(241, 238, 228, 0.18)',
    colorText: '#f1eee4',
    colorTextSecondary: '#a8a193',
    borderRadius: 6,
    controlHeight: 36,
    fontFamily:
      'Inter, "Noto Sans SC", "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      primaryShadow: 'none',
    },
    Drawer: {
      colorBgElevated: '#10100d',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(216, 180, 95, 0.14)',
      itemBorderRadius: 4,
    },
  },
};

export const asciiModernTheme = archiveTerminalTheme;
